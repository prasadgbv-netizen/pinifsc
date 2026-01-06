document.addEventListener("DOMContentLoaded", async function () {
  const input = document.getElementById("areaInput");
  const resultsBox = document.getElementById("areaResults");

  if (!input || !resultsBox) {
    console.warn("Area search elements not found");
    return;
  }

  let areaIndex = {};

  try {
    const res = await fetch("/data/area_pin_index.json");
    areaIndex = await res.json();
  } catch (e) {
    console.error("Failed to load area_pin_index.json", e);
    return;
  }

  input.addEventListener("input", function () {
    const query = input.value.trim().toLowerCase();
    resultsBox.innerHTML = "";
    resultsBox.style.display = "none";

    if (query.length < 2) return;

    let count = 0;
    for (const area in areaIndex) {
      if (area.includes(query)) {
        const pin = areaIndex[area];
        const div = document.createElement("div");
        div.innerHTML = `<strong>${area}</strong> – ${pin}`;
        div.addEventListener("click", () => {
          window.location.href = `/pincode/${pin}.html`;
        });
        resultsBox.appendChild(div);
        count++;
      }
      if (count >= 10) break;
    }

    if (count > 0) {
      resultsBox.style.display = "block";
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".area-search-box")) {
      resultsBox.style.display = "none";
    }
  });
});
