import './style.css';
import { inject } from '@vercel/analytics';

inject();

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scrollContainer');

  // 横スクロールロジック
  scrollContainer.addEventListener('wheel', (evt) => {
    // 縦スクロールを横スクロールに変換
    evt.preventDefault();
    scrollContainer.scrollBy({
      left: evt.deltaY * 1.5,
      behavior: 'auto'
    });
  }, { passive: false });

  // Intersection Observer による要素のフェードイン・アニメーション
  const observerOptions = {
    root: scrollContainer,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Gallery Vertical Slider Logic
  const gUp = document.getElementById('gUp');
  const gDown = document.getElementById('gDown');
  const gallerySlider = document.getElementById('gallerySlider');
  let currentSlide = 0;
  const totalSlides = 8;

  if (gUp && gDown && gallerySlider) {
    gUp.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        gallerySlider.style.transform = `translateY(-${currentSlide * 100}vh)`;
      }
    });
    gDown.addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        gallerySlider.style.transform = `translateY(-${currentSlide * 100}vh)`;
      }
    });
  }

  // Hamburger Menu Logic
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('nav-links');
  if (hamburger && navLinksList) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksList.classList.toggle('active');
    });
    navLinksList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksList.classList.remove('active');
      });
    });
  }

  // Mobile / PC Contact & Access Separation Logic
  const mobileBreakpoint = window.matchMedia("(max-width: 900px)");
  const accessPanelMobile = document.createElement('section');
  accessPanelMobile.id = 'access';
  accessPanelMobile.className = 'panel concrete-bg';
  const accessPanelInner = document.createElement('div');
  accessPanelInner.className = 'panel-inner flex-center';
  accessPanelMobile.appendChild(accessPanelInner);
  
  function updateContactLayout(e) {
    const contactWrapper = document.querySelector('.contact-access-wrapper');
    const accessCol = document.querySelector('.access-col');
    const scrollContainer = document.getElementById('scrollContainer');
    
    if (e.matches) {
      if (accessCol && scrollContainer && contactWrapper) {
        accessPanelInner.appendChild(accessCol);
        const contactPanel = document.getElementById('contact');
        if (contactPanel) {
            scrollContainer.insertBefore(accessPanelMobile, contactPanel.nextSibling);
        }
      }
    } else {
      if (accessCol && contactWrapper) {
        contactWrapper.appendChild(accessCol);
        if (accessPanelMobile.parentNode) {
          accessPanelMobile.parentNode.removeChild(accessPanelMobile);
        }
      }
    }
  }
  
  updateContactLayout(mobileBreakpoint);
  mobileBreakpoint.addEventListener('change', updateContactLayout);
});
