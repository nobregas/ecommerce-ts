import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin";
import userController from "../controllers/user.controller";

const userRoutes: Router = Router();

userRoutes.post("/address", [authMiddleware], errorHandler(userController.addAddress));
userRoutes.delete("/address/:id", [authMiddleware], errorHandler(userController.deleteAddress));
userRoutes.get("/address", [authMiddleware], errorHandler(userController.listAddress));

userRoutes.patch("/", [authMiddleware], errorHandler(userController.updateUser));

userRoutes.patch("/:id/role", [authMiddleware, adminMiddleware], errorHandler(userController.changeUserRole));
userRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(userController.getUserById));
userRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(userController.listUsers));


export default userRoutes;