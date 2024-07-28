import { Router } from "express";
import authRoutes from "./auth.routes";
import productsRoutes from "./product.routes";
import userRoutes from "./user.routes";
import cartRoutes from "./cart.routes";
import orderRouter from "./order.routes";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productsRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/cart", cartRoutes);
rootRouter.use("/order", orderRouter);

export default rootRouter;