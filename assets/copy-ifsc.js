document.addEventListener("click", function (e) {
  const btn = e.target.closest(".copy-ifsc-btn");
  if (!btn) return;

  const ifsc = btn.dataset.ifsc;
  if (!ifsc) return;

  navigator.clipboard.writeText(ifsc).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = "✅ Copied";
    btn.classList.add("copied");

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove("copied");
    }, 1500);
  });
});

document.addEventListener("click", function (e) {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;

  const value = btn.dataset.copy;
  if (!value) return;

  navigator.clipboard.writeText(value).then(() => {
    const original = btn.innerHTML;

    btn.innerHTML = "✅ Copied";
    btn.classList.add("copied");

    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove("copied");
    }, 1500);
  });
});
