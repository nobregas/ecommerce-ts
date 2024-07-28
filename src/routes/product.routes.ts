import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct, deleteProduct, getProductById, listProduct, searchProducts, updateProduct } from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin";

const productsRoutes: Router = Router();

productsRoutes.post("/", [authMiddleware, adminMiddleware], errorHandler(createProduct));
productsRoutes.delete("/:id", [authMiddleware, adminMiddleware], errorHandler(deleteProduct));
productsRoutes.patch("/:id", [authMiddleware, adminMiddleware], errorHandler(updateProduct));
productsRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getProductById));
productsRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listProduct));

productsRoutes.get("/search", [authMiddleware], errorHandler(searchProducts));



export default productsRoutes;