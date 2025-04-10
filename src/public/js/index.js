document.addEventListener("DOMContentLoaded", function () {
  const ticketsContainer = document.querySelector(".tickets");

  async function fetchTickets() {
    try {
      const response = await fetch('/api/tickets');
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const tickets = await response.json();
      renderTickets(tickets);
    } catch (error) {
      console.error('Ошибка при получении билетов:', error);
      ticketsContainer.innerHTML = "<p>Не удалось загрузить билеты.</p>";
    }
  }

  function renderTickets(tickets) {
    ticketsContainer.innerHTML = ""; // Очистка контейнера
    if (tickets.length === 0) {
      ticketsContainer.innerHTML = "<p>Билеты не найдены.</p>";
      return;
    }

    tickets.forEach(ticket => {
      const ticketHTML = `
        <div class="ticket">
          <div class="ticket-info">
            <div class="route-line">
              <div class="departure">
                <div class="city">${ticket.departure_city}</div>
                <div class="station">${ticket.departure_station}</div>
                <div class="time">${formatTime(ticket.departure_time)} <span>${formatDate(ticket.departure_time)}</span></div>
              </div>
              <div class="arrival">
                <div class="city">${ticket.arrival_city}</div>
                <div class="station">${ticket.arrival_station}</div>
                <div class="time">${formatTime(ticket.arrival_time)} <span>${formatDate(ticket.arrival_time)}</span></div>
              </div>
              <div class="line-container">
                <div class="line"></div>
                <div class="circle start-circle"></div>
                <div class="circle end-circle"></div>
              </div>
            </div>
            <div class="travel-time">${calculateTravelTime(ticket.departure_time, ticket.arrival_time)}</div>
          </div>
          <div class="ticket-action">
            <div class="price">${ticket.ticket_price}₽</div>
            <div class="availability">Осталось 5 мест</div>
            <button class="ticket-button">Выбрать билет</button>
          </div>
        </div>
      `;
      ticketsContainer.insertAdjacentHTML("beforeend", ticketHTML);
    });
  }

  function formatTime(dateString) {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function formatDate(dateString) {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} / ${days[date.getDay()]}`;
  }

  function calculateTravelTime(departure, arrival) {
    if (!departure || !arrival) return 'Неизвестно';
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ч ${minutes} мин`;
  }

  fetchTickets();
});