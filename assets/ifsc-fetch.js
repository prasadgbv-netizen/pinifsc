const R2_BASE = "https://pub-3eb5e8fdd9674e54917a2e25e5662417.r2.dev";

async function loadIFSCDetails(ifsc) {
  try {
    const res = await fetch(`${R2_BASE}/data/ifsc_by_code.json`);
    const data = await res.json();

    return data[ifsc] || null;
  } catch (err) {
    console.error("Error loading IFSC data from R2:", err);
    return null;
  }
}

// Used in IFSC detail page
async function renderIFSCPage(ifsc) {
  const record = await loadIFSCDetails(ifsc);

  if (!record) {
    document.getElementById("ifsc-container").innerHTML =
      "<p>IFSC code not found.</p>";
    return;
  }

  document.getElementById("bank-name").textContent = record.BANK;
  document.getElementById("branch-name").textContent = record.BRANCH;
  document.getElementById("ifsc-code").textContent = record.IFSC;
  document.getElementById("address").textContent = record.ADDRESS;
  document.getElementById("micr").textContent = record.MICR || "NA";
  document.getElementById("pin").textContent = record.PIN || "NA";
}
