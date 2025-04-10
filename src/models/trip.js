import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Trip = sequelize.define('Trip', {
  trip_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  train_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trains',
      key: 'train_id'
    }
  },
  route_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'routes',
      key: 'route_id'
    }
  }
}, {
  tableName: 'trips',
  timestamps: false
});

export default Trip;