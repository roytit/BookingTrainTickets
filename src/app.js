import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from './routes/index.js';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

// Загрузка .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Настройка сессии
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_key', // Используем .env или запасной вариант
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // true для HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 день
  }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Подключение роутов
app.use(mainRouter);

// Обработка 404
app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ошибка сервера');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});