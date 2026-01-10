document.addEventListener("DOMContentLoaded", function () {
  const pinInput = document.getElementById("pinInput");
  const pinBtn = document.getElementById("pinSearchBtn");

  if (!pinInput || !pinBtn) return;

  pinBtn.addEventListener("click", function () {
    const pin = pinInput.value.trim();

    if (!/^\d{6}$/.test(pin)) {
      alert("Please enter a valid 6-digit PIN code");
      return;
    }

    window.location.href = `/pincode/${pin}.html`;
  });
});
// 🔹 AUTO SEARCH WHEN 6-DIGIT PIN IS ENTERED
document.addEventListener("DOMContentLoaded", function () {
  const pinInput = document.getElementById("pinInput");
  const pinBtn = document.getElementById("pinSearchBtn");

  if (!pinInput || !pinBtn) return;

  pinInput.addEventListener("input", function () {
    if (/^\d{6}$/.test(this.value)) {
      pinBtn.click();
    }
  });
});
