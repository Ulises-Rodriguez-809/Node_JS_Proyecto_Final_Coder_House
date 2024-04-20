import {Router} from 'express';
import { MockingController } from '../controlador/mocking.controllers.js';

const router = Router();

router.get("/", MockingController.getMockingProducts);

export default router;