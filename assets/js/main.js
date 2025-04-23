
let measurementData = [];

async function loadData() {
  const res = await fetch("data.json");
  measurementData = await res.json();
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  let ngCount = 0;

  measurementData.forEach((item, index) => {
    const result = item.result || "N/A";
    const badgeClass = result === "OK" ? "ok" : result === "NG" ? "ng" : "";
    if (result === "NG") ngCount++;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.datetime}</td>
      <td><span class="badge ${badgeClass}">${result}</span></td>
      <td><button class="detail-btn" onclick="showDetail(${index})">詳細</button></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("ngCount").textContent = `異常判定：${ngCount}件`;
  $('#dataTable').DataTable();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function downloadCSV() {
  const table = document.querySelector("#dataTable");
  let csv = "";
  const rows = table.querySelectorAll("tr");
  rows.forEach(row => {
    const cols = row.querySelectorAll("th, td");
    const line = Array.from(cols).map(col => `"${col.textContent.trim()}"`).join(",");
    csv += line + "\n";
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function showDetail(index) {
  const item = measurementData[index];
  const result = item.result || "N/A";
  const badgeClass = result === "OK" ? "ok" : result === "NG" ? "ng" : "";

  document.getElementById("modalName").textContent = item.name;
  document.getElementById("modalTime").textContent = item.datetime;
  document.getElementById("modalResult").textContent = result;
  document.getElementById("modalResult").className = "badge " + badgeClass;
  document.getElementById("detailModal").style.display = "block";
}

function closeModal() {
  document.getElementById("detailModal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("detailModal");
  if (event.target === modal) modal.style.display = "none";
}

window.onload = loadData;
