

export enum Token  {
    PasswordHasher="IPasswordHasher",
    TokenManager="ITokenManager",
    EmailService='IEmailService',
    StripeService="IStripeService",
    
    PlanRepository='IPlanRepository',
    UserRepository='IUserRepository',
    SubscriptionRepository='ISubscriptionRepository',
    CacheRepository="ICacheRepository",
    
    AdminAuthService="IAdminAuthService",
    PlanService='IPlanService',
    AuthService='IAuthService',
    SubscriptionService='ISubscriptionService',
    UserService='IUserService',
    StripeWebhookService='IStripeWebhookService',

    AdminAuthController="IAdminAuthController",
    PlanController='IPlanController',
    AuthController='IAuthController',
    SubscriptionController='ISubscriptionController',
    UserController='IUserController',
    StripeWebhookController='IStripeWebhookController'
}