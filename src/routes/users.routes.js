import {Router} from 'express';
import {UsersControllers} from '../controlador/users.controller.js';
import { uploader } from '../utils.js';

const router = Router();

// change rol user to premium
router.post("/premium/:userId", UsersControllers.premiumUser);

// falta agregar el otro endpoint, mostrar ticket, cambiar forma de volverse user premium 
// falta la vista para cargar los datos y volverte premium
// recorda q tenes q modificar el documents del modelo del usuario 
router.post("/:userId/documents", uploader.array("documents"),UsersControllers.documents);

export default router;