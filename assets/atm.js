document.addEventListener("DOMContentLoaded", () => {
  const atmSection = document.querySelector(".atm-section");
  if (!atmSection) return;

  const pin = atmSection.dataset.pin;
  const atmList = document.getElementById("atm-list");

  // Create filter UI
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

      li.innerHTML = `
        <strong>${atm.name || "ATM"}</strong><br>
        <span class="atm-distance">${atm.distance_m} meters away</span><br>
        <a href="${mapUrl}" target="_blank" rel="noopener">📍 View on Map</a>
      `;
      atmList.appendChild(li);
    });
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

  // Filter click handling
  filterBar.addEventListener("click", e => {
    if (e.target.tagName !== "BUTTON") return;

    filterBar.querySelectorAll("button").forEach(btn =>
      btn.classList.remove("active")
    );
    e.target.classList.add("active");

    const bank = e.target.dataset.bank;
    renderATMs(bank);
  });

  // Lazy load when visible
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadATMs();
      observer.disconnect();
    }
  });

  observer.observe(atmSection);
});
