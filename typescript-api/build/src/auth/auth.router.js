import { Router as asyncRouter } from "@root/async-router";
import AuthController from "./auth.contoller.js";
export default function createAuthRouter() {
    const authRouter = asyncRouter();
    const authController = new AuthController();
    authRouter.post("/login", authController.login);
    authRouter.post("/register", authController.register);
    return authRouter;
}
