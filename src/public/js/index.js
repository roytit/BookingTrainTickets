document.addEventListener("DOMContentLoaded", function () {
  const destinationButtons = document.querySelectorAll(".destinations .destination-btn");
  const destinationSelect = document.querySelector(".field:nth-child(2) select");
  const departureInput = document.getElementById("departure-date");
  const formattedDeparture = document.getElementById("formatted-departure");
  const returnInput = document.getElementById("return-date");
  const formattedReturn = document.getElementById("formatted-return");
  const calendarIconDeparture = document.getElementById("calendar-icon-departure");
  const calendarIconReturn = document.getElementById("calendar-icon-return");

  if (!destinationSelect) {
      console.error("Элемент <select> не найден!");
      return;
  }

  function activateButton(button) {
      destinationButtons.forEach(btn => {
          btn.classList.remove("active");
          btn.innerHTML = btn.innerHTML.replace(/<img[^>]+>/, "");
      });
      button.classList.add("active");
      button.innerHTML = `<img src="../icons/speed.png" alt="Speed" class="icon"> ${button.innerHTML}`;
      updateSelectValue(button.textContent.trim());
  }

  function updateSelectValue(value) {
      destinationSelect.querySelector("option").textContent = value;
      console.log("Выбрано направление:", value);
  }

  function formatDate(dateString) {
      const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
      const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
      let date = new Date(dateString);
      return `${date.getDate()} ${months[date.getMonth()]} / ${days[date.getDay()]}`;
  }

  function updateDate(inputElement, displayElement) {
      if (inputElement.value) {
          displayElement.textContent = formatDate(inputElement.value);
      }
  }

  destinationButtons.forEach(button => {
      if (button.classList.contains("active")) {
          activateButton(button);
      }
      button.addEventListener("click", function () {
          activateButton(this);
      });
  });

  departureInput.style.visibility = "hidden";
  returnInput.style.visibility = "hidden";

  departureInput.addEventListener("input", function () {
      updateDate(departureInput, formattedDeparture);
  });

  returnInput.addEventListener("input", function () {
      updateDate(returnInput, formattedReturn);
  });

  calendarIconDeparture.addEventListener("click", function () {
      departureInput.showPicker();
  });

  calendarIconReturn.addEventListener("click", function () {
      returnInput.showPicker();
  });

  updateDate(departureInput, formattedDeparture);
  updateDate(returnInput, formattedReturn);

  const swapBtn = document.getElementById("swap-btn");
  const fromSelect = document.getElementById("from");
  const toSelect = document.getElementById("to");

  swapBtn.addEventListener("click", function () {
      // Меняем значения местами
      let temp = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = temp;
  });

  
});