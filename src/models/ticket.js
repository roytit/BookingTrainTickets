import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Ticket = sequelize.define('Ticket', {
  ticket_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  arrival_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  departure_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  coach_number: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  seat_number: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  from_station: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  to_station: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  passenger_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'passengers',
      key: 'passenger_id'
    }
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
      key: 'trip_id'
    }
  }
}, {
  tableName: 'tickets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});


export default Ticket;