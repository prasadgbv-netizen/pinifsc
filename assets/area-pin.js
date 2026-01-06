document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("areaInput");
  const resultsBox = document.getElementById("areaResults");

  if (!input || !resultsBox) return;

  let areas = [];

  fetch("/data/area_pin_index.json")
    .then(r => r.json())
    .then(d => areas = d)
    .catch(err => console.error("Area PIN index load failed", err));

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    resultsBox.innerHTML = "";
    resultsBox.style.display = "none";

    if (q.length < 3) return;

    const matches = areas
      .filter(a =>
        a.area.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q)
      )
      .slice(0, 10);

    if (!matches.length) {
      resultsBox.innerHTML = `<div>No results found</div>`;
      resultsBox.style.display = "block";
      return;
    }

    matches.forEach(a => {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${a.area}</strong>,
        ${a.district}, ${a.state}
        <br><small>PIN: ${a.pin}</small>
      `;
      div.onclick = () => {
        window.location.href = `/pincode/${a.pin}.html`;
      };
      resultsBox.appendChild(div);
    });

    resultsBox.style.display = "block";
  });

  document.addEventListener("click", e => {
    if (!resultsBox.contains(e.target) && e.target !== input) {
      resultsBox.style.display = "none";
    }
  });
});
