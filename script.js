
document.getElementById('offerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const t = document.querySelector("#offersTable tbody");
  const p = document.getElementById("project").value;
  const c = document.getElementById("client").value;
  const d = document.getElementById("description").value;
  const deadline = document.getElementById("deadline").value;
  const price = document.getElementById("price").value;
  const risk = (Math.random() > 0.5) ? "Нисък" : "Висок";
  const row = `<tr><td>${p}</td><td>${c}</td><td>${d}</td><td>${deadline}</td><td>${price}</td><td>${risk}</td></tr>`;
  t.innerHTML += row;
});

function generateAI() {
  document.getElementById("deadline").value = "2025-06-01";
  document.getElementById("price").value = 1200;
}

function sendMessage() {
  const msg = document.getElementById("chatInput").value;
  if (!msg.trim()) return;
  const box = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.textContent = msg;
  box.appendChild(div);
  document.getElementById("chatInput").value = "";
}
