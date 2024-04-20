import { Router } from 'express';
import {CartsControllers} from '../controlador/carts.controllers.js'
import { checkRole } from '../middlewares/auth.js';

const router = Router();

//obtener todos los carts
router.get('/',CartsControllers.getAllCarts);

//obtener 1 cart por el id
router.get('/:cartId', CartsControllers.getCartById);

//crear un nuevo cart y añadirlo a la DB
router.post('/', CartsControllers.addCart);

//añadir un producto (id y quantity) a un cart (por el id)
router.post('/:cartId/product/:productId',  checkRole(["user","premium"]),CartsControllers.addProductToCart);

// realizar compra
router.post("/:cartId/purchase", CartsControllers.purchase);

// este recibe un array completo con todos los nuevos ids de los productos y cantidades nuevas
router.put('/:cartId', CartsControllers.updateCart);

// actualizar solo la cantidad q corresponda al id cart y id producto
router.put('/:cartId/products/:productId', CartsControllers.updateProductsQuantity);

//eliminar la lista de productos de un cart por id
router.delete('/:cartId', CartsControllers.clearCart);

// ELIMINAR EL PRODUCTO DEL CARRITO
router.delete('/:cartId/product/:productId', CartsControllers.deleteProductFromCart);

export default router;