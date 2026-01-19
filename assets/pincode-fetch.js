const R2_BASE = "https://pub-3eb5e8fdd9674e54917a2e25e5662417.r2.dev";

async function loadIFSCsByPIN(pin) {
  try {
    const res = await fetch(`${R2_BASE}/data/ifsc_by_pin.json`);
    const data = await res.json();

    if (!data[pin]) {
      return [];
    }

    return data[pin];
  } catch (err) {
    console.error("Error loading PIN data from R2:", err);
    return [];
  }
}

// Used in PIN result page
async function renderPINResults(pin) {
  const tableBody = document.getElementById("ifsc-table-body");
  if (!tableBody) return;

  const results = await loadIFSCsByPIN(pin);

  tableBody.innerHTML = "";

  if (results.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5">No IFSC codes found for this PIN</td></tr>`;
    return;
  }

  results.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.BANK}</td>
      <td>${row.BRANCH}</td>
      <td>
        <a href="/ifsc/${row.IFSC}.html">${row.IFSC}</a>
      </td>
      <td>
        <button onclick="copyText('${row.IFSC}')">Copy IFSC</button>
      </td>
      <td>
        <a href="https://www.google.com/maps/search/${encodeURIComponent(row.ADDRESS)}" target="_blank">Map</a>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}
