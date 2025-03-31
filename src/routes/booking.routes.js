import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Главная страница бронирования (путь остаётся /booking)
router.get('/booking', async (req, res) => {
    try {
        // Проверка авторизации
        if (!req.session.userId) {
            return res.redirect('/login');
        }

        // Получаем данные пользователя
        const user = await User.findByPk(req.session.userId, {
            attributes: ['username', 'email']
        });

        if (!user) {
            return res.redirect('/login');
        }

        // Читаем исходный HTML файл
        const htmlPath = path.join(__dirname, '../public/templates/book.html');
        let htmlContent = await fs.promises.readFile(htmlPath, 'utf-8');

        // Добавляем информацию о пользователе
        const userInfoHtml = `
            <div class="user-info" style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                z-index: 1000;
            ">
                <div>Пользователь: <strong>${user.username}</strong></div>
                <div>Email: ${user.email}</div>
                <button onclick="logout()" style="
                    margin-top: 5px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                ">Выйти</button>
            </div>
            <script>
                async function logout() {
                    try {
                        const response = await fetch('/logout', { method: 'POST' });
                        if (response.ok) {
                            window.location.href = '/login';
                        }
                    } catch (error) {
                        console.error('Ошибка выхода:', error);
                    }
                }
            </script>
        `;

        // Вставляем блок с информацией о пользователе перед закрывающим </body>
        htmlContent = htmlContent.replace('</body>', `${userInfoHtml}</body>`);

        res.send(htmlContent);
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).send('Ошибка сервера');
    }
});

export default router;