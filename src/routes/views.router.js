import { Router } from 'express';
import { ViewsControllers } from '../controlador/views.controllers.js'
import { checkRole, verifyEmailTokenMW } from '../middlewares/auth.js';

// inicializamos Router
const router = Router();

// login
router.get('/', ViewsControllers.login);

// register
router.get('/register', ViewsControllers.register);

// recuperar contraseña
router.get('/recoverPassword', ViewsControllers.recoverPass);

// cambiar contraseña
router.get('/resetPassword', verifyEmailTokenMW(), ViewsControllers.resetPass);

// ruta home donde podes moverte entre las diferentes opciones, tambien es de presentacion del e-commerce
router.get('/home', ViewsControllers.home);

// DB router ruta cuadno te logueaas
router.get('/products', ViewsControllers.productsGet);

// DB router
router.get('/carts/:cartId', ViewsControllers.cartId);

// DB router --> esto usalo para q el admin pueda agregar productos
router.get('/realtimeproducts', checkRole(["premium", "admin"]), ViewsControllers.realtimeproducts);

// vista para obtener el premium
router.get('/preimum', checkRole(["user"]), ViewsControllers.premium);

// current user
router.get('/profile',ViewsControllers.currentUserProfile);

// vista para q el admin vea todos los usuarios y pueda eliminar los inactivos en los ultimos 2 dias
router.get('/users', checkRole(["admin"]), ViewsControllers.usersInfo);

export default router;