
document.getElementById('offerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('projectId').value;
    const client = document.getElementById('client').value;
    const matrixId = document.getElementById('matrixId').value;
    const desc = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;
    const price = document.getElementById('price').value;
    const urgency = document.getElementById('urgency').value;

    const table = document.querySelector('#offersTable tbody');
    const row = table.insertRow();
    row.className = urgency;
    row.innerHTML = `<td>${id}</td><td>${client}</td><td>${matrixId}</td><td>${desc}</td><td>${deadline}</td><td>${price}</td><td>${urgency}</td>`;

    updateRepairHistory(matrixId);
    this.reset();
});

function searchMatrix() {
    const input = document.getElementById("searchMatrix").value.toUpperCase();
    const rows = document.querySelectorAll("#offersTable tbody tr");
    rows.forEach(row => {
        const cell = row.cells[2];
        row.style.display = cell && cell.textContent.toUpperCase().includes(input) ? "" : "none";
    });
}

function aiSuggest() {
    const desc = document.getElementById("description").value.toLowerCase();
    let price = 1000, days = 10;
    if (desc.includes("спешно")) { price += 500; days = 3; }
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    document.getElementById("deadline").value = deadline.toISOString().split("T")[0];
    document.getElementById("price").value = price;
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatBox");
    if (input.value.trim()) {
        const p = document.createElement("p");
        p.textContent = "Ти: " + input.value;
        chatBox.appendChild(p);
        input.value = "";
    }
}

function login() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;
    if (u === "admin" && p === "1234") {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("platform").style.display = "block";
    } else {
        alert("Невалиден вход.");
    }
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

const repairHistoryData = {};
function updateRepairHistory(matrixId) {
    if (!repairHistoryData[matrixId]) repairHistoryData[matrixId] = 1;
    else repairHistoryData[matrixId]++;
    const box = document.getElementById("repairHistory");
    box.innerHTML = "";
    for (const key in repairHistoryData) {
        const count = repairHistoryData[key];
        const warn = count >= 3 ? " <span style='color:red'>(висок риск)</span>" : "";
        box.innerHTML += `<div><strong>${key}</strong>: ${count} ремонта${warn}</div>`;
    }
}

async function loadOffers() {
  const res = await fetch("/offers");
  const data = await res.json();
  const tbody = document.getElementById("offersBody");
  tbody.innerHTML = "";
  data.forEach(o => {
    const row = `<tr><td>${o.projectId}</td><td>${o.client}</td><td>${o.matrixId}</td>
                 <td>${o.description}</td><td>${o.deadline}</td><td>${o.price}</td><td>${o.urgency}</td></tr>`;
    tbody.innerHTML += row;
    updateRepairHistory(o.matrixId);
  });
}

async function saveOffer(e) {
  e.preventDefault();
  const offer = {
    projectId: document.getElementById("projectId").value,
    client: document.getElementById("client").value,
    matrixId: document.getElementById("matrixId").value,
    description: document.getElementById("description").value,
    deadline: document.getElementById("deadline").value,
    price: +document.getElementById("price").value,
    urgency: document.getElementById("urgency").value
  };
  await fetch("/offers", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offer)
  });
  loadOffers();
}
document.getElementById("offerForm").addEventListener("submit", saveOffer);
