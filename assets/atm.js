document.addEventListener("DOMContentLoaded", () => {
  const atmSection = document.querySelector(".atm-section");
  if (!atmSection) return;

  const pin = atmSection.dataset.pin;
  const atmList = document.getElementById("atm-list");

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
          li.innerHTML = `
            <strong>${atm.name || "ATM"}</strong><br>
            <span class="atm-distance">
              ${atm.distance_m} meters away
            </span><br>
            <a href="https://www.google.com/maps?q=${atm.lat},${atm.lon}"
               target="_blank"
               rel="noopener"
               class="atm-map-link">
               📍 View on Map
            </a>
          `;
          atmList.appendChild(li);
        });
      })
      .catch(() => {
        atmList.innerHTML =
          "<li>ATM information unavailable for this area.</li>";
      });
  };

  // Lazy load when visible
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadATMs();
      observer.disconnect();
    }
  });

  observer.observe(atmSection);
});
