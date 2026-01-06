document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("areaInput");
  const resultsBox = document.getElementById("areaResults");

  if (!input || !resultsBox) return;

  let areaIndex = {};

  fetch("/data/area_pin_index.json")
    .then(res => res.json())
    .then(data => {
      areaIndex = data;
    });

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase().trim();
    resultsBox.innerHTML = "";

    if (query.length < 3) return;

    let shown = 0;

    for (const area in areaIndex) {
      if (!area.includes(query)) continue;

      areaIndex[area].forEach(item => {
        if (shown >= 10) return;

        const div = document.createElement("div");
        div.className = "area-result";
        div.innerHTML = `
          <strong>${area.toUpperCase()}</strong><br>
          PIN: ${item.pin}, ${item.district}, ${item.state}
        `;

        div.onclick = () => {
          window.location.href = `/pincode/${item.pin}.html`;
        };

        resultsBox.appendChild(div);
        shown++;
      });

      if (shown >= 10) break;
    }
  });
});
