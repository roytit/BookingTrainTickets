import sequelize from '../config/database.js';
import './City.js';
import './Station.js';
import './Route.js';
import './RouteByStation.js';
import './Ticket.js';
import './Passenger.js';
import './Trip.js';
import './Train.js';

// Функция для инициализации ассоциаций между моделями
export const initializeModels = () => {
  console.log('Инициализация ассоциаций...');
  Object.values(sequelize.models).forEach(model => {
    if (model.associate) {
      console.log(`Настройка ассоциаций для модели: ${model.name}`);
      model.associate(sequelize.models);
    }
  });
};

export default sequelize;