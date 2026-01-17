document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("ifscTableBody");
  const titleEl = document.getElementById("pinTitle");

  if (!tableBody || !titleEl) return;

  // Extract PIN from URL: /pincode/520011.html
  const pin = window.location.pathname.split("/").pop().replace(".html", "");
  titleEl.textContent = `Banks with IFSC Codes Situated in PIN Code ${pin}`;

  try {
    // Load PIN → IFSC mapping
    const pinMapRes = await fetch("/data/ifsc_by_pin.json");
    const pinMap = await pinMapRes.json();

    const ifscList = pinMap[pin];
    if (!ifscList || ifscList.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">No IFSC codes found for this PIN.</td></tr>`;
      return;
    }

    // Load IFSC details
    const ifscDataRes = await fetch("/data/ifsc_enriched.json");
    const ifscData = await ifscDataRes.json();

    let rows = "";
    ifscList.forEach(ifsc => {
      const d = ifscData[ifsc];
      if (!d) return;

      rows += `
        <tr>
          <td>${d.bank}</td>
          <td>${d.branch}</td>
          <td>
            <a href="/ifsc/${ifsc}.html">${ifsc}</a>
          </td>
          <td>
            <button onclick="navigator.clipboard.writeText('${ifsc}')">
              Copy IFSC
            </button>
          </td>
          <td>
            <a href="https://www.google.com/maps?q=${encodeURIComponent(d.address)}" target="_blank">
              Map
            </a>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = rows;

  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="5">Error loading data.</td></tr>`;
  }
});
