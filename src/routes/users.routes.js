import { Router } from 'express';
import { UsersControllers } from '../controlador/users.controller.js';
import { uploader } from '../utils.js';
import { checkRole } from '../middlewares/auth.js';

const router = Router();

// obtiene todos los usuarios sin info sensible
router.get("/", UsersControllers.getAllUsers);

// change rol user to premium
router.post("/premium/:userId", UsersControllers.premiumUser);

// load documents
router.post("/:userId/documents", uploader.array("documents"), UsersControllers.documents);

// elimina todos los usuarios sin actividad en los ultimos 2 dias
router.delete("/", checkRole(["admin"]), UsersControllers.deleteInactiveUsers);

export default router;