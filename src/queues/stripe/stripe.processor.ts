import { Job } from "bullmq";
import Stripe from "stripe";
import logger from "../../middlewares/logger";
import { container } from "tsyringe";
import { IStripeService } from "../../providers/interfaces/IStripeService";
import { Token } from "../../di/token";
import { IOnboardingRepository } from "../../repositories/onboarding/interface/IOnboardingRepository";
import { CustomError } from "../../errors/CustomError";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { ICompanyRepository } from "../../repositories/company/interface/ICompanyRepository";
import { ISubscriptionRepository } from "../../repositories/subscription/interface/ISubscriptionRepository";
import { IPlanRepository } from "../../repositories/plan/interfaces/IPlanRepository";
import { IWorkspaceService } from "../../services/workspace/interface/IWorkspaceService";
import { logError, logInfo } from "../../middlewares/loggerHelper";
import { ITransactionService } from "../../services/transaction/interface/ITransactionService";

export async function handleStripeEventProcessor(job: Job): Promise<void> {
  const { event } = job.data as { event: Stripe.Event };

  switch (event.type) {
    case "invoice.payment_succeeded":
      await handlePaymentSuccess(event);
      break;
    case "invoice.payment_failed":
      await handlePaymentFailed(event);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event);
      break;
    default:
      break;
  }

  return;
}

function getPaymentIntentIdFromInvoice(invoice: Stripe.Invoice): string | undefined {
  // 1. Direct payment_intent property on invoice
  const directPi = (invoice as any).payment_intent;
  if (directPi) {
    return typeof directPi === "string" ? directPi : directPi.id;
  }

  // 2. invoice.payments array (Stripe 18.x)
  const paymentsData = invoice.payments?.data;
  if (paymentsData && paymentsData.length > 0) {
    const firstItem = paymentsData[0] as any;
    if (firstItem.payment?.payment_intent) {
      return typeof firstItem.payment.payment_intent === "string"
        ? firstItem.payment.payment_intent
        : firstItem.payment.payment_intent.id;
    }
    if (firstItem.payment_intent) {
      return typeof firstItem.payment_intent === "string"
        ? firstItem.payment_intent
        : firstItem.payment_intent.id;
    }
    if (firstItem.payment?.charge) {
      return typeof firstItem.payment.charge === "string"
        ? firstItem.payment.charge
        : firstItem.payment.charge.id;
    }
  }

  // 3. Direct charge property on invoice
  const directCharge = (invoice as any).charge;
  if (directCharge) {
    return typeof directCharge === "string" ? directCharge : directCharge.id;
  }

  return undefined;
}

