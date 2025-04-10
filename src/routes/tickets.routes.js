import { Router } from 'express';
import { getTickets } from '../controllers/ticketController.js';

const router = Router();

// Получение всех билетов
router.get('/api/tickets', getTickets);

export default router;