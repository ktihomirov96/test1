
async function loadOffers() {
  const res = await fetch("http://localhost:3000/offers");
  const data = await res.json();
  const tbody = document.getElementById("offersBody");
  tbody.innerHTML = "";
  data.forEach(o => {
    const row = `<tr><td>${o.projectId}</td><td>${o.client}</td><td>${o.matrixId}</td>
                 <td>${o.description}</td><td>${o.deadline}</td><td>${o.price}</td><td>${o.urgency}</td></tr>`;
    tbody.innerHTML += row;
  });
}

async function addOffer() {
  const body = {
    projectId: document.getElementById("projectId").value,
    client: document.getElementById("client").value,
    matrixId: document.getElementById("matrixId").value,
    description: document.getElementById("description").value,
    deadline: document.getElementById("deadline").value,
    price: +document.getElementById("price").value,
    urgency: document.getElementById("urgency").value
  };
  await fetch("http://localhost:3000/offers", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  loadOffers();
}

window.onload = loadOffers;
