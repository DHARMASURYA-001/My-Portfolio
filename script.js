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
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

/**
 * Swiper configuration for project carousel
 */
const swiper = new Swiper('.swiper-container', {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 50,
    },
  },
});

/**
 * Typing animation configuration
 */
const text = "Backend Developer";
const typingElement = document.getElementById("typing-text");
let index = 0;
let isDeleting = false;

/**
 * Creates a typing/deleting animation effect
 */
function typeLoop() {
  if (!isDeleting && index <= text.length) {
    // Typing forward
    typingElement.innerHTML = text.substring(0, index);
    index++;
    setTimeout(typeLoop, 100);
  } else if (isDeleting && index >= 0) {
    // Deleting backwards
    typingElement.innerHTML = text.substring(0, index);
    index--;
    setTimeout(typeLoop, 50);
  } else {
    // Switch between typing and deleting
    isDeleting = !isDeleting;
    setTimeout(typeLoop, 1000); // Pause before typing/deleting again
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
  document.getElementById(tabId).classList.add("active");
  
  // Add active class to the clicked button
  document.querySelector(`.tab-btn[onclick*="${tabId}"]`).classList.add("active");
  
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
 * Handle form submission for the contact form
 * @param {Event} event - The form submission event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const formStatus = document.getElementById("form-status");
  formStatus.textContent = "Sending...";
  formStatus.className = "form-status";
  
  // EmailJS configuration
  const serviceID = 'service_j3k7z0v'; 
  const templateID = 'template_jroxk3f';
  const publicKey = 'w4fZMMRyJhf0p3xYr';
  
  const templateParams = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
    to_name: "Dharma Surya",
    reply_to: document.getElementById("email").value
  };
  
  emailjs.send(serviceID, templateID, templateParams, publicKey)
    .then(function(response) {
      console.log("SUCCESS!", response.status, response.text);
      formStatus.textContent = "Message sent successfully!";
      formStatus.className = "form-status success";
      document.getElementById("contact-form").reset();
      
      // Clear success message after 5 seconds
      setTimeout(function() {
        formStatus.textContent = "";
      }, 5000);
    }, function(error) {
      console.log("FAILED...", error);
      formStatus.textContent = "Failed to send message. Please try again.";
      formStatus.className = "form-status error";
    });
}

/**
 * Initialize site functionality when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", function() {
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
  }
});