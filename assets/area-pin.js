document.addEventListener("DOMContentLoaded", async function () {
  const input = document.getElementById("areaInput");
  const resultsBox = document.getElementById("areaResults");

  if (!input || !resultsBox) return;

  let areaData = {};

  try {
    const res = await fetch("/data/area_pin_index.json");
    areaData = await res.json();
  } catch (e) {
    console.error("Failed to load area PIN index", e);
    return;
  }

  input.addEventListener("input", function () {
    const query = input.value.trim().toLowerCase();
    resultsBox.innerHTML = "";

    if (query.length < 2) {
      resultsBox.style.display = "none";
      return;
    }

    let matches = Object.keys(areaData).filter(area =>
      area.includes(query)
    );

    if (matches.length === 0) {
      resultsBox.style.display = "none";
      return;
    }

    matches.slice(0, 10).forEach(area => {
      const pin = areaData[area][0]?.pin || "";

      const div = document.createElement("div");
      div.innerHTML = `<strong>${area}</strong> — PIN ${pin}`;

      div.onclick = () => {
        input.value = area;
        resultsBox.style.display = "none";
        window.location.href = `/pincode/${pin}.html`;
      };

      resultsBox.appendChild(div);
    });

    resultsBox.style.display = "block";
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-group")) {
      resultsBox.style.display = "none";
    }
  });
});
