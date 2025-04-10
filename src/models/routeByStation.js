import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RouteByStation = sequelize.define('RouteByStation', {
  route_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // Первичный ключ
    references: {
      model: 'routes',
      key: 'route_id'
    }
  },
  station_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // Первичный ключ
    references: {
      model: 'stations',
      key: 'station_id'
    }
  },
  arrival_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  departure_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  station_order_num: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'route_by_stations',
  timestamps: false
});

// Определяем связи
RouteByStation.associate = () => {
  RouteByStation.belongsTo(sequelize.models.Route, {
    foreignKey: 'route_id',
    as: 'route'
  });

  RouteByStation.belongsTo(sequelize.models.Station, {
    foreignKey: 'station_id',
    as: 'station'
  });
};

export default RouteByStation;