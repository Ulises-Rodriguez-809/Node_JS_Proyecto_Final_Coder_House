import {Router} from 'express';
import { LoggerTestController } from '../controlador/loggerTest.controllers.js';

const router = Router();

router.get("/", LoggerTestController.loggerTest);

export default router;