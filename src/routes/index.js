import { Router } from 'express';
import homeRoutes from './home.routes.js';
import authRoutes from './auth.routes.js'
import bookRoutes from './booking.routes.js'

const router = Router();

router.use('/', homeRoutes);
router.use('/', authRoutes);
router.use('/', bookRoutes);

export default router;