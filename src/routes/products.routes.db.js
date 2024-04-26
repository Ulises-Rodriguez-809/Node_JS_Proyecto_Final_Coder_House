import { Router } from 'express';
import { ProductsControllers } from '../controlador/products.controllers.js'
import { checkRole } from '../middlewares/auth.js';
import { uploader } from '../utils.js';

const router = Router();

router.get("/", ProductsControllers.getProductsPaginate);

router.get("/:productId", ProductsControllers.getProductById);

router.post("/", checkRole(["premium", "admin"]), uploader.array('thumbnails'), ProductsControllers.addProduct);

router.put("/:productId", checkRole(["premium","admin"]), uploader.array('thumbnails'), ProductsControllers.updateProduct);

router.delete("/:productId", checkRole(["premium", "admin"]), ProductsControllers.deleteProduct);

export default router;