async function handlePaymentSuccess(event: Stripe.Event): Promise<void> {
  try {
    console.log("Payment success");

    const _stripeService = container.resolve<IStripeService>(
      Token.StripeService
    );
    const _onboardingRepository = container.resolve<IOnboardingRepository>(
      Token.OnboardingRepository
    );
    const _companyRepository = container.resolve<ICompanyRepository>(
      Token.CompanyRepository
    );
    const _workspaceService = container.resolve<IWorkspaceService>(
      Token.WorkspaceService
    );
    const _subscriptionRepository = container.resolve<ISubscriptionRepository>(
      Token.SubscriptionRepository
    );
    const _planRepository = container.resolve<IPlanRepository>(
      Token.PlanRepository
    );
    const _transactionService = container.resolve<ITransactionService>(
      Token.TransactionService
    )

    const invoice = event.data.object as Stripe.Invoice;

    const sub = await _stripeService.getSubscriptionFromInvoice(invoice);

    const userId = sub?.metadata?.userId;
    const planId = sub?.metadata?.planId || "";

    const stripeSubId = sub?.subscription as string;

    const paymentIntentId = getPaymentIntentIdFromInvoice(invoice);

    let pi: Stripe.PaymentIntent | null = null;
    let brand = "Card";
    let last4 = "4242";
    let chargeId = "";

    if (paymentIntentId) {
      if (paymentIntentId.startsWith("pi_")) {
        pi = await _stripeService.retrivePaymentIntent(paymentIntentId);
        if (pi) {
          const paymentMethod = pi.payment_method as Stripe.PaymentMethod | null;
          const charge = pi.latest_charge as Stripe.Charge | null;
          brand = paymentMethod?.card?.brand || "Card";
          last4 = paymentMethod?.card?.last4 || "4242";
          chargeId = charge?.id || "";
        }
      } else if (paymentIntentId.startsWith("ch_")) {
        chargeId = paymentIntentId;
      }
    }

    console.log("[Stripe Processor] handlePaymentSuccess context:", {
      invoiceId: invoice.id,
      customerEmail: invoice.customer_email,
      paymentIntentId,
      stripeSubId,
      userId,
      planId,
      hasPaymentIntent: !!pi,
      brand,
      last4,
      chargeId,
    });




    const existingSub = await _subscriptionRepository.findOne({
      stripeSubscriptionId: stripeSubId
    })

    if (existingSub) {
      logInfo("Processuing recurring renewal payment")

      existingSub.status = "active",
        existingSub.cancelAtPeriodEnd = false
      existingSub.currentPeriodStart = new Date(invoice.period_start * 1000)
      existingSub.currentPeriodEnd = new Date(invoice.period_end * 1000)
      await existingSub.save()


      //need to add transaction
      console.log("[Stripe Processor] Creating renewal transaction for workspace:", existingSub.workspaceId);
      await _transactionService.createTransaction({
        transactionRef: pi?.id || paymentIntentId || invoice.id || "",
        invoiceNumber: invoice.number || `INV-RENEW-${Date.now()}`,
        userId: existingSub.userId,
        workspaceId: existingSub.workspaceId,
        subscriptionId: existingSub.id,
        customerEmail: invoice.customer_email!,
        amount: invoice.amount_paid,
        currency: invoice.currency.toUpperCase(),
        status: 'success',
        paymentMethod: brand || "Card",
        last4: last4 || "4242",
        planType: existingSub.planType,
        stripeInvoiceId: invoice.id || "",
        stripeChargeId: chargeId,
        invoicePdfUrl: invoice.invoice_pdf || "",
      });
      console.log("[Stripe Processor] Renewal transaction created successfully.");

      return
    }


    const onboarding = await _onboardingRepository.findOne({ userId });
    const plan = await _planRepository.findById(planId);

    if (!onboarding || !plan) {
      console.log("[Stripe Processor] handlePaymentSuccess missing records:", {
        hasOnboarding: !!onboarding,
        hasPlan: !!plan,
        userId,
        planId,
      });
      throw new CustomError(
        CONSTANT_MESSAGES.BAD_REQUEST,
        STATUS_CODES.BAD_REQUEST
      );
    }

    let companyId;

    if (onboarding.planType === "Enterprice" && onboarding.company) {
      const company = await _companyRepository.create(onboarding.company);
      companyId = company.id;
    }

    const workspace = await _workspaceService.bootStrapWorkspace({
      ownerId: userId!,
      workspaceName: onboarding.workspaceName || "Personal Workspace",
      planId: onboarding.planId,
      stripePriceId: plan.stripePriceId,
      stripeSubscriptionId: sub?.subscription as string,
      companyId,
    });

    //need to add transaction
    console.log("[Stripe Processor] Creating initial onboarding transaction for workspace:", workspace.id);
    await _transactionService.createTransaction({
      transactionRef: pi?.id || paymentIntentId || invoice.id || "",
      invoiceNumber: invoice.number || `INV-INIT-${Date.now()}`,
      userId: userId!,
      workspaceId: workspace.id,
      subscriptionId: workspace?.subscriptionId || "",
      customerEmail: invoice.customer_email!,
      amount: invoice.amount_paid,
      currency: invoice.currency.toUpperCase(),
      status: 'success',
      paymentMethod: brand || "Card",
      last4: last4 || "4242",
      planType: onboarding.planType,
      stripeInvoiceId: invoice.id || "",
      stripeChargeId: chargeId,
      invoicePdfUrl: invoice.invoice_pdf || "",
    });
    console.log("[Stripe Processor] Initial transaction created successfully.");

    onboarding.paymentStatus = "success";
    onboarding.isCompleted = true;
    onboarding.workspaceSlug = workspace?.slug;
    await onboarding.save();
  } catch (error) {
    console.log("payment success error", error);
    logger.error(error);
  }
}

