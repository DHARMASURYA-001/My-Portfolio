/**
 * Portfolio Website JavaScript
 * Contains functionality for menu toggle, typing animation, tab switching,
 * form handling, and initialization code.
 */

/**
 * Toggle the mobile menu visibility
 */
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const isOpening = !menu.classList.contains("open");

  menu.classList.toggle("open");
  icon.classList.toggle("open");

  if (isOpening) {
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add("menu-open");
    document.documentElement.classList.add("menu-open");
  } else {
    const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
    document.body.classList.remove("menu-open");
    document.documentElement.classList.remove("menu-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
  }
}


/**
 * Typing animation — cycles through multiple roles
 */
const typingRoles = [
  "Backend Developer",
  "Python Developer",
];
const typingElement = document.getElementById("typing-text");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentRole = typingRoles[roleIndex];

  if (!isDeleting) {
    typingElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      // Finished typing — pause then start deleting
      isDeleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
    setTimeout(typeLoop, 100);
  } else {
    typingElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      // Finished deleting — move to next role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % typingRoles.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 50);
  }
}

/**
 * Switch between tabs in the Education/Experience section
 * @param {string} tabId - ID of the tab to open
 */
function openTab(tabId) {
  // Hide all tab content
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => tab.classList.remove("active"));

  // Remove active class from all buttons
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));

  // Show the selected tab content
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) selectedTab.classList.add("active");

  // Add active class to the clicked button
  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  // Reset the animation
  const timelineInner = document.querySelector(`#${tabId} .timeline-inner`);
  if (timelineInner) {
    // Force reflow to restart animation
    timelineInner.style.animation = 'none';
    void timelineInner.offsetWidth; // Trigger reflow
    timelineInner.style.animation = 'scrollTimeline 20s linear infinite';
  }
}

/**
 * Validate a single field, show/clear inline error
 */
function validateField(input, errorId, validationFn) {
  const error = document.getElementById(errorId);
  const msg = validationFn(input.value.trim());
  if (msg) {
    error.textContent = msg;
    input.classList.add("invalid");
    input.classList.remove("valid");
    return false;
  }
  error.textContent = "";
  input.classList.remove("invalid");
  input.classList.add("valid");
  return true;
}

/**
 * Handle form submission with inline validation and loading spinner
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput    = document.getElementById("name");
  const emailInput   = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameOk = validateField(nameInput, "name-error",
    v => !v ? "Name is required." : v.length < 2 ? "Name is too short." : "");
  const emailOk = validateField(emailInput, "email-error",
    v => !v ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email." : "");
  const msgOk = validateField(messageInput, "message-error",
    v => !v ? "Message is required." : v.length < 10 ? "Message is too short." : "");

  if (!nameOk || !emailOk || !msgOk) return;

  // Show spinner, disable button
  const btn       = document.getElementById("submit-btn");
  const btnText   = document.getElementById("btn-text");
  const btnSpinner = document.getElementById("btn-spinner");
  const btnIcon   = document.getElementById("btn-icon");
  const formStatus = document.getElementById("form-status");

  btn.disabled = true;
  btnText.textContent = "Sending";
  btnSpinner.style.display = "inline-block";
  btnIcon.style.display = "none";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  const serviceID  = 'service_j3k7z0v';
  const templateID = 'template_jroxk3f';
  const publicKey  = 'w4fZMMRyJhf0p3xYr';

  emailjs.send(serviceID, templateID, {
    name:     nameInput.value,
    email:    emailInput.value,
    message:  messageInput.value,
    to_name:  "Dharma Surya",
    reply_to: emailInput.value
  }, publicKey)
    .then(() => {
      formStatus.textContent = "Message sent successfully!";
      formStatus.className = "form-status success";
      document.getElementById("contact-form").reset();
      [nameInput, emailInput, messageInput].forEach(el => el.classList.remove("valid", "invalid"));
      setTimeout(() => { formStatus.textContent = ""; }, 5000);
    })
    .catch(() => {
      formStatus.textContent = "Failed to send. Please try again.";
      formStatus.className = "form-status error";
    })
    .finally(() => {
      btn.disabled = false;
      btnText.textContent = "Send";
      btnSpinner.style.display = "none";
      btnIcon.style.display = "inline";
    });
}

/**
 * Initialize site functionality when DOM is loaded
 */
/**
 * Show/hide the back-to-top button based on scroll position
 */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });
}

/**
 * Animate skill bars when the skills section enters the viewport
 */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.style.width = target.dataset.width + "%";
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((bar) => observer.observe(bar));
}

/**
 * Fade-in / slide-in elements as they enter the viewport
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
}

/**
 * Update scroll progress bar width based on page scroll position
 */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
  });
}

/**
 * Highlight the nav link matching the section currently in view
 */
function initNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#desktop-nav .nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove("active-link");
            if (link.getAttribute("href") === `#${entry.target.id}`) {
              link.classList.add("active-link");
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Swiper carousel
  new Swiper('.swiper-container', {
    loop: true,
    loopedSlides: 5,
    speed: 700,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 16,
        centeredSlides: false,
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 16,
        centeredSlides: false,
      },
      900: {
        slidesPerView: 2,
        spaceBetween: 20,
        centeredSlides: true,
      },
      1100: {
        slidesPerView: 3,
        spaceBetween: 20,
        centeredSlides: true,
      },
    },
  });

  // Initialize skill bars
  initSkillBars();

  // Set footer year dynamically
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Auto-calculate years of experience from July 2024 start date
  const expEl = document.getElementById("years-experience");
  if (expEl) {
    const start = new Date(2024, 6, 1); // July 2024
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    expEl.textContent = remMonths >= 6 ? `${years}.5+` : `${years}+`;
  }

  // Initialize back to top button
  initBackToTop();

  // Initialize scroll reveal animations
  initScrollReveal();

  // Initialize scroll progress bar
  initScrollProgress();

  // Initialize active nav highlight
  initNavHighlight();

  // Initialize typing animation
  if (typingElement) {
    typeLoop();
  }

  // Initialize the default tab
  openTab('education');

  // Add event listener to the contact form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);

    // Live validation on blur
    document.getElementById("name").addEventListener("blur", () =>
      validateField(document.getElementById("name"), "name-error",
        v => !v ? "Name is required." : v.length < 2 ? "Name is too short." : ""));
    document.getElementById("email").addEventListener("blur", () =>
      validateField(document.getElementById("email"), "email-error",
        v => !v ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email." : ""));
    document.getElementById("message").addEventListener("blur", () =>
      validateField(document.getElementById("message"), "message-error",
        v => !v ? "Message is required." : v.length < 10 ? "Message is too short." : ""));
  }
});