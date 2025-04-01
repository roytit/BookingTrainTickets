import User from '../models/user.js';
import bcrypt from 'bcryptjs';

// Вспомогательные функции валидации
const validateRegistrationInput = (email, password, confirmPassword) => {
  if (!email || !password || !confirmPassword) {
    return { isValid: false, error: 'Все поля обязательны для заполнения' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Пароли не совпадают' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Пароль должен содержать минимум 8 символов' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, error: 'Некорректный формат email' };
  }

  return { isValid: true };
};

export const register = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Необходимо предоставить данные для регистрации' 
      });
    }

    const { email, password, confirmPassword } = req.body;
    
    const validation = validateRegistrationInput(email, password, confirmPassword);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: validation.error 
      });
    }

    // Проверка существующего email
    const existingUser = await User.findOne({
      where: { email: email.trim() }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Пользователь с таким email уже существует'
      });
    }

    // Создание пользователя
    const newUser = await User.create({
      email: email.trim(),
      password_hash: password.trim(),
      role_id: 1
    });

    // Сразу авторизуем пользователя после регистрации
    req.session.user = {
      id: newUser.user_id,
      email: newUser.email
    };

    return res.status(201).json({
      success: true,
      message: 'Регистрация успешно завершена',
      user: {
        id: newUser.user_id,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Внутренняя ошибка сервера' 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email и пароль обязательны' 
      });
    }

    const user = await User.findOne({
      where: { email: email.trim() },
      attributes: ['user_id', 'email', 'password_hash'],
      timeout: 5000 
    }).catch(err => {
      console.error('Ошибка DB:', err);
      throw new Error('Ошибка базы данных');
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Неверные учетные данные' 
      });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Неверные учетные данные' 
      });
    }

    // Сохраняем пользователя в сессии
    req.session.user = {
      id: user.user_id,
      email: user.email
    };

    return res.json({ 
      success: true,
      message: 'Авторизация успешна',
      user: {
        id: user.user_id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Ошибка сервера' 
    });
  }
};

// Добавляем метод для выхода
export const logout = async (req, res) => {
  try {
    // Уничтожаем сессию
    req.session.destroy(err => {
      if (err) {
        console.error('Ошибка при выходе:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Не удалось выйти из системы' 
        });
      }
      
      // Очищаем куку сессии
      res.clearCookie('connect.sid'); // или имя вашей сессионной куки
      
      return res.json({ 
        success: true,
        message: 'Выход выполнен успешно' 
      });
    });
  } catch (error) {
    console.error('Ошибка выхода:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    // Можно добавить дополнительную проверку пользователя в БД
    const user = await User.findByPk(req.session.user.id, {
      attributes: ['user_id', 'email']
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    
    res.json({
      id: user.user_id,
      email: user.email
    });
  } catch (error) {
    console.error('Ошибка проверки авторизации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};