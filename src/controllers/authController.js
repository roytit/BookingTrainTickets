import { Op } from 'sequelize';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    // Проверка наличия тела запроса
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('Ошибка: Пустое тело запроса');
      return res.status(400).json({ 
        success: false,
        error: 'Необходимо предоставить данные для регистрации' 
      });
    }

    const { username, email, password, confirmPassword } = req.body;

    // Валидация входных данных
    const errors = [];
    if (!username) errors.push('Не указано имя пользователя');
    if (!email) errors.push('Не указан email');
    if (!password) errors.push('Не указан пароль');
    if (!confirmPassword) errors.push('Не подтвержден пароль');
    
    if (errors.length > 0) {
      console.error('Ошибки валидации:', errors);
      return res.status(400).json({ 
        success: false,
        errors 
      });
    }

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      console.error('Пароли не совпадают');
      return res.status(400).json({ 
        success: false,
        error: 'Пароли не совпадают' 
      });
    }

    // Проверка сложности пароля
    if (password.length < 8) {
      console.error('Пароль слишком короткий');
      return res.status(400).json({ 
        success: false,
        error: 'Пароль должен содержать минимум 8 символов' 
      });
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      const conflictField = existingUser.username === username ? 'username' : 'email';
      console.error(`Пользователь с таким ${conflictField} уже существует`);
      return res.status(409).json({ 
        success: false,
        error: `Пользователь с таким ${conflictField} уже существует`,
        conflictField
      });
    }

    // Хеширование пароля
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('Пароль успешно хеширован');

    // Создание пользователя
    const newUser = await User.create({
      username,
      email,
      password_hash: passwordHash,
      role_id: 1
    });

    console.log('Новый пользователь создан:', {
      id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.created_at
    });

    // Успешный ответ
    return res.status(201).json({
      success: true,
      message: 'Регистрация успешно завершена',
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('\n=== КРИТИЧЕСКАЯ ОШИБКА ===');
    console.error('Сообщение:', error.message);
    console.error('Стек вызовов:', error.stack);
    console.error('Тип ошибки:', error.name);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Нарушение уникальности:', error.errors);
      return res.status(409).json({
        success: false,
        error: 'Пользователь с такими данными уже существует',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    if (error.name === 'SequelizeValidationError') {
      console.error('Ошибки валидации:', error.errors);
      return res.status(400).json({
        success: false,
        error: 'Ошибка валидации данных',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    // Общая ошибка сервера
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера',
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        stack: error.stack
      })
    });
  }
};


export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({where: {email}})

    if (!user){
      return res.status(401).json({
        success: false,
        error: 'Пользователь с таким email не найден'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid){
      return res.status(401).json({
        success: false,
        error: "Неверный пароль"
      })
    }

    req.session.userId = user.user_id

    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      }
    })


  }catch (error){
    console.error('Ошибка входа:', error)
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера при входе'
    })

  }
} 