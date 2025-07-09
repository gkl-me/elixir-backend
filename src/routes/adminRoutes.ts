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
import { container } from "tsyringe";
import { Token } from "../di/token";
import { IAdminAuthController } from "../controllers/admin/interface/IAdminAuthController";
import { IPlanController } from "../controllers/admin/interface/IPlanController";
import { adminAuth } from "../middlewares/adminAuthMiddleware";



const router = Router();

/**
 * @openapi
 * /admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#components/schemas/AdminLogin'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema: 
 *                $ref: '#components/schemas/Response'
 *       400:
 *         description: Invalid Credentials
 */
router.post('/login',(req,res,next) =>{
    const adminAuthController = container.resolve<IAdminAuthController>(Token.AdminAuthController)
    adminAuthController.login(req,res,next)
})
router.get('/me',adminAuth,(req,res,next) => {
    const adminAuthController = container.resolve<IAdminAuthController>(Token.AdminAuthController)
    adminAuthController.me(req,res,next)
})
router.post('/logout',adminAuth,(req,res,next) => {
    const adminAuthController = container.resolve<IAdminAuthController>(Token.AdminAuthController)
    adminAuthController.logout(req,res,next)
})

//plans
router.patch('/plans/:id',adminAuth,(req,res,next) => {
    const planController = container.resolve<IPlanController>(Token.PlanController)
    planController.updatePlan(req,res,next)
})
router.get('/plans',adminAuth,(req,res,next) => {
    const planController = container.resolve<IPlanController>(Token.PlanController)
    planController.findAllPlans(req,res,next)
})


//user managemen

// router.get('/users',auth,adminUserController.getAllUsers.bind(adminUserController))
// router.patch('/users/:userId/block',auth,adminUserController.blockUser.bind(adminUserController))

// // subscriptions
// router.post('/subscription',auth,subscriptionController.createSubscription.bind(subscriptionController))
// router.get('/subscription',auth,subscriptionController.getAllSubscriptions.bind(subscriptionController))
// router.put('/subscription/:id',auth,subscriptionController.updateSubscription.bind(subscriptionController))
// router.delete('/subscription/:id',auth,subscriptionController.deleteSubscription.bind(subscriptionController))


export default router;