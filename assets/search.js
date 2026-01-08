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
