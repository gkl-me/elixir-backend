import Stripe from "stripe";
import { injectable } from "tsyringe";
import { CustomError } from "../errors/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";
import { IStripeService } from "./interfaces/IStripeService";
import logger from "../middlewares/logger";
import { CONSTANT_MESSAGES, PLAN_MESSAGES } from "../constants/messages";
import { ENV } from "../constants/env";

@injectable()
export class StripeService implements IStripeService {
  private _stripe: Stripe;

  constructor() {
    const key = process.env.STRIPE_KEY;
    if (!key) {
      logger.error("Stripe key env is empty");
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }

    this._stripe = new Stripe(key);
    return;
  }

  async createProduct(planName: string): Promise<string> {
    try {
      const product = await this._stripe.products.create({
        name: planName,
        metadata: {
          planName,
        },
      });

      return product.id;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        PLAN_MESSAGES.STRIPE_PRODUCT_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createPrice(productId: string, price: number): Promise<string> {
    try {
      const stripePrice = await this._stripe.prices.create({
        product: productId,
        unit_amount: price,
        currency: "usd",
        recurring: {
          interval: "month",
        },
      });
      return stripePrice.id;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        PLAN_MESSAGES.STRIPE_PRICE_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findProduct(planType: string): Promise<string | null> {
    try {
      const products = await this._stripe.products.search({
        query: `metadata['planName']:'${planType}'`,
      });

      return products.data[0]?.id ?? null;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        PLAN_MESSAGES.STRIPE_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findLatestPrice(productId: string): Promise<string | null> {
    try {
      const prices = await this._stripe.prices.list({
        product: productId,
        active: true,
        type: "recurring",
      });

      const latest = prices.data
        .filter((p) => p.recurring?.interval === "month")
        .sort((a, b) => b.created - a.created)[0];

      return latest?.id || null;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        PLAN_MESSAGES.STRIPE_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPrice(priceId: string): Promise<Stripe.Price> {
    try {
      return await this._stripe.prices.retrieve(priceId);
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        PLAN_MESSAGES.STRIPE_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createCustomer(
    email: string,
    name: string,
    userId: string
  ): Promise<string | null> {
    try {
      const customer = await this._stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
        },
      });

      return customer?.id || null;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
    userId: string,
    planId: string
  ): Promise<{ sessionId: string; payment_url: string }> {
    try {
      const session = await this._stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card", "us_bank_account"],
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${ENV.CLIENT_URL}/payment/verify?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ENV.CLIENT_URL}/payment/verify`,
        subscription_data: {
          metadata: {
            userId,
            planId,
          },
        },
      });

      //maybe add metadata for future user
      return {
        sessionId: session.id,
        payment_url: session.url || "",
      };
    } catch (error) {
      console.log("error in stripe checkout", error);
      logger.error("Failed to create checkout session", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async retriveSession(
    sessionId: string
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    try {
      return await this._stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      logger.error("Failed to retriver checkout session", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async expireSession(
    sessionId: string
  ): Promise<Stripe.Response<Stripe.Checkout.Session> | null> {
    try {
      const seession = await this._stripe.checkout.sessions.retrieve(sessionId);
      if (seession.status === "open") {
        return await this._stripe.checkout.sessions.expire(sessionId);
      }

      return null;
    } catch (error) {
      logger.error("Failed to expires checkout session", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSubscription(
    customerId: string
  ): Promise<Stripe.Subscription | null> {
    try {
      const subs = await this._stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 5,
      });

      console.log("sub list", subs);

      return (
        subs.data.find((s) =>
          ["active", "trialing", "past_due", "incomplete"].includes(s.status)
        ) ?? null
      );
    } catch (error) {
      logger.error("Failed to get open invoices", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this._stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      logger.error("Cancel Subscription failed", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getOpenInvoice(customerId: string): Promise<Stripe.Invoice | null> {
    try {
      const invoices = await this._stripe.invoices.list({
        customer: customerId,
        status: "open",
        limit: 1,
      });

      return invoices.data[0] ?? null;
    } catch (error) {
      logger.error("Failed to get open invoices", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async constructEvent(
    payload: Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    try {
      return this._stripe.webhooks.constructEvent(
        payload,
        signature,
        ENV.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSubscriptionFromInvoice(
    invoice: Stripe.Invoice
  ): Promise<Stripe.Invoice.Parent.SubscriptionDetails | null> {
    try {
      const subscription = invoice.parent?.subscription_details;

      if (typeof subscription === "string")
        throw new CustomError(
          CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );

      return subscription ?? null;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}
