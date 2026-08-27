/* =====================================================================
   CONTAINER SCROLL — script
   Requer GSAP + ScrollTrigger carregados antes deste arquivo.
===================================================================== */
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1) Efeito completo (seção Sobre) via GSAP ScrollTrigger ---------- */
  function initContainerScroll() {
    const wrap = document.querySelector(".container-scroll-wrap");
    const header = document.querySelector(".container-scroll-header");
    const card = document.querySelector(".container-scroll-card");
    if (!wrap || !header || !card || typeof gsap === "undefined") return;

    if (prefersReduced) return; // mantém estado final estático (definido no CSS/HTML)

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth <= 768;
    const startScale = isMobile ? 0.7 : 1.05;

    gsap.set(card, { rotationX: 20, scale: startScale, transformOrigin: "center top" });
    gsap.set(header, { y: 0 });

    ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress; // 0 -> 1
        gsap.set(card, { rotationX: 20 - 20 * p, scale: startScale + (1 - startScale) * p });
        gsap.set(header, { y: -100 * p });
      },
    });
  }

  /* ---------- 2) Reveal leve para diferenciais e depoimentos ---------- */
  function initTiltReveal() {
    const targets = document.querySelectorAll(".tilt-reveal");
    if (!targets.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initContainerScroll();
    initTiltReveal();
  });
})();
