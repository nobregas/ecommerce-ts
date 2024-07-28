import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth.middleware";
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/user.controller";
import adminMiddleware from "../middlewares/admin";

const userRoutes: Router = Router();

userRoutes.post("/address", [authMiddleware], errorHandler(addAddress));
userRoutes.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
userRoutes.get("/address", [authMiddleware], errorHandler(listAddress));

userRoutes.patch("/", [authMiddleware], errorHandler(updateUser));

userRoutes.patch("/:id/role", [authMiddleware, adminMiddleware], errorHandler(changeUserRole));
userRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getUserById));
userRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listUsers));


export default userRoutes;