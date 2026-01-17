// import { Router } from "express";
// import { container } from "tsyringe";
// import { Token } from "../di/token";
// import { IAdminAuthController } from "../controllers/admin/interface/IAdminAuthController";
// import { IPlanController } from "../controllers/plan/interface/IPlanController";
// import { adminAuth } from "../middlewares/adminAuthMiddleware";
// import { IUserController } from "../controllers/user/interface/IUserController";



// const router = Router();

// /**
//  * @openapi
//  * /admin/login:
//  *   post:
//  *     tags:
//  *       - Admin
//  *     summary: Admin Login
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *               $ref: '#components/schemas/AdminLogin'
//  *     responses:
//  *       200:
//  *         description: Successful login
//  *         content:
//  *           application/json:
//  *             schema: 
//  *                $ref: '#components/schemas/Response'
//  *       400:
//  *         description: Invalid Credentials
//  */
// router.post('/login',(req,res,next) =>{
//     const adminAuthController = container.resolve<IAdminAuthController>(Token.AdminAuthController)
//     adminAuthController.login(req,res,next)
// })
// router.get('/me',adminAuth,(req,res,next) => {
//     const adminAuthController = container.resolve<IAdminAuthController>(Token.AdminAuthController)
//     adminAuthController.me(req,res,next)
// })
// router.post('/refresh',(req,res,next) => {
//     const adminAuthController = container.resolve<IAdminAuthController>(Token.AdminAuthController)
//     adminAuthController.refresh(req,res,next)
// })
// router.post('/logout',(req,res,next) => {
//     const adminAuthController = container.resolve<IAdminAuthController>(Token.AdminAuthController)
//     adminAuthController.logout(req,res,next)
// })

// //plans
// router.patch('/plans/:id',adminAuth,(req,res,next) => {
//     const planController = container.resolve<IPlanController>(Token.PlanController)
//     planController.updatePlan(req,res,next)
// })
// router.get('/plans',adminAuth,(req,res,next) => {
//     const planController = container.resolve<IPlanController>(Token.PlanController)
//     planController.findAllPlans(req,res,next)
// })


// //user management
// router.get('/users',adminAuth,(req,res,next) => {
//     const userController = container.resolve<IUserController>(Token.UserController)
//     userController.getAllUsers(req,res,next)
// })
// router.patch('/users/:id/toggle-block',adminAuth,(req,res,next) => {
//     const userController = container.resolve<IUserController>(Token.UserController)
//     userController.toggleBlockStatus(req,res,next)
// })


// export default router;