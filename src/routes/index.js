import { Router } from 'express';
import homeRoutes from './home.routes.js';
import authRoutes from './auth.routes.js'
import profileRoutes from './profile.routes.js'

const router = Router();

router.use('/', homeRoutes);
router.use('/', authRoutes);
router.use('/profile', profileRoutes);

export default router;