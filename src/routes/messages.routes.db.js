import {Router} from 'express'
import { MessageController } from '../controlador/messages.controllers.js';
import { checkRole } from '../middlewares/auth.js';

const router = Router();

router.get('/chat',  checkRole(["user"]), MessageController.chat)


export default router;