import { getPracticeLog } from "./calendarStore.js";
import { clearPracticeForDate } from "./calendarStore.js";
import { setAppMode } from "./main.js";

let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth(); 

let pendingClearDate = null;

export function renderCalendarView() {
    setAppMode("CAL");
    const log = getPracticeLog();

  const year = calendarYear;
  const month = calendarMonth;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = firstDay.getDay(); // 0 = Sun
  const daysInMonth = lastDay.getDate();

  const monthLabel = firstDay.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  let cells = "";

  // empty cells before month start
  for (let i = 0; i < startWeekday; i++) {
    cells += `<div class="calendar-cell empty"></div>`;
  }

  // actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const minutes = log[dateKey] || 0;

   cells += `
    <div class="calendar-cell ${minutes ? "active" : ""}"
        data-date="${dateKey}">
        <div class="date">${day}</div>
        ${minutes ? `<div class="minutes">${minutes} min</div>` : ""}
    </div>
    `;

  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdayHeaders = weekdays
    .map(d => `<div class="weekday">${d}</div>`)
    .join("");

  // compute number of practiced days in the current month
  const daysPracticed = Object.keys(log).filter(k => {
    const [y, m] = k.split('-').map(Number);
    return y === year && m === (month + 1) && (log[k] || 0) > 0;
  }).length;

  document.querySelector("#app").innerHTML = `
    <div class="calendar-view">
      <div class="calendar-header">
        <button id="prev-month">‹</button>
        <h2>${monthLabel}</h2>
        <button id="next-month">›</button>
      </div>

      <div class="calendar-grid">
        ${weekdayHeaders}
        ${cells}
      </div>

      <div class="calendar-footer">
        Days practiced this month: <strong>${daysPracticed}</strong>
      </div>

    </div>
  `;
}

function renderClearDayModal(dateKey) {
  // Prevent duplicate modals
  if (document.getElementById("clear-day-modal")) return;

  pendingClearDate = dateKey;

  const modal = document.createElement("div");
  modal.id = "clear-day-modal";

  modal.innerHTML = `
    <div class="modal-box"></div>

    <div class="modal">
      <h3>Clear Practice?</h3>
      <p>Remove practice log for <strong>${dateKey}</strong>?</p>

      <div class="modal-actions">
        <button id="cancel-clear">Go Back</button>
        <button id="confirm-clear" class="danger">Clear</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

document.addEventListener("click", e => {
  const cell = e.target.closest(".calendar-cell");

  if (!cell || !cell.dataset.date) return;

  // Only if this day has practice
  if (!cell.classList.contains("active")) return;

  renderClearDayModal(cell.dataset.date);
});



document.addEventListener("click", e => {
  if (e.target.id === "prev-month") {
    calendarMonth--;

    if (calendarMonth < 0) {
      calendarMonth = 11;
      calendarYear--;
    }

    renderCalendarView();
  }

  if (e.target.id === "next-month") {
    calendarMonth++;

    if (calendarMonth > 11) {
      calendarMonth = 0;
      calendarYear++;
    }

    renderCalendarView();
  }
});

document.addEventListener("click", e => {
  // Cancel
  if (e.target.id === "cancel-clear" || 
      e.target.classList.contains("modal-backdrop")) {
    document.getElementById("clear-day-modal")?.remove();
    pendingClearDate = null;
  }

  // Confirm
  if (e.target.id === "confirm-clear" && pendingClearDate) {
    clearPracticeForDate(pendingClearDate);
    pendingClearDate = null;
    document.getElementById("clear-day-modal")?.remove();
    renderCalendarView();
  }
});
