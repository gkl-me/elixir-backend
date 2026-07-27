import { container } from "tsyringe";
import { Token } from "../token";
// import { PlanService } from "../../services/plan/PlanService"
import { AuthService } from "../../services/auth/AuthService";
import { UserService } from "../../services/user/UserService";
import { VerifyService } from "../../services/auth/VerifyService";
import { OtpService } from "../../services/auth/OtpService";
import { PasswordService } from "../../services/auth/PasswordService";
import { PlanService } from "../../services/plan/PlanService";
import { OnboardingService } from "../../services/onboarding/OnboardingService";
import { CompanyService } from "../../services/company/CompanyService";
import { WorkspaceService } from "../../services/workspace/WorkspaceService";
import { SubscriptionService } from "../../services/subscription/SubscriptionService";
import { PaymentService } from "../../services/payment/PaymentService";
import { WorkspaceRoleService } from "../../services/workspace/WorkspaceRoleService";
import { WorkspaceInviteService } from "../../services/workspace/WorkspaceInviteService";
import { WorkspaceMemberService } from "../../services/workspace/WorkspaceMemberService";
import { WorkspaceTeamService } from "../../services/workspace/WorkspaceTeamService";
// import { SubscriptionService } from "../../services/subscription/SubscriptionService"
// import { StripeWebhookService } from "../../services/webhook/StripeWebhookService"

//services
container.register(Token.AuthService, {
  useClass: AuthService,
});
container.register(Token.UserService, {
  useClass: UserService,
});
container.register(Token.VerifyService, {
  useClass: VerifyService,
});
container.register(Token.OtpService, {
  useClass: OtpService,
});
container.register(Token.PasswordService, {
  useClass: PasswordService,
});
container.register(Token.PlanService, {
  useClass: PlanService,
});
container.register(Token.OnboardingService, {
  useClass: OnboardingService,
});
container.register(Token.CompanyService, {
  useClass: CompanyService,
});
container.register(Token.WorkspaceService, {
  useClass: WorkspaceService,
});
container.register(Token.SubscriptionService, {
  useClass: SubscriptionService,
});
container.register(Token.PaymentService, {
  useClass: PaymentService,
});
container.register(Token.WorkspaceRoleService, {
  useClass: WorkspaceRoleService,
});
container.register(Token.WorkspaceInviteService, {
  useClass: WorkspaceInviteService,
});
container.register(Token.WorkspaceMemberService, {
  useClass: WorkspaceMemberService,
});
container.register(Token.WorkspaceTeamService, {
  useClass: WorkspaceTeamService,
});

// container.register(Token.PlanService,{
//     useClass:PlanService
// })
// container.register(Token.SubscriptionService,{
//     useClass:SubscriptionService
// })
// container.register(Token.StripeWebhookService,{
//     useClass:StripeWebhookService
// })
