import './style.css';
import { startPractice } from './practice.js';
import { stopPractice } from './practice.js';

/* =========================
   1. STATE
========================= */

let session = [
  { name: "Warm Up", minutes: 10 },
  { name: "Alankaar Practice", minutes: 10 }
];

/* =========================
   2. PURE HELPERS
========================= */

function getTotalMinutes() {
  return session.reduce((sum, item) => sum + Number(item.minutes || 0), 0);
}

function syncNamesFromDOM() {
  document.querySelectorAll(".name-input").forEach(el => {
    const index = el.dataset.index;
    session[index].name = el.textContent.trim() || "Untitled";
  });
}

/* =========================
   3. RENDER FUNCTIONS
========================= */

function renderSliders() {
  const table = document.getElementById("timers-table");
  table.innerHTML = "";

  session.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div
          class="name-input"
          contenteditable="true"
          data-index="${index}"
        >
          ${item.name}
        </div>
      </td>

      <td>
        <input
          type="range"
          class="slider"
          data-index="${index}"
          min="0"
          max="20"
          step="1"
          value="${item.minutes}"
        >
        <div class="value">
          <span class="output">${item.minutes}</span> Min
        </div>
      </td>

      <td>
        <button class="delete" data-index="${index}">❌</button>
      </td>
    `;

    table.appendChild(row);
  });
}

function updateTotalTimeUI() {
  document.getElementById("total_time").textContent = getTotalMinutes();
}

export function renderConfigureView() {
  document.querySelector("#app").innerHTML = `
    <div>
      <h1>Riyaaz Timer</h1>
      <h2>Customize your Riyaaz</h2>

      <div class="home_table">
        <table id="timers-table"></table>
        <br>

        <button id="add-timer">+ Add Section</button><br><br>

        <button id="start_riyaaz">
          Start • <span id="total_time"></span> min
        </button>
      </div>
    </div>
  `;

  renderSliders();
  updateTotalTimeUI();
}

/* =========================
   4. EVENT HANDLERS
========================= */

document.addEventListener("input", e => {
  if (e.target.classList.contains("slider")) {
    const index = e.target.dataset.index;
    session[index].minutes = Number(e.target.value);

    e.target.closest("td")
      .querySelector(".output")
      .textContent = e.target.value;

    updateTotalTimeUI();
  }
});

document.addEventListener("click", e => {
  if (e.target.classList.contains("delete")) {
    syncNamesFromDOM();
    session.splice(e.target.dataset.index, 1);
    renderSliders();
    updateTotalTimeUI();
  }

  if (e.target.id === "add-timer") {
    syncNamesFromDOM();
    session.push({ name: "New Section", minutes: 10 });
    renderSliders();
    updateTotalTimeUI();
  }

  if (e.target.id === "start_riyaaz") {
    syncNamesFromDOM();
    startPractice(session);
  }

  if (e.target.id === "home") {
    stopPractice();
  }
});

/* =========================
   5. INITIAL LOAD
========================= */

renderConfigureView();

document.getElementById("home").addEventListener("click", () => {
  stopPractice();          // stop timer if running
  renderConfigureView();   // show configure screen
});
