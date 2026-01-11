document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("areaInput");
  const resultsBox = document.getElementById("areaResults");

  if (!input || !resultsBox) return;

  fetch("/data/area_pin_index.json")
    .then(res => res.json())
    .then(data => {

      input.addEventListener("input", function () {
        const q = this.value.trim().toLowerCase();
        resultsBox.innerHTML = "";

        if (q.length < 2) {
          resultsBox.style.display = "none";
          return;
        }

        let shown = 0;

        for (const area in data) {
          if (area.includes(q)) {
            data[area].forEach(obj => {
              if (shown >= 8) return;

              const div = document.createElement("div");
              div.innerHTML = `<strong>${area}</strong> — ${obj.pin}`;
              div.onclick = () => {
                window.location.href = `/pincode/${obj.pin}.html`;
              };

              resultsBox.appendChild(div);
              shown++;
            });
          }
        }

        resultsBox.style.display = shown ? "block" : "none";
      });

      document.addEventListener("click", e => {
        if (!e.target.closest(".search-group")) {
          resultsBox.style.display = "none";
        }
      });

    })
    .catch(err => console.error("Area PIN index failed", err));
});

// ===============================
// 📍 USE MY LOCATION (STEP 3.2)
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const locationBtn = document.getElementById("useLocationBtn");

  if (!locationBtn) return;

  locationBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    locationBtn.disabled = true;
    locationBtn.innerText = "Detecting location...";

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Redirect to Google Maps search near user
        window.location.href =
          `https://www.google.com/maps/search/bank+near+me/@${lat},${lon},15z`;
      },
      error => {
        alert("Unable to access your location. Please allow location access.");
        locationBtn.disabled = false;
        locationBtn.innerText = "📍 Just Use My Location";
      }
    );
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const locationBtn = document.getElementById("useLocationBtn");

  if (!locationBtn) return;

  let resetTimer = null;

  locationBtn.addEventListener("click", function () {
    // Change button text immediately
    locationBtn.innerText = "📍 Detecting Location...";
    locationBtn.disabled = true;

    // Clear any previous timer
    if (resetTimer) clearTimeout(resetTimer);

    // FORCE reset after 30 seconds (MANDATORY)
    resetTimer = setTimeout(() => {
      locationBtn.innerText = "📍 Just Use My Location";
      locationBtn.disabled = false;
    }, 15000);
  });
});
