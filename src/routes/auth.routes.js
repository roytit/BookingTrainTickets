import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { login, register, checkAuth } from '../controllers/authController.js';
import { updateEmail } from '../controllers/authController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Авторизация
router.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/templates/login.html'));
})

router.post('/login', login)

// Регистрация
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/templates/reg.html'))
})

// Обработка формы регистрации
router.post('/register', register);

router.get('/api/check-auth', checkAuth);

router.post('/api/update-email', updateEmail);

export default router;