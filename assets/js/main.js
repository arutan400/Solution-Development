let measurementData = [];

async function loadData() {
  try {
    const res = await fetch("data.json");
    measurementData = await res.json();
    renderTable();
  } catch (e) {
    console.error("データ取得に失敗しました", e);
    alert("データ取得に失敗しました。コンソールを確認してください。");
  }
}

function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  let ngCount = 0;

  measurementData.forEach((item, index) => {
    const result = item.result || "N/A";
    const badgeClass = result === "OK" ? "ok" : result === "NG" ? "ng" : "na";
    if (result === "NG") ngCount++;

    const row = document.createElement("tr");
    row.setAttribute("role", "row");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.datetime}</td>
      <td><span class="badge ${badgeClass}" aria-label="判定結果">${result}</span></td>
      <td>
        <button class="detail-btn" aria-label="詳細を表示" onclick="showDetail(${index})">詳細</button>
        <button class="edit-btn" aria-label="編集" onclick="editItem(${index})">編集</button>
      </td>
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
    const line = Array.from(cols).map(col => `"\${col.textContent.trim()}"`).join(",");
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
  const badgeClass = result === "OK" ? "ok" : result === "NG" ? "ng" : "na";

  document.getElementById("modalName").textContent = item.name;
  document.getElementById("modalTime").textContent = item.datetime;
  document.getElementById("modalResult").textContent = result;
  document.getElementById("modalResult").className = "badge " + badgeClass;
  document.getElementById("detailModal").style.display = "block";
}

function editItem(index) {
  const item = measurementData[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("editName").value = item.name;
  document.getElementById("editTime").value = item.datetime;
  document.getElementById("editResult").value = item.result || "";
  document.getElementById("editModal").style.display = "block";
}

async function saveEdit() {
  const index = document.getElementById("editIndex").value;
  const updated = {
    name: document.getElementById("editName").value,
    datetime: document.getElementById("editTime").value,
    result: document.getElementById("editResult").value
  };

  measurementData[index] = updated;

  document.getElementById("editModal").style.display = "none";
  renderTable();
}

function closeModal() {
  document.getElementById("detailModal").style.display = "none";
  document.getElementById("editModal").style.display = "none";
}

window.onclick = function(event) {
  if (event.target.id === "detailModal" || event.target.id === "editModal") {
    closeModal();
  }
};

window.onload = loadData;
