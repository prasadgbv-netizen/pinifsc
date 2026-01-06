document.addEventListener("DOMContentLoaded", async function () {
  const input = document.getElementById("areaInput");
  const resultsBox = document.getElementById("areaResults");

  if (!input || !resultsBox) return;

  let areaData = {};

  try {
    const res = await fetch("/data/area_pin_index.json");
    areaData = await res.json();
  } catch (e) {
    console.error("Failed to load area_pin_index.json", e);
    return;
  }

  const areas = Object.keys(areaData);

  input.addEventListener("input", function () {
    const q = input.value.trim().toLowerCase();
    resultsBox.innerHTML = "";
    resultsBox.style.display = "none";

    if (q.length < 2) return;

    const matches = areas
      .filter(name => name.includes(q))
      .slice(0, 10);

    if (!matches.length) return;

    matches.forEach(area => {
      const item = areaData[area][0]; // first entry
      const pin = item.pin;

      const div = document.createElement("div");
      div.innerHTML = `<strong>${area}</strong> — ${pin}`;

      div.addEventListener("click", () => {
        window.location.href = `/pincode/${pin}.html`;
      });

      resultsBox.appendChild(div);
    });

    resultsBox.style.display = "block";
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".search-group")) {
      resultsBox.style.display = "none";
    }
  });
});
