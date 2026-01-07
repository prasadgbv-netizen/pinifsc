document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("areaInput");
  const resultsBox = document.getElementById("areaResults");

  if (!input || !resultsBox) {
    console.error("Missing areaInput or areaResults");
    return;
  }

  fetch("/data/area_pin_index.json")
    .then(res => res.json())
    .then(data => {

      input.addEventListener("input", function () {
        const q = this.value.trim().toLowerCase();
        resultsBox.innerHTML = "";
        resultsBox.style.display = "none";

        if (q.length < 2) return;

        let count = 0;

        for (const area in data) {
          if (!area.toLowerCase().includes(q)) continue;

          const pins = data[area];

          for (const obj of pins) {
            if (count >= 10) break;

            const div = document.createElement("div");
            div.innerHTML = `<strong>${area}</strong> — ${obj.pin}`;

            div.onclick = () => {
              window.location.href = `/pincode/${obj.pin}.html`;
            };

            resultsBox.appendChild(div);
            count++;
          }

          if (count >= 10) break;
        }

        if (count > 0) {
          resultsBox.style.display = "block";
        }
      });

      document.addEventListener("click", function (e) {
        if (!e.target.closest(".search-group")) {
          resultsBox.style.display = "none";
        }
      });
    })
    .catch(err => console.error("JSON load failed", err));
});
