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

export async function handleStripeEventProcessor(job: Job): Promise<void> {
  const { event } = job.data as { event: Stripe.Event };

  switch (event.type) {
    case "invoice.payment_succeeded":
      await handlePaymentSuccess(event);
      break;
    case "invoice.payment_failed":
      await handlePaymentFailed(event);
      break;
    default:
      break;
  }

  return;
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

    const invoice = event.data.object as Stripe.Invoice;

    const sub = await _stripeService.getSubscriptionFromInvoice(invoice);

    const userId = sub?.metadata?.userId;
    const planId = sub?.metadata?.planId || "";

    const onboarding = await _onboardingRepository.findOne({ userId });
    const plan = await _planRepository.findById(planId);

    if (!onboarding || !plan)
      throw new CustomError(
        CONSTANT_MESSAGES.BAD_REQUEST,
        STATUS_CODES.BAD_REQUEST
      );

    let companyId;

    if (onboarding.planType === "Enterprice" && onboarding.company) {
      const company = await _companyRepository.create(onboarding.company);
      companyId = company.id;
    }

    // const workspace = await _workspaceRepository.create({
    //   ownerId: userId,
    //   name: onboarding.workspaceName || "Personal Workspace",
    //   companyId,
    //   type: "company",
    // });

    // const subscription = await _subscriptionRepository.create({
    //   workspaceId: workspace.id,
    //   userId,
    //   stripePriceId: plan.stripePriceId,
    //   planId,
    //   stripeSubscriptionId: sub?.subscription as string,
    // });

    // workspace.subscriptionId = String(subscription._id);
    // await workspace.save();

    const workspace = await _workspaceService.bootStrapWorkspace({
      ownerId: userId!,
      workspaceName: onboarding.workspaceName || "Personal Workspace",
      planId: onboarding.planId,
      stripePriceId: plan.stripePriceId,
      stripeSubscriptionId: sub?.subscription as string,
      companyId,
    });

    onboarding.paymentStatus = "success";
    onboarding.isCompleted = true;
    onboarding.workspaceSlug = workspace?.slug
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

    const invoice = event.data.object as Stripe.Invoice;

    const sub = await _stripeService.getSubscriptionFromInvoice(invoice);
    const userId = sub?.metadata?.userId;

    const onboarding = await _onboardingRepository.findOne({ userId });
    if (!onboarding)
      throw new CustomError(
        CONSTANT_MESSAGES.BAD_REQUEST,
        STATUS_CODES.BAD_REQUEST
      );

    onboarding.paymentStatus = "failed";
    onboarding.isCompleted = true;

    await onboarding.save();
  } catch (error) {
    console.log("payment failed Error", error);
    logger.error(error);
  }
}
