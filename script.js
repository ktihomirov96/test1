const form = document.getElementById('offerForm');
const table = document.getElementById('offersTable').querySelector('tbody');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    project: document.getElementById('project').value,
    client: document.getElementById('client').value,
    description: document.getElementById('description').value,
    deadline: document.getElementById('deadline').value,
    price: document.getElementById('price').value,
    ai_risk: aiRisk(document.getElementById('deadline').value)
  };
  addRow(data);
  form.reset();
});

function addRow(data) {
  const row = table.insertRow();
  row.innerHTML = `<td>${data.project}</td><td>${data.client}</td>
    <td>${data.description}</td><td>${data.deadline}</td>
    <td>${data.price}</td><td>${data.ai_risk}</td>`;
}

function aiRisk(deadline) {
  const daysLeft = (new Date(deadline) - new Date()) / (1000*60*60*24);
  if (daysLeft < 3) return "Висок";
  if (daysLeft < 7) return "Среден";
  return "Нисък";
}

function aiSuggest() {
  document.getElementById('price').value = "950";
  const d = new Date();
  d.setDate(d.getDate() + 6);
  document.getElementById('deadline').value = d.toISOString().split('T')[0];
}
