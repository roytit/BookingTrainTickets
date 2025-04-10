import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Station = sequelize.define('Station', {
  station_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cities',
      key: 'city_id'
    }
  }
}, {
  tableName: 'stations',
  timestamps: false
});

// Определяем связи
Station.associate = () => {
  Station.belongsTo(sequelize.models.City, {
    foreignKey: 'city_id',
    as: 'city'
  });
};

export default Station;