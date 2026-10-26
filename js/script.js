/* ==========================================================================
   PORTFOLIO SCRIPT
   Organized into small, independent functions — each wired up in init().
   ========================================================================== */

document.addEventListener("DOMContentLoaded", init);

function init() {
  setYear();
  setupThemeToggle();
  setupMobileNav();
  setupScrollProgress();
  setupActiveNavLink();
  setupScrollReveal();
  setupSkillBars();
  setupContactForm();
}

/* --------------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------------- */
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   Dark / light theme toggle — remembers preference in localStorage
   EDIT HERE: Update navigation items in the "navLinks" markup in index.html;
   this function only handles the toggle button behavior.
   -------------------------------------------------------------------------- */
function setupThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const stored = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
  });
}

/* --------------------------------------------------------------------------
   Mobile nav toggle
   -------------------------------------------------------------------------- */
function setupMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll progress bar
   -------------------------------------------------------------------------- */
function setupScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + "%";
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   Highlight the active nav link based on which section is in view
   -------------------------------------------------------------------------- */
function setupActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link");
  if (!sections.length || !links.length) return;

  const map = new Map();
  links.forEach((link) => map.set(link.getAttribute("href").replace("#", ""), link));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   Fade-up scroll reveal for elements with [data-reveal]
   -------------------------------------------------------------------------- */
function setupScrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Animate skill progress bars once they scroll into view
   -------------------------------------------------------------------------- */
function setupSkillBars() {
  const bars = document.querySelectorAll(".bar-fill");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const value = target.getAttribute("data-fill") || "0";
          target.style.width = value + "%";
          obs.unobserve(target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* --------------------------------------------------------------------------
   Contact form — front-end validation only.
   EDIT HERE: Wire this up to Formspree, EmailJS, or your own backend.
   -------------------------------------------------------------------------- */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (note) {
      note.textContent = "Thanks! This demo form doesn't send yet — connect it to Formspree or EmailJS to receive real messages.";
      note.style.color = "var(--signal)";
    }
    form.reset();
  });
}
