import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { errorHandler } from "../error-handler";
import adminMiddleware from "../middlewares/admin";
import orderController from "../controllers/order.controller";

const orderRouter: Router = Router();

orderRouter.post("/", [authMiddleware], errorHandler(orderController.createOrder));
orderRouter.get("/", [authMiddleware], errorHandler(orderController.listOrders));
orderRouter.patch("/:id/cancel", [authMiddleware], errorHandler(orderController.cancelOrder));

orderRouter.get("/index", [authMiddleware, adminMiddleware], errorHandler(orderController.listAllOrders));
orderRouter.get("/user/:id", [authMiddleware, adminMiddleware], errorHandler(orderController.listUserOrders));
orderRouter.patch("/:id/status", [authMiddleware, adminMiddleware], errorHandler(orderController.changeStatus));

orderRouter.get("/:id", [authMiddleware], errorHandler(orderController.getOrderById));


export default orderRouter;