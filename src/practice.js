
import { renderConfigureView } from "./main.js";

let timer = null;

export function startPractice(session) {
   clearInterval(timer);
    const queue = session.map(s => ({
    name: s.name,
    duration: s.minutes * 60
  }));

  runPractice(queue, 0);
}

function runPractice(queue, index) {
  if (index >= queue.length) {
    renderComplete();
    return;
  }

  const section = queue[index];
  let elapsed = 0;

  clearInterval(timer);
  renderPracticeView(section, elapsed, section.duration);

  timer = setInterval(() => {
    elapsed++;
    renderPracticeView(section, elapsed, section.duration);

    if (elapsed >= section.duration) {
      clearInterval(timer);
      runPractice(queue, index + 1);
    }
  }, 1000);
}

function renderPracticeView(section, elapsed, total) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = elapsed / total;
  const offset = circumference * (1 - progress);

  const remaining = total - elapsed;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeText = `${mins}:${secs.toString().padStart(2, "0")}`;

  document.querySelector("#app").innerHTML = `
    <div class="practice">

      <svg width="220" height="220" class="circle-timer">

        <!-- background ring -->
        <circle
          cx="110"
          cy="110"
          r="${radius}"
          stroke="#333"
          stroke-width="10"
          fill="none"
        />

        <!-- progress ring -->
        <circle
          cx="110"
          cy="110"
          r="${radius}"
          stroke="#1db954"
          stroke-width="10"
          fill="none"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          stroke-linecap="round"
          transform="rotate(-90 110 110)"
        />

        <!-- countdown -->
        <text
          x="110"
          y="105"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="32"
          font-weight="bold"
          fill="#fff"
        >
          ${timeText}
        </text>

        <!-- section name -->
        <text
          x="110"
          y="135"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="14"
          fill="#aaa"
        >
          ${section.name}
        </text>

      </svg>
        <br>
      <button id="stop">Stop</button>
    </div>
  `;
}


function renderComplete() {
  document.querySelector("#app").innerHTML = `
    <div class="practice">
      <h2>Riyaaz Complete 🎶</h2>
      <button id="done">Done</button>
    </div>
  `;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function stopPractice() {
  clearInterval(timer);
  renderConfigureView();
}

document.addEventListener("click", e => {
  if (e.target.id === "stop") {
    stopPractice();
  }
});

document.addEventListener("click", e => {
  if (e.target.id === "done") {
    stopPractice();
  }
});
