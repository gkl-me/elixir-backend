import { container } from "tsyringe";
import { Token } from "../token";
import { PlanRepository } from "../../repositories/plan/PlanRepository";
import { UserRepository } from "../../repositories/user/UserRepository";
import { SubscriptionRepository } from "../../repositories/subscription/SubscriptionRepository";
import { CacheRepository } from "../../repositories/cache/CacheRepository";
import { OnboardingRepository } from "../../repositories/onboarding/OnboardingRepository";
import { CompanyRepository } from "../../repositories/company/CompanyRepository";
import { WorkspaceRepository } from "../../repositories/workspace/WorkspaceRepository";
import { WorkspaceRoleRepository } from "../../repositories/workspace/WorkspaceRoleRepository";
import { WorkspaceMemberRepository } from "../../repositories/workspace/WorkspaceMemberRepository";

//repository
container.register(Token.PlanRepository, {
  useClass: PlanRepository,
});
container.register(Token.UserRepository, {
  useClass: UserRepository,
});
container.register(Token.SubscriptionRepository, {
  useClass: SubscriptionRepository,
});
container.register(Token.CacheRepository, {
  useClass: CacheRepository,
});
container.register(Token.PlanRepository, {
  useClass: PlanRepository,
});
container.register(Token.OnboardingRepository, {
  useClass: OnboardingRepository,
});
container.register(Token.CompanyRepository, {
  useClass: CompanyRepository,
});
container.register(Token.WorkspaceRepository, {
  useClass: WorkspaceRepository,
});
container.register(Token.WorkspaceRoleRepository, {
  useClass: WorkspaceRoleRepository,
});
container.register(Token.WorkspaceMemberRepository,{
  useClass: WorkspaceMemberRepository
})
