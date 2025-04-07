document.addEventListener("DOMContentLoaded", function () {
    const destinationButtons = document.querySelectorAll(".destinations .destination-btn");
    const destinationSelect = document.querySelector(".field:nth-child(2) select");
    const departureInput = document.getElementById("departure-date");
    const formattedDeparture = document.getElementById("formatted-departure");
    const returnInput = document.getElementById("return-date");
    const formattedReturn = document.getElementById("formatted-return");
    const calendarIconDeparture = document.getElementById("calendar-icon-departure");
    const calendarIconReturn = document.getElementById("calendar-icon-return");
    const authButtonsContainer = document.getElementById("authButtons");
  
    // Проверка авторизации
    fetch("/api/check-auth")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        renderAuthButtons(true); // Авторизован
      })
      .catch(() => {
        renderAuthButtons(false); // Не авторизован
      });
  
    function renderAuthButtons(isAuthenticated) {
      if (isAuthenticated) {
        authButtonsContainer.innerHTML = `
          <button class="btn" onclick="window.location.href='/profile/user-info'">Профиль</button>
        `;
      } else {
        authButtonsContainer.innerHTML = `
          <button class="btn" onclick="window.location.href='/register'">Регистрация</button>
          <button class="btn" onclick="window.location.href='/login'">Вход</button>
        `;
      }
    }
  
    function activateButton(button) {
      destinationButtons.forEach(btn => {
        btn.classList.remove("active");
        btn.innerHTML = btn.innerHTML.replace(/<img[^>]+>/, "");
      });
      button.classList.add("active");
      button.innerHTML = `<img src="../icons/speed.png" alt="Speed" class="icon"> ${button.textContent.trim()}`;
      updateSelectValue(button.textContent.trim());
    }
  
    function updateSelectValue(value) {
      destinationSelect.querySelector("option").textContent = value;
    }
  
    function formatDate(dateString) {
      const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
      const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
      const date = new Date(dateString);
      return `${date.getDate()} ${months[date.getMonth()]} / ${days[date.getDay()]}`;
    }
  
    function updateDate(input, display) {
      if (input.value) {
        display.textContent = formatDate(input.value);
      }
    }
  
    destinationButtons.forEach(button => {
      if (button.classList.contains("active")) {
        activateButton(button);
      }
      button.addEventListener("click", () => activateButton(button));
    });
  
    departureInput.style.visibility = "hidden";
    returnInput.style.visibility = "hidden";
  
    departureInput.addEventListener("input", () => updateDate(departureInput, formattedDeparture));
    returnInput.addEventListener("input", () => updateDate(returnInput, formattedReturn));
  
    calendarIconDeparture.addEventListener("click", () => departureInput.showPicker());
    calendarIconReturn.addEventListener("click", () => returnInput.showPicker());
  
    updateDate(departureInput, formattedDeparture);
    updateDate(returnInput, formattedReturn);
  
    const swapBtn = document.getElementById("swap-btn");
    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");
  
    if (swapBtn && fromSelect && toSelect) {
      swapBtn.addEventListener("click", function () {
        let temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
      });
    }
  });
  