async function handlePaymentFailed(event: Stripe.Event): Promise<void> {
  try {
    console.log("Payment failed");

    const _onboardingRepository = container.resolve<IOnboardingRepository>(
      Token.OnboardingRepository
    );
    const _stripeService = container.resolve<IStripeService>(
      Token.StripeService
    );
    const _subscriptionRepository = container.resolve<ISubscriptionRepository>(
      Token.SubscriptionRepository
    );
    const _transactionService = container.resolve<ITransactionService>(
      Token.TransactionService
    )

    const invoice = event.data.object as Stripe.Invoice;

    const sub = await _stripeService.getSubscriptionFromInvoice(invoice);
    const userId = sub?.metadata?.userId;

    const stripeSubId = sub?.subscription as string;

    const paymentIntentId = getPaymentIntentIdFromInvoice(invoice);

    let pi: Stripe.PaymentIntent | null = null;
    let brand = "Card";
    let last4 = "4242";
    let chargeId = "";

    if (paymentIntentId) {
      pi = await _stripeService.retrivePaymentIntent(paymentIntentId);
      if (pi) {
        const paymentMethod = pi.payment_method as Stripe.PaymentMethod | null;
        const charge = pi.latest_charge as Stripe.Charge | null;
        brand = paymentMethod?.card?.brand || "Card";
        last4 = paymentMethod?.card?.last4 || "4242";
        chargeId = charge?.id || "";
      }
    }

    console.log("[Stripe Processor] handlePaymentFailed context:", {
      invoiceId: invoice.id,
      customerEmail: invoice.customer_email,
      paymentIntentId,
      stripeSubId,
      userId,
      hasPaymentIntent: !!pi,
      brand,
      last4,
      chargeId,
    });


    const existingSub = await _subscriptionRepository.findOne({
      stripeSubscriptionId: stripeSubId
    })

    if (existingSub) {
      logInfo("Processuing recurring renewal payment")

      existingSub.status = "past_due",
        await existingSub.save()


      //need to add transaction
      await _transactionService.createTransaction({
        transactionRef: pi?.id || paymentIntentId || invoice.id || "",
        invoiceNumber: invoice.number || `INV-FAIL-${Date.now()}`,
        userId: existingSub.userId,
        workspaceId: existingSub.workspaceId,
        subscriptionId: String(existingSub._id),
        customerEmail: invoice.customer_email || "",
        amount: invoice.amount_due,
        currency: invoice.currency.toUpperCase(),
        status: "failed",
        paymentMethod: brand || "Card",
        last4: last4 || "XXXX",
        planType: existingSub.planType,
        stripeInvoiceId: invoice.id || "",
        stripeChargeId: chargeId,
        invoicePdfUrl: invoice.invoice_pdf || "",
      });


      return
    }

    const onboarding = await _onboardingRepository.findOne({ userId });
    if (!onboarding) {
      console.log("[Stripe Processor] handlePaymentFailed missing onboarding for userId:", userId);
      throw new CustomError(
        CONSTANT_MESSAGES.BAD_REQUEST,
        STATUS_CODES.BAD_REQUEST
      );
    }

    onboarding.paymentStatus = "failed";
    onboarding.isCompleted = true;

    await onboarding.save();
  } catch (error) {
    console.log("payment failed Error", error);
    logger.error(error);
  }
}


async function handleSubscriptionUpdated(event: Stripe.Event): Promise<void> {

  try {

    const _subscriptionRepository = container.resolve<ISubscriptionRepository>(
      Token.SubscriptionRepository
    );

    const stripeSub = event.data.object as Stripe.Subscription

    const sub = await _subscriptionRepository.findOne({
      stripeSubscriptionId: stripeSub.id
    })

    if (!sub) return

    sub.status = sub.status === "active" ? "active" : stripeSub.status
    sub.cancelAtPeriodEnd = stripeSub.cancel_at_period_end
    await sub.save()

  } catch (error) {
    logError(error, {
      service: "Stripe.Processor.updateSubscription"
    })
    throw error
  }

}


async function handleSubscriptionDeleted(event: Stripe.Event): Promise<void> {
  try {

    const _subscriptionRepository = container.resolve<ISubscriptionRepository>(
      Token.SubscriptionRepository
    );

    const stripSub = event.data.object as Stripe.Subscription

    const sub = await _subscriptionRepository.findOne({
      stripeSubscriptionId: stripSub.id
    })

    if (!sub) return

    sub.status = "canceled"
    sub.cancelAtPeriodEnd = true
    await sub.save()

  } catch (error) {
    logError(error, {
      service: "Stripe.Processor.delteSubscription"
    })
    throw error
  }
}