let points = 0;
let totalSubtasks = 0;
let completedSubtasks = 0;

function updatePointsDisplay() {
  document.getElementById("points").textContent = points;
  updateRewardButtons();
}

function updateProgressBar() {
  const percent = totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

function addTask() {
  const name = document.getElementById("taskName").value.trim();
  if (!name) return;

  const taskDiv = document.createElement("div");
  taskDiv.className = "task";

  const title = document.createElement("h3");
  title.textContent = name;
  taskDiv.appendChild(title);

  const subInput = document.createElement("input");
  subInput.placeholder = "Ausführungsstufe";

  const ptsInput = document.createElement("input");
  ptsInput.type = "number";
  ptsInput.placeholder = "Punkte";
  ptsInput.min = "1";

  const addBtn = document.createElement("button");
  addBtn.textContent = "➕ Stufe hinzufügen";
  addBtn.onclick = () => {
    const subText = subInput.value.trim();
    const pts = parseInt(ptsInput.value);
    if (!subText || isNaN(pts)) return;

    const subDiv = document.createElement("div");
    subDiv.className = "subtask";
    const span = document.createElement("span");
    span.textContent = `${subText} (${pts} Punkte)`;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✅ Erledigt";
    doneBtn.className = "complete-btn";
    doneBtn.onclick = () => {
      points += pts;
      completedSubtasks++;
      updatePointsDisplay();
      updateProgressBar();
      subDiv.remove();
    };

    subDiv.appendChild(span);
    subDiv.appendChild(doneBtn);
    taskDiv.appendChild(subDiv);

    totalSubtasks++;
    updateProgressBar();
    subInput.value = "";
    ptsInput.value = "";
  };

  taskDiv.appendChild(subInput);
  taskDiv.appendChild(ptsInput);
  taskDiv.appendChild(addBtn);
  document.getElementById("tasks").appendChild(taskDiv);
  document.getElementById("taskName").value = "";
}

function addReward() {
  const name = document.getElementById("rewardName").value.trim();
  const cost = parseInt(document.getElementById("rewardCost").value);
  const repeatable = document.getElementById("rewardRepeatable").checked;
  if (!name || isNaN(cost)) return;

  const rewardDiv = document.createElement("div");
  rewardDiv.className = "reward";
  const span = document.createElement("span");
  span.textContent = `${name} (${cost} Punkte)${repeatable ? ' 🔁' : ''}`;

  const redeemBtn = document.createElement("button");
  redeemBtn.textContent = "🎉 Einlösen";
  redeemBtn.className = "reward-btn";
  redeemBtn.disabled = points < cost;
  redeemBtn.onclick = () => {
    if (points >= cost) {
      points -= cost;
      updatePointsDisplay();
      alert(`Belohnung eingelöst: ${name} 🎉`);
      if (!repeatable) rewardDiv.remove();
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️ Löschen";
  deleteBtn.className = "complete-btn";
  deleteBtn.onclick = () => rewardDiv.remove();

  rewardDiv.appendChild(span);
  rewardDiv.appendChild(redeemBtn);
  rewardDiv.appendChild(deleteBtn);
  document.getElementById("rewards").appendChild(rewardDiv);

  document.getElementById("rewardName").value = "";
  document.getElementById("rewardCost").value = "";
  document.getElementById("rewardRepeatable").checked = false;
}

function updateRewardButtons() {
  document.querySelectorAll(".reward").forEach(reward => {
    const text = reward.innerText;
    const match = text.match(/\((\d+)\s*Punkte\)/);
    if (match) {
      const cost = parseInt(match[1]);
      const btn = reward.querySelector(".reward-btn");
      if (btn) btn.disabled = points < cost;
    }
  });
}
