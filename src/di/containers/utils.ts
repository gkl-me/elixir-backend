import { container } from "tsyringe";
import { Token } from "../token";
import { PasswordHasher } from "../../providers/PasswordHasher";
import { TokenManager } from "../../providers/TokenManager";
import { StripeService } from "../../providers/StripeService";
import { EmailService } from "../../providers/EmailService";
import { GithubAuthService } from "../../providers/GithubAuthService";

//utils
container.register(Token.PasswordHasher, {
  useClass: PasswordHasher,
});
container.register(Token.TokenManager, {
  useClass: TokenManager,
});
container.register(Token.StripeService, {
  useClass: StripeService,
});
container.register(Token.EmailService, {
  useClass: EmailService,
});
container.register(Token.GithubAuthService, {
  useClass: GithubAuthService,
});
