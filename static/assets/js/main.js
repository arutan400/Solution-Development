let measurementData = [];

async function loadData() {
  try {
    const res = await fetch("/api/proxy_nodes");
    if (!res.ok) throw new Error("サーバーエラー");
    measurementData = await res.json();
    renderTable();
  } catch (e) {
    console.error("データ取得に失敗しました", e);
  }
}

function normalizeResult(result) {
  if (typeof result !== "string") return "NA";
  if (result.includes("異常")) return "NG";
  if (result.includes("正常")) return "OK";
  return "NA";
}

function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  let ngCount = 0;

  measurementData.forEach((item) => {
    const rawResult = item.result || "N/A";
    const result = normalizeResult(rawResult);
    const badgeClass = result === "OK" ? "ok" : result === "NG" ? "ng" : "na";
    if (result === "NG") ngCount++;

    let formattedDate = item.measurement_date;
    if (formattedDate && typeof formattedDate === "string" && formattedDate.includes("UTC")) {
      try {
        const date = new Date(Date.parse(formattedDate));
        formattedDate = date.toLocaleString("ja-JP");
      } catch (e) {
        // フォーマット失敗時はそのまま
      }
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.facility_name || "-"}</td>
      <td>${item.machine_type || "-"}</td>
      <td>${formattedDate || "-"}</td>
      <td><span class="badge ${badgeClass}">${result}</span></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("ngCount").textContent = `異常判定：${ngCount}件`;

  if (!$.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

window.onload = loadData;