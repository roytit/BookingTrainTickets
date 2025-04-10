import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: console.log // Вывод SQL-запросов в консоль
});

// Тест подключения
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к БД установлено');
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
    return false;
  }
};

export default sequelize;