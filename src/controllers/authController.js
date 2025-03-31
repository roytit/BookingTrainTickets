import { Op } from 'sequelize';
import User from '../models/user.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Валидация данных
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Пароли не совпадают' });
    }

    // Проверка существования пользователя
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким именем или email уже существует' });
    }

    // Создание пользователя (пароль хешируется автоматически в хуке модели)
    const newUser = await User.create({
      username,
      email,
      password_hash: password,
      role_id: 1
    });

    // Успешный ответ
    res.status(201).json({ 
      success: true,
      message: 'Регистрация прошла успешно!',
      userId: newUser.user_id
    });

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};