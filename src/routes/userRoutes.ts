import { Router } from "express";
import { UserRepository } from "../repositories/user/UserRepository";
import { PasswordHasher } from "../utils/PasswordHasher";
import { TokenManager } from "../utils/TokenManager";
import { UserAuthService } from "../services/user/UserAuthService";
import { UserAuthController } from "../controllers/user/UserAuthController";
import { UserVerifyService } from "../services/user/UserVerifyService";
import { EmailService } from "../utils/EmailService";
import { UserVerifyController } from "../controllers/user/UserVerifyController";


const router = Router();

const userRepository = new UserRepository()
const passwordHasher = new PasswordHasher()
const tokenManager = new TokenManager()
const emailService = new EmailService()
const userVerifyService = new UserVerifyService(emailService,userRepository,tokenManager)
const authService = new UserAuthService(userRepository, passwordHasher, tokenManager,userVerifyService)
const userAuthController = new UserAuthController(authService)

const userVerifyController = new UserVerifyController(userVerifyService)

router.post('/register',userAuthController.registerUser.bind(userAuthController))
router.get('/verify', userVerifyController.verifyUser.bind(userVerifyController))


router.post('/login',userAuthController.loginUser.bind(userAuthController))

router.get('/user',(req,res) => {

    const number= Math.random()

    res.status(200).json({message: 'User info',data:{number}})
})



export default router;