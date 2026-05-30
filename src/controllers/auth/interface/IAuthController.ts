import { NextFunction, Request, Response } from "express";

// export interface IAuthController {
//     registerUser(req:Request,res:Response,next:NextFunction):Promise<void>,
//     loginUser(req:Request,res:Response,next:NextFunction):Promise<void>
//     verifyUser(req: Request, res: Response,next:NextFunction): Promise<void>
//     googleAuth(req: Request, res: Response,next:NextFunction): Promise<void>
//     refresh(req: Request, res: Response,next:NextFunction): Promise<void>
//     logout(req: Request, res: Response,next:NextFunction): Promise<void>
//     resendVerification(req: Request, res: Response,next:NextFunction): Promise<void>
//     forgotPassword(req: Request, res: Response,next:NextFunction): Promise<void>
//     verifyOtp(req: Request, res: Response,next:NextFunction): Promise<void>
//     resendOtp(req: Request, res: Response,next:NextFunction): Promise<void>
//     resetPassword(req: Request, res: Response,next:NextFunction): Promise<void>
// }

export interface IAuthController {
  handleRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  handleGoogleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleGithubAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleRefresh(req: Request, res: Response, next: NextFunction): Promise<void>;
  handleLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
