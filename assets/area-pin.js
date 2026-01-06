document.addEventListener("DOMContentLoaded", () => {
  const areaInput = document.querySelector(".area-pin-input");
  if (!areaInput) return;

  const pinInput = document.querySelector(
    'input[placeholder="Enter 6-digit PIN Code"]'
  );

  const resultBox = document.createElement("div");
  resultBox.className = "area-pin-results";
  areaInput.parentNode.appendChild(resultBox);

  let areaIndex = null;

  // Load area → PIN index lazily
  fetch("/data/area_pin_index.json")
    .then(res => res.json())
    .then(data => {
      areaIndex = data;
    })
    .catch(() => {
      console.warn("Area-PIN index failed to load");
    });

  areaInput.addEventListener("input", () => {
    const query = areaInput.value.trim().toLowerCase();
    resultBox.innerHTML = "";

    if (!query || !areaIndex) return;

    const matches = Object.keys(areaIndex)
      .filter(area => area.includes(query))
      .slice(0, 8);

    matches.forEach(area => {
      areaIndex[area].forEach(pin => {
        const item = document.createElement("div");
        item.className = "area-pin-item";
        item.textContent = `${area.toUpperCase()} – ${pin}`;

        item.addEventListener("click", () => {
          // STEP 4.1 CORE LOGIC
          if (pinInput) {
            pinInput.value = pin;
          }
          window.location.href = `/pincode/${pin}.html`;
        });

        resultBox.appendChild(item);
      });
    });
  });

  document.addEventListener("click", e => {
    if (!areaInput.contains(e.target)) {
      resultBox.innerHTML = "";
    }
  });
});
