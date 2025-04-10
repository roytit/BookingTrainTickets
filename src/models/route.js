import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Ticket from './Ticket.js';

const Route = sequelize.define('Route', {
  route_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'routes',
  timestamps: false
});

// Определяем связи
Route.associate = () => {
  Route.hasMany(sequelize.models.RouteByStation, {
    foreignKey: 'route_id',
    as: 'routeByStations'
  });
  
};

export default Route;