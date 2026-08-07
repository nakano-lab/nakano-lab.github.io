(function () {
  const storageKey = "nakano-lab-site-language";
  const root = document.documentElement;
  const pageLanguage = root.lang === "en" ? "en" : "ja";

  try {
    localStorage.setItem(storageKey, pageLanguage);
  } catch (_) {
    // The site remains fully usable when storage is unavailable.
  }

  document.querySelectorAll("[data-language-link]").forEach((link) => {
    link.addEventListener("click", () => {
      try {
        localStorage.setItem(storageKey, link.dataset.languageLink);
      } catch (_) {}
    });
  });

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 10);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach((element) => observer.observe(element));
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
})();
