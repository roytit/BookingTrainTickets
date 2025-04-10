import Route from '../models/Route.js';
import RouteByStation from '../models/RouteByStation.js';
import Station from '../models/Station.js';
import City from '../models/City.js';

export const getTickets = async (req, res) => {
  try {
    const tickets = await Route.findAll({
      include: [
        {
          model: RouteByStation,
          as: 'routeByStations',
          include: [
            {
              model: Station,
              as: 'station',
              include: [
                {
                  model: City,
                  as: 'city'
                }
              ]
            }
          ],
          order: [['station_order_num', 'ASC']]
        }
      ]
    });

    const formattedTickets = tickets.map(ticket => {
      const departure = ticket.routeByStations.find(station => station.station_order_num === 1);
      const arrival = ticket.routeByStations.find(station => station.station_order_num === 2);

      return {
        route_name: ticket.name,
        departure_city: departure?.station?.city?.name || 'Неизвестно',
        departure_station: departure?.station?.name || 'Неизвестно',
        departure_time: departure?.departure_time || 'Неизвестно',
        arrival_city: arrival?.station?.city?.name || 'Неизвестно',
        arrival_station: arrival?.station?.name || 'Неизвестно',
        arrival_time: arrival?.arrival_time || 'Неизвестно',
        
      };
    });

    res.json(formattedTickets);
  } catch (error) {
    console.error('Ошибка при получении билетов:', error.message);
    res.status(500).json({ error: 'Ошибка сервера', details: error.message });
  }
};