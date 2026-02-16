/**
 * KrushiAI Main JavaScript
 * Handles navigation, smooth scrolling, and UI interactions.
 */

// ============================
// DOM Elements
// ============================
const menu = document.querySelector("#menu-btn");
const navbar = document.querySelector(".navbar");
const scrollTopBtn = document.getElementById("scroll-top-btn");

// ============================
// Mobile Menu Toggle
// ============================
if (menu && navbar) {
  menu.onclick = () => {
    menu.classList.toggle("fa-times");
    navbar.classList.toggle("active");
  };
}

// ============================
// Scroll Event Handler
// ============================
window.onscroll = () => {
  // Close mobile menu when scrolling
  if (menu && navbar) {
    menu.classList.remove("fa-times");
    navbar.classList.remove("active");
  }

  // Show/hide scroll-to-top button
  if (scrollTopBtn) {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  }

  // Header shadow on scroll
  const header = document.querySelector(".header");
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
};

// ============================
// Scroll to Top Button
// ============================
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ============================
// Smooth Scroll for Nav Links
// ============================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href && href !== "#") {
      e.preventDefault();
      const targetElement = document.querySelector(href);

      if (targetElement) {
        const headerHeight = 80;
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight,
          behavior: "smooth",
        });
      }
    }
  });
});

// ============================
// Active Nav Link Highlighting
// ============================
function highlightNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.navbar a[href^="#"]');

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active-link");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active-link");
    }
  });
}

window.addEventListener("scroll", highlightNavLink);

// ============================
// Intersection Observer for Animations
// ============================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".animate-on-scroll").forEach((el) => {
  observer.observe(el);
});
