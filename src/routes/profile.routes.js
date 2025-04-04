import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { logout, updateProfile, updatePassword } from '../controllers/authController.js';
import { requireAuth } from '../controllers/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Профиль с информацией о пользователе
router.get('/user-info', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/templates/user_info.html'));
});

// Профиль с историей бронирования
router.get('/user-history', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/templates/user_history.html'));
});

// Выход из системы
router.post('/logout', logout);

// Обновление профиля
router.post('/api/update-profile', requireAuth, updateProfile);

// Обновление пароля
router.post('/api/update-password', requireAuth, updatePassword);

export default router;