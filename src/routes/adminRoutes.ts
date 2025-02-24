import { Router } from "express";
import { TokenManager } from "../utils/TokenManager";
import { AdminAuthService } from "../services/admin/AdminAuthService";
import { AdminAuthController } from "../controllers/admin/AdminAuthController";
import { SubscriptionRepository } from "../repositories/admin/SubscriptionRepository";
import { SubscriptionManager } from "../services/admin/SubscriptionManager";
import { SubscriptionController } from "../controllers/admin/SubscriptionController";
import { auth } from "../middlewares/authMiddleware";
import { UserRepository } from "../repositories/user/UserRepository";
import { AdminUserManagementService } from "../services/admin/AdminUserManagementService";
import { AdminUserController } from "../controllers/admin/AdminUserController";



const router = Router();

const tokenManager = new TokenManager();
const adminAuthService = new AdminAuthService(tokenManager)
const adminAuthController = new AdminAuthController(adminAuthService);

const userRepository = new UserRepository()
const adminUserManagementService = new AdminUserManagementService(userRepository)
const adminUserController = new AdminUserController(adminUserManagementService)

const subscriptionRepository = new SubscriptionRepository();
const subscriptionManager = new SubscriptionManager(subscriptionRepository)
const subscriptionController = new SubscriptionController(subscriptionManager)


router.post('/login',adminAuthController.login.bind(adminAuthController))

//user management

router.get('/users',auth,adminUserController.getAllUsers.bind(adminUserController))
router.patch('/users/:userId/block',auth,adminUserController.blockUser.bind(adminUserController))

// subscriptions
router.post('/subscription',auth,subscriptionController.createSubscription.bind(subscriptionController))
router.get('/subscription',auth,subscriptionController.getAllSubscriptions.bind(subscriptionController))
router.put('/subscription/:id',auth,subscriptionController.updateSubscription.bind(subscriptionController))
router.delete('/subscription/:id',auth,subscriptionController.deleteSubscription.bind(subscriptionController))


export default router;