
function login() {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  if (u === "admin" && p === "1234") {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
  } else {
    document.getElementById('login-error').innerText = "Грешно потребителско име или парола.";
  }
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  if (id === 'logout') {
    location.reload();
  } else {
    document.getElementById(id).classList.add('active');
  }
}

function addOffer() {
  const table = document.getElementById('offerTable');
  const row = table.insertRow();
  const fields = ['project', 'client', 'desc', 'deadline', 'price', 'urgency'];
  fields.forEach(id => {
    const cell = row.insertCell();
    const val = document.getElementById(id).value;
    cell.textContent = val;
    if (id === 'urgency') row.className = val;
  });
  document.getElementById('offerForm').reset();
}

function sendChat() {
  const box = document.getElementById('chatBox');
  const msg = document.getElementById('chatInput').value;
  if (msg) {
    const p = document.createElement('p');
    p.textContent = "Ти: " + msg;
    box.appendChild(p);
    document.getElementById('chatInput').value = '';
  }
}

function addStock() {
  const name = document.getElementById('partName').value;
  const qty = document.getElementById('qty').value;
  const li = document.createElement('li');
  li.textContent = name + " - " + qty + " бр.";
  document.getElementById('stockList').appendChild(li);
  document.getElementById('stockForm').reset();
}
