/**
 * Alex Vance Portfolio - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Navigation & Mobile Menu Functionality
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar Blur on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle Mobile Menu
  const toggleMobileMenu = () => {
    const isOpen = hamburger.classList.contains('active');
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');

    hamburger.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Active Nav Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');

  const highlightActiveSection = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach(l => l.classList.add('active'));
      } else {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach(l => l.classList.remove('active'));
      }
    });
  };

  window.addEventListener('scroll', highlightActiveSection);

  // --------------------------------------------------------------------------
  // 2. Scroll Reveal Animations (Intersection Observer)
  // --------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-in');

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(element => {
    revealOnScroll.observe(element);
  });

  // --------------------------------------------------------------------------
  // 3. Portfolio Dynamic Category Filter
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. Lightbox Modal Popup Logic
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalTags = document.getElementById('modal-tags');
  const modalDemoBtn = document.getElementById('modal-demo-btn');
  const modalGithubBtn = document.getElementById('modal-github-btn');

  // Detailed Project Data Store
  const projectsData = {
    "1": {
      title: "Aura Analytics SaaS Platform",
      category: "Web App",
      image: "assets/projects/project1.svg",
      description: "A comprehensive real-time telemetry dashboard for monitoring cloud microservices, database metrics, and user analytics. Features customizable drag-and-drop dark mode widgets, live WebSocket streaming, and automated alerts.",
      tags: ["React", "TypeScript", "Node.js", "Chart.js", "Tailwind CSS", "WebSockets"],
      demoUrl: "https://example.com/demo/aura",
      githubUrl: "https://github.com/example/aura-analytics"
    },
    "2": {
      title: "CyberFit Mobile Fitness App",
      category: "Mobile App",
      image: "assets/projects/project2.svg",
      description: "Cross-platform iOS & Android workout app built with React Native. Includes interactive workout creation, social leaderboards, AI-powered form feedback, and neon haptic notifications.",
      tags: ["React Native", "Expo", "Redux Toolkit", "Firebase", "Node.js"],
      demoUrl: "https://example.com/demo/cyberfit",
      githubUrl: "https://github.com/example/cyberfit-app"
    },
    "3": {
      title: "Quantum AI Studio",
      category: "Web App",
      image: "assets/projects/project3.svg",
      description: "Next-gen prompt engineering workbench for developers to test, benchmark, and deploy custom AI agent workflows. Features interactive graph nodes, low-latency streaming responses, and integrated Python runtime.",
      tags: ["Next.js 14", "Python", "FastAPI", "PostgreSQL", "Tailwind CSS"],
      demoUrl: "https://example.com/demo/quantum-ai",
      githubUrl: "https://github.com/example/quantum-ai-studio"
    },
    "4": {
      title: "CyberLedger Web3 Portal",
      category: "UI/UX Design",
      image: "assets/projects/project4.svg",
      description: "A futuristic Web3 crypto asset dashboard and decentralized finance portal. Designed with deep dark mode aesthetics, vibrant purple accent glows, and seamless wallet connectivity UX.",
      tags: ["UI/UX Design", "Figma", "Design System", "Web3.js", "Ethers.js"],
      demoUrl: "https://example.com/demo/cyberledger",
      githubUrl: "https://github.com/example/cyberledger-web3"
    }
  };

  const openModal = (projectId) => {
    const data = projectsData[projectId];
    if (!data) return;

    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalDemoBtn.href = data.demoUrl;
    modalGithubBtn.href = data.githubUrl;

    // Render Tech Tags
    modalTags.innerHTML = data.tags.map(tag => `<span class="skill-tag"><i class="fa-solid fa-code"></i> ${tag}</span>`).join('');

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach Click Handlers to View Buttons and Cards
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      const projectId = card.getAttribute('data-project-id');
      openModal(projectId);
    });
  });

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      openModal(projectId);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close Modal on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 5. Contact Form Validation & Submission Handling
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      // Clear previous error states
      [nameInput, emailInput, messageInput].forEach(input => {
        input.closest('.form-group').classList.remove('error');
      });
      formResponse.className = 'form-response-banner';
      formResponse.style.display = 'none';

      // Name Validation
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Message Validation
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';

        // Simulate Async Server Request
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';

          formResponse.textContent = '🚀 Thank you! Your message has been received. I will get back to you shortly.';
          formResponse.classList.add('success');

          contactForm.reset();
        }, 1200);
      }
    });
  }
});
