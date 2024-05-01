import { Router } from 'express';
import { UsersControllers } from '../controlador/users.controller.js';
import { uploader } from '../utils.js';
import { checkRole } from '../middlewares/auth.js';

const router = Router();

// obtiene todos los usuarios sin info sensible
router.get("/", checkRole(["admin"]),UsersControllers.getAllUsers);

// obtiene un usuario
router.get("/getUser/:userEmail", checkRole(["admin"]),UsersControllers.getUser);

// change rol user to premium
router.post("/premium/:userId", UsersControllers.premiumUser);

// load documents
router.post("/:userId/documents", uploader.array("documents"), UsersControllers.documents);

// modificar rol de usuario
router.put("/", checkRole(["admin"]), UsersControllers.adminChangeRolUser);

// elimina usuario por id
router.delete("/:userId", checkRole(["admin"]), UsersControllers.deleteUser);

// elimina todos los usuarios sin actividad en los ultimos 2 dias
router.delete("/", checkRole(["admin"]), UsersControllers.deleteInactiveUsers);

export default router;