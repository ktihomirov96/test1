
function login() {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  if (u === "admin" && p === "1234") {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-content").style.display = "flex";
  } else {
    alert("Грешен вход!");
  }
}
function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
document.getElementById("offerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const pid = document.getElementById("projectId").value;
  const client = document.getElementById("client").value;
  const desc = document.getElementById("description").value;
  const matrix = document.getElementById("matrixId").value;
  const deadline = document.getElementById("deadline").value;
  const price = document.getElementById("price").value;
  const urgency = document.getElementById("urgency").value;

  const row = document.createElement("tr");
  row.className = urgency;
  row.innerHTML = `<td>${pid}</td><td>${client}</td><td>${desc}</td><td>${matrix}</td><td>${deadline}</td><td>${price}</td><td>${urgency}</td>`;
  document.getElementById("offersTable").appendChild(row);

  const history = document.createElement("div");
  history.innerText = `Матрица ${matrix} е ремонтирана.`;
  document.getElementById("repairHistory").appendChild(history);
});

function searchOffers() {
  const filter = document.getElementById("searchClient").value.toLowerCase();
  const rows = document.querySelectorAll("#offersTable tr");
  for (let i = 1; i < rows.length; i++) {
    const txt = rows[i].children[1].textContent.toLowerCase();
    rows[i].style.display = txt.includes(filter) ? "" : "none";
  }
}
function sendMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value;
  if (msg.trim()) {
    const chat = document.getElementById("chatWindow");
    const p = document.createElement("p");
    p.textContent = "Вие: " + msg;
    chat.appendChild(p);
    input.value = "";
  }
}
function addWarehouse() {
  const id = document.getElementById("matrixSearch").value;
  const detail = document.getElementById("matrixDetail").value;
  const qty = document.getElementById("matrixQuantity").value;
  const div = document.getElementById("warehouseData");
  div.innerHTML += `<p>${id} – ${detail} – ${qty} бр</p>`;
}
