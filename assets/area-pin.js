document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("areaInput");
  const resultsBox = document.getElementById("areaResults");

  if (!input || !resultsBox) return;

  fetch("/data/area_pin_index.json")
    .then(res => res.json())
    .then(data => {
      // data is an OBJECT, not array
      const entries = Object.entries(data); // [ [area, [pins]], ... ]

      input.addEventListener("input", function () {
        const query = input.value.trim().toLowerCase();
        resultsBox.innerHTML = "";

        if (query.length < 2) {
          resultsBox.style.display = "none";
          return;
        }

        let shown = 0;

        for (const [area, pins] of entries) {
          if (area.includes(query)) {
            pins.forEach(pin => {
              if (shown >= 10) return;

              const div = document.createElement("div");
              div.innerHTML = `<strong>${area}</strong> — ${pin}`;

              div.addEventListener("click", () => {
                window.location.href = `/pincode/${pin}.html`;
              });

              resultsBox.appendChild(div);
              shown++;
            });
          }
        }

        resultsBox.style.display = shown ? "block" : "none";
      });
    })
    .catch(err => {
      console.error("Area → PIN index load failed", err);
    });
});
