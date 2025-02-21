import { Router } from "express";
import { TokenManager } from "../utils/TokenManager";
import { AdminAuthService } from "../services/admin/AdminAuthService";
import { AdminAuthController } from "../controllers/admin/AdminAuthController";
import { SubscriptionRepository } from "../repositories/admin/SubscriptionRepository";
import { SubscriptionManager } from "../services/admin/SubscriptionManager";
import { SubscriptionController } from "../controllers/admin/SubscriptionController";
import { auth } from "../middlewares/authMiddleware";



const router = Router();

const tokenManager = new TokenManager();
const adminAuthService = new AdminAuthService(tokenManager)
const adminAuthController = new AdminAuthController(adminAuthService);

const subscriptionRepository = new SubscriptionRepository();
const subscriptionManager = new SubscriptionManager(subscriptionRepository)
const subscriptionController = new SubscriptionController(subscriptionManager)


router.post('/login',adminAuthController.login.bind(adminAuthController))

//subscriptions
router.post('/subscription',auth,subscriptionController.createSubscription.bind(subscriptionController))
router.get('/subscription',auth,subscriptionController.getAllSubscriptions.bind(subscriptionController))
router.put('/subscription/:id',auth,subscriptionController.updateSubscription.bind(subscriptionController))
router.delete('/subscription/:id',auth,subscriptionController.deleteSubscription.bind(subscriptionController))


export default router;