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
    
    const user = await User.findByPk(req.session.user.id, {
      attributes: ['user_id', 'email', 'last_name', 'first_name', 'middle_name']
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    
    res.json({
      id: user.user_id,
      email: user.email,
      last_name: user.last_name,
      first_name: user.first_name,
      middle_name: user.middle_name
    });
  } catch (error) {
    console.error('Ошибка проверки авторизации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Добавляем в authController.js
export const updateEmail = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email обязателен' });
    }

    // Проверка формата email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Некорректный формат email' });
    }

    // Проверка на существующий email
    const existingUser = await User.findOne({
      where: { email: email.trim() }
    });

    if (existingUser && existingUser.user_id !== req.session.user.id) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Обновление email
    const [updated] = await User.update(
      { email: email.trim() },
      { 
        where: { user_id: req.session.user.id },
        returning: true
      }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем email в сессии
    req.session.user.email = email.trim();
    
    res.json({ 
      success: true,
      email: email.trim() 
    });
  } catch (error) {
    console.error('Ошибка обновления email:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { last_name, first_name, middle_name } = req.body;
    const userId = req.session.user.id;

    await User.update(
      { last_name, first_name, middle_name },
      { where: { user_id: userId } }
    );

    // Получаем обновленные данные пользователя
    const updatedUser = await User.findByPk(userId, {
      attributes: ['user_id', 'email', 'last_name', 'first_name', 'middle_name']
    });

    res.json({ 
      success: true, 
      message: 'Данные успешно обновлены',
      user: updatedUser
    });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.user.id;

    // Получаем текущий пароль пользователя
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Пользователь не найден' });
    }

    // Проверяем текущий пароль
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Неверный текущий пароль' });
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль
    await User.update(
      { password_hash: hashedPassword },
      { where: { user_id: userId } }
    );

    res.json({ success: true, message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Ошибка обновления пароля:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
};