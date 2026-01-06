document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector(".search-box input");
  const button = document.querySelector(".search-box button");

  // ✅ SAFETY WRAP (prevents JS crash on pages without search box)
  if (!input || !button) return;

  button.addEventListener("click", function () {
    const pin = input.value.trim();

    if (!/^\d{6}$/.test(pin)) {
      alert("Please enter a valid 6-digit PIN code");
      return;
    }

    // RELATIVE path (works locally & online)
    window.location.href = `pincode/${pin}.html`;
  });
});
