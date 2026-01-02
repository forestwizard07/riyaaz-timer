import './style.css'



document.querySelector('#app').innerHTML = `
  <div>
    <h1>Riyaaz Timer</h1>
    <h2>Customize your Riyaaz</h2>
    <div class="home_table">
      <table id="timers-table"></table>
<br>
<button id="add-timer">+ Add Section</button><br><br>

      <button>Start Riyaaz!</button>
    </div>
  </div>
   

`

let session = [
  { name: "Warm Up", minutes: 10 },
  { name: "Alankaar Practice", minutes: 10 }
];
renderSliders();




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



document.getElementById("add-timer").addEventListener("click", () => {
  session.push({ name: "New Section", minutes: 10 });
  renderSliders();
});

document.addEventListener("input", e => {
  if (e.target.classList.contains("slider")) {
    const index = e.target.dataset.index;
    const value = e.target.value;

    session[index].minutes = value;
    e.target
      .closest("td")
      .querySelector(".output")
      .textContent = value;
  }
});

document.addEventListener("input", e => {
  if (e.target.classList.contains("name-input")) {
    session[e.target.dataset.index].name = e.target.value;
  }
});

document.addEventListener("click", e => {
  if (e.target.classList.contains("delete")) {
    session.splice(e.target.dataset.index, 1);
    renderSliders();
  }
});
