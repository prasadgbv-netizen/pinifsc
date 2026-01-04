document.addEventListener("DOMContentLoaded", () => {
  const atmSection = document.querySelector(".atm-section");
  if (!atmSection) return;

  const pin = atmSection.dataset.pin;
  const atmList = document.getElementById("atm-list");

  // Filter UI
  const filterBar = document.createElement("div");
  filterBar.className = "atm-filters";
  filterBar.innerHTML = `
    <strong>Filter ATMs:</strong>
    <button data-bank="all" class="active">All</button>
    <button data-bank="sbi">SBI</button>
    <button data-bank="hdfc">HDFC</button>
    <button data-bank="icici">ICICI</button>
    <button data-bank="axis">Axis</button>
  `;
  atmSection.insertBefore(filterBar, atmList);

  let allATMs = [];

  const getCardBadges = operator => {
    const op = (operator || "").toLowerCase();

    if (op.includes("sbi") || op.includes("state bank")) {
      return "💳 RuPay • Visa";
    }
    if (op.includes("hdfc") || op.includes("icici") || op.includes("axis")) {
      return "💳 Visa • MasterCard";
    }
    if (op.includes("punjab") || op.includes("canara") || op.includes("bank of india")) {
      return "💳 RuPay • Visa";
    }
    return "💳 Visa";
  };

  const renderATMs = (bankFilter = "all") => {
    atmList.innerHTML = "";

    const filtered =
      bankFilter === "all"
        ? allATMs
        : allATMs.filter(atm =>
            (atm.operator || "").toLowerCase().includes(bankFilter)
          );

    if (!filtered.length) {
      atmList.innerHTML = "<li>No ATMs found for this bank.</li>";
      return;
    }

    filtered.slice(0, 10).forEach(atm => {
      const li = document.createElement("li");
      const mapUrl = `https://www.google.com/maps?q=${atm.lat},${atm.lon}`;
      const cards = getCardBadges(atm.operator);

      li.innerHTML = `
        <strong>${atm.name || "ATM"}</strong><br>
        <span class="atm-distance">${atm.distance_m} meters away</span><br>
        <span class="atm-cards">${cards}</span><br>
        <a href="${mapUrl}" target="_blank" rel="noopener">📍 View on Map</a>
      `;
      atmList.appendChild(li);
    });

    // Disclaimer (once)
    if (!document.querySelector(".atm-disclaimer")) {
      const note = document.createElement("p");
      note.className = "atm-disclaimer";
      note.innerText =
        "Card network support is indicative and may vary by ATM. Please verify at the ATM.";
      atmSection.appendChild(note);
    }
  };

  const loadATMs = () => {
    fetch(`/data/atm_pin/${pin}.json`)
      .then(res => {
        if (!res.ok) throw new Error("No ATM data");
        return res.json();
      })
      .then(atms => {
        allATMs = atms || [];
        renderATMs("all");
      })
      .catch(() => {
        atmList.innerHTML =
          "<li>ATM information unavailable for this area.</li>";
      });
  };

  filterBar.addEventListener("click", e => {
    if (e.target.tagName !== "BUTTON") return;
    filterBar.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    renderATMs(e.target.dataset.bank);
  });

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadATMs();
      observer.disconnect();
    }
  });

  observer.observe(atmSection);
});
