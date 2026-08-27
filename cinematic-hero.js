/* =====================================================================
   CINEMATIC HERO — script (GSAP + ScrollTrigger via CDN)
   Requer que os <script> do GSAP/ScrollTrigger sejam carregados ANTES
   deste arquivo (ver instruções de instalação).
===================================================================== */
(function () {
  if (typeof gsap === "undefined") {
    console.warn("[cinematic-hero] GSAP não encontrado — inclua o CDN antes deste script.");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const container = document.querySelector(".cinematic-hero");
  const mainCard = document.querySelector(".ch-main-card");
  const collectionPanel = document.querySelector(".ch-collection-panel");
  if (!container || !mainCard || !collectionPanel) return;

  /* --- Se o usuário prefere menos animação, apenas revela tudo --- */
  if (prefersReduced) {
    gsap.set(".gsap-reveal", { autoAlpha: 1, y: 0, scale: 1, filter: "none", clipPath: "none" });
    gsap.set(".ch-main-card", { width: "85vw", height: "85vh" });
    return;
  }

  /* --- Interação do mouse: brilho suave no card --- */
  let rafId;
  function handleMouseMove(e) {
    if (window.scrollY > window.innerHeight * 2) return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = mainCard.getBoundingClientRect();
      mainCard.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      mainCard.style.setProperty("--my", `${e.clientY - rect.top}px`);

    });
  }
  window.addEventListener("mousemove", handleMouseMove);

  /* --- Timeline cinematográfico --- */
  const isMobile = window.innerWidth < 768;

  gsap.set(".ch-line1", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)" });
  gsap.set(".ch-line2", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
  gsap.set(".ch-main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
  gsap.set([".ch-card-brand", ".ch-collection-panel"], { autoAlpha: 0 });

  const introTl = gsap.timeline({ delay: 0.2 });
  introTl
    .to(".ch-line1", { duration: 1.6, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "expo.out" })
    .to(".ch-line2", { duration: 1.2, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=0.9");

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: "+=4400",
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });

  scrollTl
    .to([".ch-text-wrapper", ".ch-grid"], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
    .to(".ch-main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
    .to(".ch-main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
    .fromTo(".ch-card-brand", { x: isMobile ? 0 : -60, y: isMobile ? -24 : 0, autoAlpha: 0 },
      { x: 0, y: 0, autoAlpha: 1, ease: "expo.out", duration: 1.4 }, "-=0.7")
    .fromTo(collectionPanel, { x: isMobile ? 0 : 60, y: isMobile ? 30 : 0, autoAlpha: 0 },
      { x: 0, y: 0, autoAlpha: 1, ease: "expo.out", duration: 1.6 }, "<+=0.2")
    .to({}, { duration: 2.4 })
    .to([".ch-card-brand", ".ch-collection-panel"], {
      scale: 0.94, y: -35, autoAlpha: 0, ease: "power3.in", duration: 1, stagger: 0.08,
    })
    .to(".ch-main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.3 });
})();
