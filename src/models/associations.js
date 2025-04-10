import City from './City.js';
import Station from './Station.js';
import Route from './Route.js';
import RouteByStation from './RouteByStation.js';
import Ticket from './Ticket.js';
import Passenger from './Passenger.js';
import Trip from './Trip.js';
import Train from './Train.js';

// Связи между таблицами
Station.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

RouteByStation.belongsTo(Route, { foreignKey: 'route_id', as: 'route' });
RouteByStation.belongsTo(Station, { foreignKey: 'station_id', as: 'station' });

Ticket.belongsTo(Passenger, { foreignKey: 'passenger_id', as: 'passenger' });
Ticket.belongsTo(Trip, { foreignKey: 'trip_id', as: 'trip' });

Trip.belongsTo(Train, { foreignKey: 'train_id', as: 'train' });
Trip.belongsTo(Route, { foreignKey: 'route_id', as: 'route' });

Route.hasMany(RouteByStation, { foreignKey: 'route_id', as: 'routeByStations' });

// Вызов методов associate (если они есть)
City.associate?.();
Station.associate?.();
Route.associate?.();
Ticket.associate?.();
Passenger.associate?.();
Trip.associate?.();
Train.associate?.();