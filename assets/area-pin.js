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
