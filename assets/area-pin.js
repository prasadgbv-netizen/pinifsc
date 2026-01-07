document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("areaInput");
  const resultsBox = document.getElementById("areaResults");

  if (!input || !resultsBox) {
    console.error("areaInput or areaResults not found");
    return;
  }

  fetch("/data/area_pin_index.json")
    .then(response => response.json())
    .then(data => {

      input.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();

        resultsBox.innerHTML = "";
        resultsBox.style.display = "none";

        if (query.length < 2) return;

        let shown = 0;

        for (const area in data) {
          if (!data.hasOwnProperty(area)) continue;

          if (area.includes(query)) {
            data[area].forEach(entry => {
              if (shown >= 12) return;

              const pin = entry.pin;
              if (!pin) return;

              const div = document.createElement("div");
              div.innerHTML = `<strong>${area}</strong> — ${pin}`;

              div.addEventListener("click", () => {
                window.location.href = `/pincode/${pin}.html`;
              });

              resultsBox.appendChild(div);
              shown++;
            });
          }

          if (shown >= 12) break;
        }

        if (shown > 0) {
          resultsBox.style.display = "block";
        }
      });

      // Hide dropdown when clicking outside
      document.addEventListener("click", function (e) {
        if (!resultsBox.contains(e.target) && e.target !== input) {
          resultsBox.style.display = "none";
        }
      });

    })
    .catch(err => {
      console.error("Failed to load area_pin_index.json", err);
    });
});
