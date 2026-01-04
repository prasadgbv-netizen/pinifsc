document.addEventListener("DOMContentLoaded", () => {
  const atmSection = document.querySelector(".atm-section");
  if (!atmSection) return;

  const pin = atmSection.dataset.pin;
  const atmList = document.getElementById("atm-list");

  // ---------- TRUST NOTE (added once) ----------
  const trustNote = document.createElement("p");
  trustNote.className = "atm-trust-note";
  trustNote.innerHTML = `
    ℹ️ ATM locations are sourced from public map data near PIN code ${pin}.
    Cash availability and working status may vary.
  `;
  atmSection.prepend(trustNote);

  const loadATMs = () => {
    fetch(`/data/atm_pin/${pin}.json`)
      .then(res => {
        if (!res.ok) throw new Error("No ATM data");
        return res.json();
      })
      .then(atms => {
        atmList.innerHTML = "";

        if (!atms.length) {
          atmList.innerHTML = "<li>No nearby ATMs found.</li>";
          return;
        }

        atms.slice(0, 10).forEach(atm => {
          const li = document.createElement("li");

          // ---------- ATM TYPE BADGE ----------
          const operator = (atm.operator || "").toLowerCase();
          const isBankATM = operator && operator !== "atm";

          const badge = isBankATM
            ? `<span class="atm-badge bank">🏦 Bank ATM</span>`
            : `<span class="atm-badge generic">🏧 ATM</span>`;

          // ---------- MAP LINK ----------
          const mapLink =
            atm.lat && atm.lon
              ? `<a href="https://www.google.com/maps?q=${atm.lat},${atm.lon}"
                   target="_blank" rel="noopener">
                   📍 View on Map
                 </a>`
              : "";

          li.innerHTML = `
            <strong>${atm.name || "ATM"}</strong><br>
            ${badge}<br>
            <span class="atm-distance">
              ${atm.distance_m} meters away
            </span><br>
            <small>📌 Listed based on proximity to PIN code ${pin}</small><br>
            ${mapLink}
          `;

          atmList.appendChild(li);
        });
      })
      .catch(() => {
        atmList.innerHTML =
          "<li>ATM information unavailable for this area.</li>";
      });
  };

  // ---------- LAZY LOAD ----------
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadATMs();
      observer.disconnect();
    }
  });

  observer.observe(atmSection);
});
