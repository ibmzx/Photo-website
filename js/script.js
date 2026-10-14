/**
 * Alex Vance Photography - Interactive Features & Lightbox EXIF
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Navigation Scroll Effect & Active Links
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link update based on scroll position
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);

  /* --------------------------------------------------------------------------
     2. Mobile Navigation Drawer Toggle
     -------------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const menuBackdrop = document.getElementById('menu-backdrop');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuBackdrop.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    menuBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);
  menuBackdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* --------------------------------------------------------------------------
     3. Photo Category Filtering
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     4. Lightbox Photo Modal with EXIF Data & Prev/Next Navigation
     -------------------------------------------------------------------------- */
  const modal = document.getElementById('project-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const exifCamera = document.getElementById('exif-camera');
  const exifLens = document.getElementById('exif-lens');
  const exifSettings = document.getElementById('exif-settings');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentPhotoIndex = 0;
  const visibleCards = () => Array.from(portfolioCards).filter(c => c.style.display !== 'none');

  const updateModalContent = (card) => {
    const imgSrc = card.querySelector('.portfolio-img').getAttribute('src');
    const category = card.getAttribute('data-category');
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-description');
    const camera = card.getAttribute('data-exif-camera');
    const lens = card.getAttribute('data-exif-lens');
    const settings = card.getAttribute('data-exif-settings');

    modalImg.setAttribute('src', imgSrc);
    modalImg.setAttribute('alt', title);
    modalCategory.textContent = category;
    modalTitle.textContent = title;
    modalDescription.textContent = desc;
    exifCamera.textContent = camera || 'Sony a6400';
    exifLens.textContent = lens || 'Sony 16-55mm f/2.8 G';
    exifSettings.textContent = settings || 'f/2.8 | ISO 100';
  };

  const openLightbox = (cardIndex) => {
    const list = visibleCards();
    if (list.length === 0) return;
    currentPhotoIndex = cardIndex;
    updateModalContent(list[currentPhotoIndex]);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  portfolioCards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      const list = visibleCards();
      const cardIdx = list.indexOf(card);
      openLightbox(cardIdx !== -1 ? cardIdx : 0);
    });
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const list = visibleCards();
    currentPhotoIndex = (currentPhotoIndex - 1 + list.length) % list.length;
    updateModalContent(list[currentPhotoIndex]);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const list = visibleCards();
    currentPhotoIndex = (currentPhotoIndex + 1) % list.length;
    updateModalContent(list[currentPhotoIndex]);
  });

  modalClose.addEventListener('click', closeLightbox);
  modalBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  /* --------------------------------------------------------------------------
     5. Photoshoot Booking Form Handling
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  const showToast = (message) => {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('#submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showToast('Thank you! Your photoshoot booking inquiry has been sent.');
      }, 1200);
    });
  }

});