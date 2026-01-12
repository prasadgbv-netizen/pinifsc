document.addEventListener("DOMContentLoaded", () => {
  const atmSection = document.querySelector(".atm-section");
  if (!atmSection) return;

  const pin = atmSection.dataset.pin;
  const atmList = document.getElementById("atm-list");

  let allATMs = [];

  const getCardBadges = operator => {
    const op = (operator || "").toLowerCase();
    if (op.includes("sbi") || op.includes("state bank")) return "💳 RuPay • Visa";
    if (op.includes("hdfc") || op.includes("icici") || op.includes("axis"))
      return "💳 Visa • MasterCard";
    if (
      op.includes("punjab") ||
      op.includes("canara") ||
      op.includes("bank of india")
    )
      return "💳 RuPay • Visa";
    return "💳 Visa";
  };

  const groupByBank = atms => {
    const groups = {};
    atms.forEach(atm => {
      const bank = atm.operator || "Other Banks";
      if (!groups[bank]) groups[bank] = [];
      groups[bank].push(atm);
    });
    return groups;
  };

  const renderGroupedATMs = () => {
    atmList.innerHTML = "";

    const groups = groupByBank(allATMs);

    Object.entries(groups).forEach(([bank, atms]) => {
      const wrapper = document.createElement("li");
      wrapper.className = "atm-group";

      const header = document.createElement("div");
      header.className = "atm-group-header";
      header.innerHTML = `
        ▶ <strong>${bank}</strong> (${atms.length})
      `;

      const list = document.createElement("ul");
      list.className = "atm-sublist";
      list.style.display = "none";

      atms.slice(0, 10).forEach(atm => {
        const li = document.createElement("li");

        /* ===== STEP 1: HUMAN-READABLE MAP QUERY (ADDED) ===== */
        const mapQuery = `${atm.name || "ATM"}, ${atm.area || ""}, ${pin}, India`;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
        /* ================================================== */

        const cards = getCardBadges(atm.operator);

        li.innerHTML = `
          <strong>${atm.name || "ATM"}</strong><br>
          <span class="atm-distance">${atm.distance_m} meters away</span><br>
          <span class="atm-cards">${cards}</span><br>
          <a href="${mapUrl}" target="_blank" rel="noopener noreferrer">📍 View on Map</a>
        `;
        list.appendChild(li);
      });

      header.addEventListener("click", () => {
        const open = list.style.display === "block";
        list.style.display = open ? "none" : "block";
        header.innerHTML = `${open ? "▶" : "▼"} <strong>${bank}</strong> (${atms.length})`;
      });

      wrapper.appendChild(header);
      wrapper.appendChild(list);
      atmList.appendChild(wrapper);
    });

    if (!document.querySelector(".atm-disclaimer")) {
      const note = document.createElement("p");
      note.className = "atm-disclaimer";
      note.innerText =
        "ATM data is indicative based on public map sources. Availability and services may vary.";
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
        renderGroupedATMs();
      })
      .catch(() => {
        atmList.innerHTML =
          "<li>ATM information unavailable for this area.</li>";
      });
  };

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadATMs();
      observer.disconnect();
    }
  });

  observer.observe(atmSection);
});

// ===============================
// COPY IFSC / MICR FUNCTIONALITY
// ===============================
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;

  const value = btn.dataset.copy;
  if (!value) return;

  navigator.clipboard.writeText(value).then(() => {
    const originalText = btn.innerHTML;

    btn.innerHTML = "✅ Copied";
    btn.classList.add("copied");

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove("copied");
    }, 1500);
  });
});

