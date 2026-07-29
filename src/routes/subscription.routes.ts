import { Router } from "express";
import { container } from "tsyringe";
import { ISubscriptionController } from "../controllers/subscription/interface/ISubscriptionController";
import { Token } from "../di/token";
import { authorize } from "../middlewares/authorize";
import { APP_ROLES } from "../constants/roles";
import { auth } from "../middlewares/auth";




const router = Router()


const subscriptionController = container.resolve<ISubscriptionController>(Token.SubscriptionController)

router.get('/', auth, authorize(APP_ROLES.SUPER_ADMIN), (req, res, next) => {
    void subscriptionController.handleListAllSubcription(req, res, next)
})


router.patch('/:subscriptionId/cancel', auth, authorize(APP_ROLES.SUPER_ADMIN), (req, res, next) => {
    void subscriptionController.handleCancelSubscription(req, res, next)
})

router.patch('/:subscriptionId/reactivate', auth, authorize(APP_ROLES.SUPER_ADMIN), (req, res, next) => {
    void subscriptionController.handleReactivateSubscription(req, res, next)
})


export default router