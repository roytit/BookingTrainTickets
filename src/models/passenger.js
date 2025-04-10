import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Passenger = sequelize.define('Passenger', {
  passenger_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  middle_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  gender: {
    type: DataTypes.CHAR(1),
    allowNull: true
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  passport_series: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  passport_num: {
    type: DataTypes.STRING(6),
    allowNull: true
  }
}, {
  tableName: 'passengers',
  timestamps: false
});

export default Passenger;