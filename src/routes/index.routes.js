import { Router } from 'express';
import homeRoutes from './home.routes.js';
import authRoutes from './auth.routes.js'
import profileRoutes from './profile.routes.js'
import ticketsRoutes from './tickets.routes.js'

const router = Router();

router.use('/', homeRoutes);
router.use('/', authRoutes);
router.use('/', ticketsRoutes);
router.use('/profile', profileRoutes);

export default router;