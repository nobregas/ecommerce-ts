import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin";
import productController from "../controllers/product.controller";

const productsRoutes: Router = Router();

productsRoutes.post("/", [authMiddleware, adminMiddleware], errorHandler(productController.createProduct));
productsRoutes.delete("/:id", [authMiddleware, adminMiddleware], errorHandler(productController.deleteProduct));
productsRoutes.patch("/:id", [authMiddleware, adminMiddleware], errorHandler(productController.updateProduct));
productsRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(productController.getProductById));
productsRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(productController.listProduct));

productsRoutes.get("/search", [authMiddleware], errorHandler(productController.searchProducts));



export default productsRoutes;