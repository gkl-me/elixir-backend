import { Plan } from "../models/Plan";
import logger from "../middlewares/logger";
import { container } from "tsyringe";
import { IStripeService } from "../providers/interfaces/IStripeService";
import { logError } from "../middlewares/loggerHelper";

const plans = [
  {
    name: "Free",
    type: "Free",
    price: 0,
    limits: {
      projects: 5,
      teams: 2,
      members: 5,
      customRoles: 0,
      storageBytes: 100 * 1024 * 1024,
    },
    features: {
      githubAutomation: false,
      automationScripts: false,
    },
  },
  {
    name: "Pro",
    type: "Pro",
    price: 1000,
    limits: {
      projects: 10,
      teams: 5,
      members: 10,
      customRoles: 3,
      storageBytes: 300 * 1024 * 1024,
    },
    features: {
      githubAutomation: true,
      automationScripts: true,
    },
  },
  {
    name: "Enterprice",
    type: "Enterprice",
    price: 2000,
    limits: {
      projects: -1,
      teams: -1,
      members: -1,
      customRoles: 5,
      storageBytes: 500 * 1024 * 1024,
    },
    features: {
      githubAutomation: true,
      automationScripts: true,
    },
  },
];

export async function seedPlan(): Promise<void> {
  try {
    for (const plan of plans) {
      let stripePriceId = null;
      let stripeProductId = null;

      if (plan.type !== "Free") {
        const res = await stripeListing(plan.type, plan.price);
        stripePriceId = res.stripePriceId;
        stripeProductId = res.stripeProductId;
      }

      //add to db
      await Plan.updateOne(
        { name: plan.name },
        {
          $set: {
            name: plan.name,
            type: plan.type,
            limits: plan.limits,
            features: plan.features,
            stripePriceId: stripePriceId,
            stripeProductId: stripeProductId,
            isActive: true,
            price: plan.price,
          },
        },
        {
          upsert: true,
        }
      );
    }

    console.log("Plans Successfully seed to the db");
  } catch (error) {
    logger.error(error);
  }
}

async function stripeListing(
  planType: string,
  planPrice: number
): Promise<{
  stripeProductId: string;
  stripePriceId: string;
}> {
  try {
    const stripeServie = container.resolve<IStripeService>("IStripeService");

    let stripeProductId = await stripeServie.findProduct(planType);

    if (!stripeProductId) {
      stripeProductId = await stripeServie.createProduct(planType);
    }

    const latestPriceId = await stripeServie.findLatestPrice(stripeProductId);

    if (!latestPriceId) {
      const newPriceId = await stripeServie.createPrice(
        stripeProductId,
        planPrice
      );
      return { stripeProductId, stripePriceId: newPriceId };
    }

    const latestPrice = await stripeServie.getPrice(latestPriceId);

    if (latestPrice?.unit_amount !== planPrice) {
      const newPriceId = await stripeServie.createPrice(
        stripeProductId,
        planPrice
      );
      return { stripeProductId, stripePriceId: newPriceId };
    }

    return {
      stripeProductId,
      stripePriceId: latestPriceId,
    };
  } catch (error) {
    logError(error, {
      service: "SeedPlan.StripeListing",
    });
    throw error;
  }
}
