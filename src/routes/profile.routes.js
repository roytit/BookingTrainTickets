import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Профиль с инофрмацией о пользователе
router.get('/user-info', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/templates/user_info.html'));
});

// Профиль с историей бронирования
router.get('/user-history', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/templates/user_history.html'));
})

export default router;