import { Router } from 'express';
import homeRoutes from './home.routes.js';
import authRoutes from './auth.routes.js'

const router = Router();

router.use('/', homeRoutes);
router.use('/', authRoutes);

export default router;