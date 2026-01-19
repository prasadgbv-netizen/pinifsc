document.addEventListener("DOMContentLoaded", async function () {
  const tableBody = document.getElementById("ifsc-table-body");

  if (!tableBody) return;

  // Get PIN from URL
  const match = window.location.pathname.match(/(\d{6})\.html$/);
  if (!match) return;

  const pin = match[1];

  const DATA_URL = "https://pub-3eb5e8fdd9674e54917a2e25e5662417.r2.dev/data/ifsc_by_code.json";

  try {
    const res = await fetch(DATA_URL);
    const data = await res.json();

    let found = 0;

    Object.values(data).forEach(row => {
      if (row.PIN === pin) {
        found++;

        const tr = document.createElement("tr");
        tr.className = "ifsc-row";

        tr.innerHTML = `
          <td class="bank-name">${row.BANK}</td>
          <td class="branch-name">${row.BRANCH}</td>
          <td class="ifsc-code">
            <a href="../ifsc/${row.IFSC}.html">${row.IFSC}</a>
          </td>
          <td class="copy-cell">
            <button class="copy-btn copy-ifsc-btn" data-ifsc="${row.IFSC}">📋 Copy IFSC</button>
          </td>
          <td class="map-cell">
            <a href="https://www.google.com/maps?q=${encodeURIComponent(row.ADDRESS)}" target="_blank">📍 Map</a>
          </td>
        `;

        tableBody.appendChild(tr);
      }
    });

    if (found === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;color:#666;">
            No bank branches found for this PIN code.
          </td>
        </tr>
      `;
    }

  } catch (err) {
    console.error("PIN fetch failed:", err);
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;color:red;">
          Failed to load bank data.
        </td>
      </tr>
    `;
  }
});
