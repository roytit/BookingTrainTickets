import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const City = sequelize.define('City', {
  city_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'cities',
  timestamps: false
});

// Определяем связи
City.associate = () => {
  City.hasMany(sequelize.models.Station, {
    foreignKey: 'city_id',
    as: 'stations'
  });
};

export default City;