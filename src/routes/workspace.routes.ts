import { Router } from "express";
import { Token } from "../di/token";
import { IWorkspaceController } from "../controllers/workspace/interface/IWorkspaceController";
import { container } from "tsyringe";


const router = Router()


const workspaceController = container.resolve<IWorkspaceController>(Token.WorkspaceController)

router.get("/context",(req,res,next)=>{
    void workspaceController.handleWorkspaceContext(req,res,next)
})

export default router