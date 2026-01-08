import './style.css';
import { startPractice } from './practice.js';
import { stopPractice } from './practice.js';
import { renderCalendarView } from './calendar.js';

/* =========================
   1. STATE
========================= */

const STORAGE_KEY = 'riyaaz.session';

let session = loadSession() || [
  { name: "Warm Up", minutes: 10 },
  { name: "Alankaar Practice", minutes: 10 }
];

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed.map(item => ({
      name: typeof item.name === 'string' ? item.name : 'Untitled',
      minutes: Number(item.minutes) || 0
    }));
  } catch (err) {
    return null;
  }
}

function saveSession() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    /* ignore quota errors */
  }
} 

export let appMode = "CONFIG"; 
let pendingNavigation = null;

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
  saveSession();
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
  appMode = "CONFIG";
  updateNavActive(appMode);
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

export function renderStopConfirmModal() {
  const modal = document.createElement("div");
  modal.id = "stop-modal";

  modal.innerHTML = `
  
  <div class="modal-box"></div>
    <div class="modal">
      <h3>Stop Practice?</h3>
      <p>Your progress will be lost!</p>

      <div class="modal-actions">
        <button id="confirm-stop" class="danger">Stop & Log Riyaaz</button>
        <button id="cancel-stop">Go Back</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

export function setAppMode(mode) {
  appMode = mode;
}

export function getAppMode() {
  return appMode;
}

export function updateNavActive(view) {
  document
    .querySelectorAll(".bottom-nav button")
    .forEach(btn => btn.classList.remove("active"));

  if (view === "CONFIG") {
    document.getElementById("home").classList.add("active");
  }


  if (view === "CAL") {
    document.getElementById("calendar").classList.add("active");
  }

  if (view === "SET") {
    document.getElementById("settings").classList.add("active");
  }
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
    saveSession();
  }

  if (e.target.classList.contains("name-input")) {
    const index = e.target.dataset.index;
    session[index].name = e.target.textContent.trim() || "Untitled";
    saveSession();
  }
});

document.addEventListener("click", e => {
  if (e.target.classList.contains("delete")) {
    syncNamesFromDOM();
    session.splice(e.target.dataset.index, 1);
    renderSliders();
    updateTotalTimeUI();
    saveSession();
  }

  if (e.target.id === "add-timer") {
    syncNamesFromDOM();
    session.push({ name: "New Section", minutes: 10 });
    renderSliders();
    updateTotalTimeUI();
    saveSession();
  }

  if (e.target.id === "start_riyaaz") {
    syncNamesFromDOM();
    startPractice(session);
  }
});

document.addEventListener("click", e => {
  if (e.target.id === "cancel-stop") {
    document.getElementById("stop-modal")?.remove();
    pendingNavigation = null;
    setAppMode("PRAC");
  }

  if (e.target.id === "confirm-stop") {
    document.getElementById("stop-modal")?.remove();
    // actually stop and then navigate to the pending destination
    stopPractice();

    if (pendingNavigation === "CONFIG") {
      setAppMode("CONFIG");
      updateNavActive("CONFIG");
      renderConfigureView();
    } else if (pendingNavigation === "CAL") {
      setAppMode("CAL");
      updateNavActive("CAL");
      renderCalendarView();
    } else {
      // fallback
      setAppMode("CONFIG");
      updateNavActive("CONFIG");
      renderConfigureView();
    }

    pendingNavigation = null;
  }
});

document.getElementById("home").addEventListener("click", () => {
  if (appMode === "PRAC") {
    pendingNavigation = "CONFIG";
    renderStopConfirmModal();
  } else {
    setAppMode("CONFIG");
    updateNavActive("CONFIG");
    renderConfigureView();
  }
});

document.getElementById("calendar").addEventListener("click", ()=>{
  if (appMode === "PRAC") {
    pendingNavigation = "CAL";
    renderStopConfirmModal();
  } else {
    setAppMode("CAL");
    updateNavActive("CAL");
    renderCalendarView();
  }
});



/* =========================
   5. INITIAL LOAD
========================= */

renderConfigureView();


