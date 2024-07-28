import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { errorHandler } from "../error-handler";
import cartController from "../controllers/cart.controller";

const cartRoutes: Router = Router();

cartRoutes.post("/", [authMiddleware], errorHandler(cartController.addItemToCart))
cartRoutes.get("/", [authMiddleware], errorHandler(cartController.getCart))
cartRoutes.delete("/:id", [authMiddleware], errorHandler(cartController.deleteItemFromCart))
cartRoutes.patch("/:id", [authMiddleware], errorHandler(cartController.changeQuantity))


export default cartRoutes;