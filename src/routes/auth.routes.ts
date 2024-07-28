import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";

const authRoutes: Router = Router();

authRoutes.post("/signup", errorHandler(authController.signup));
authRoutes.post("/login", errorHandler(authController.login));
authRoutes.get("/me", [authMiddleware], errorHandler(authController.me));

export default authRoutes;