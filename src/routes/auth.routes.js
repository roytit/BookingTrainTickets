import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { register } from '../controllers/authController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Авторизация
router.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/templates/log.html'));
})

// Регистрация
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/templates/reg.html'))
})

// Обработка формы регистрации
router.post('/register', register);

export default router;