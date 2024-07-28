import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { errorHandler } from "../error-handler";
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOrders, listUserOrders } from "../controllers/order.controller";
import adminMiddleware from "../middlewares/admin";

const orderRouter: Router = Router();

orderRouter.post("/", [authMiddleware], errorHandler(createOrder));
orderRouter.get("/", [authMiddleware], errorHandler(listOrders));
orderRouter.patch("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));

orderRouter.get("/index", [authMiddleware, adminMiddleware], errorHandler(listAllOrders));
orderRouter.get("/user/:id", [authMiddleware, adminMiddleware], errorHandler(listUserOrders));
orderRouter.patch("/:id/status", [authMiddleware, adminMiddleware], errorHandler(changeStatus));

orderRouter.get("/:id", [authMiddleware], errorHandler(getOrderById));


export default orderRouter;