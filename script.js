
function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user === 'admin' && pass === '1234') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainContent').style.display = 'flex';
  } else {
    alert('Грешни данни!');
  }
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function addOffer() {
  const t = document.querySelector('#offersTable tbody');
  const row = t.insertRow();
  row.insertCell().innerText = document.getElementById('proj').value;
  row.insertCell().innerText = document.getElementById('cl').value;
  row.insertCell().innerText = document.getElementById('desc').value;
  row.insertCell().innerText = document.getElementById('deadline').value;
  row.insertCell().innerText = document.getElementById('price').value;
  const urgency = document.getElementById('urgency').value;
  const urgencyCell = row.insertCell();
  urgencyCell.innerText = urgency;
  urgencyCell.style.background = urgency === 'High' ? '#f88' : urgency === 'Medium' ? '#fc3' : '#8f8';
}

function sendChat(e) {
  if (e.key === 'Enter') {
    const msg = document.getElementById('chatInput').value;
    document.getElementById('chatBox').innerHTML += '<div>' + msg + '</div>';
    document.getElementById('chatInput').value = '';
  }
}

function addStock() {
  const m = document.getElementById('mat').value;
  const d = document.getElementById('det').value;
  const q = document.getElementById('qty').value;
  document.getElementById('stockList').innerHTML += `<li>${m} - ${d} : ${q} бр.</li>`;
}

function searchOffers() {
  const keyword = document.getElementById('clientSearch').value.toLowerCase();
  document.querySelectorAll('#offersTable tbody tr').forEach(row => {
    const client = row.cells[1].innerText.toLowerCase();
    row.style.display = client.includes(keyword) ? '' : 'none';
  });
}
