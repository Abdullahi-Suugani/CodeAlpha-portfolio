const loader = document.querySelector(".loader");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const backToTop = document.getElementById("backToTop");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const typingText = document.getElementById("typingText");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const year = document.getElementById("year");

const titles = ["Computer Science Student", "Frontend Developer"];
let titleIndex = 0;
let charIndex = 0;
let deleting = false;

window.addEventListener("load", () => {
  loader.classList.add("hidden");
});

year.textContent = new Date().getFullYear();

function typeHeroTitle() {
  const current = titles[titleIndex];
  typingText.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeHeroTitle, 75);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeHeroTitle, 1400);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeHeroTitle, 42);
    return;
  }

  deleting = false;
  titleIndex = (titleIndex + 1) % titles.length;
  setTimeout(typeHeroTitle, 250);
}

typeHeroTitle();

hamburger.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideNav =
    navMenu.contains(event.target) || hamburger.contains(event.target);
  if (!clickedInsideNav && navMenu.classList.contains("open")) {
    navMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }
});

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeIcon.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  themeIcon.textContent = isLight ? "☀" : "☾";
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((item) => revealObserver.observe(item));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".skill-bar").forEach((bar) => {
          const level = bar.dataset.level;
          bar.querySelector("em").style.width = `${level}%`;
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

const skillGroup = document.querySelector(".skill-group");
if (skillGroup) skillObserver.observe(skillGroup);

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll("[data-count]").forEach((stat) => {
        const target = Number(stat.dataset.count);
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 45));

        const updateCount = () => {
          current += increment;
          if (current >= target) {
            stat.textContent = target === 100 ? "100%" : target;
            return;
          }
          stat.textContent = current;
          requestAnimationFrame(updateCount);
        };

        updateCount();
      });

      statObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.35 },
);

const statsGrid = document.querySelector(".stats-grid");
if (statsGrid) statObserver.observe(statsGrid);

function updateActiveNav() {
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });

  backToTop.classList.toggle("show", window.scrollY > 520);
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.dataset.category;
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("hide", !shouldShow);
    });
  });
});

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();

    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

function setError(input, message) {
  const row = input.closest(".form-row");
  row.querySelector(".error").textContent = message;
  input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
  const row = input.closest(".form-row");
  row.querySelector(".error").textContent = "";
  input.removeAttribute("aria-invalid");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let valid = true;
  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const subject = contactForm.elements.subject;
  const message = contactForm.elements.message;

  [name, email, subject, message].forEach(clearError);
  formStatus.textContent = "";

  if (name.value.trim().length < 2) {
    setError(name, "Please enter your name.");
    valid = false;
  }

  if (!validateEmail(email.value.trim())) {
    setError(email, "Please enter a valid email address.");
    valid = false;
  }

  if (subject.value.trim().length < 3) {
    setError(subject, "Please enter a subject.");
    valid = false;
  }

  if (message.value.trim().length < 10) {
    setError(message, "Please write a message of at least 10 characters.");
    valid = false;
  }

  if (!valid) return;

  formStatus.textContent =
    "Message ready to send. Connect this form to your preferred backend or email service.";
  contactForm.reset();
});
