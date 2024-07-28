import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { errorHandler } from "../error-handler";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart.controller";

const cartRoutes: Router = Router();

cartRoutes.post("/", [authMiddleware], errorHandler(addItemToCart))
cartRoutes.get("/", [authMiddleware], errorHandler(getCart))
cartRoutes.delete("/:id", [authMiddleware], errorHandler(deleteItemFromCart))
cartRoutes.patch("/:id", [authMiddleware], errorHandler(changeQuantity))



export default cartRoutes;