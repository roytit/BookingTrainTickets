import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Train = sequelize.define('Train', {
  train_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  train_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  train_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  total_seats: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'trains',
  timestamps: false
});

export default Train;