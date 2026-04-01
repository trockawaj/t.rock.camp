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

  // --- Web3Forms AJAX Submission Logic ---
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const successMessage = document.getElementById('successMessage');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Stop standard form submission to prevent refresh/redirect

      // Change button state to loading
      submitBtn.disabled = true;
      const originalText = submitBtnText.textContent;
      submitBtnText.innerHTML = '<span class="loading-spinner"></span> 送信中...';
      submitBtn.classList.add('loading');

      const formData = new FormData(contactForm);
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          // Success Path
          contactForm.reset();
          submitBtnText.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          
          // Show success animation overlay
          successMessage.classList.add('active');
          setTimeout(() => {
            successMessage.classList.remove('active');
          }, 5000); // Hide after 5 seconds
        } else {
          throw new Error('Web3Forms returned unsuccessful response');
        }
      } catch (err) {
        // Error Path
        console.error('Mail Sending Error:', err);
        alert('通信エラーが発生しました。時間を置いて再度お試しください。');
        submitBtnText.textContent = '送信失敗';
        setTimeout(() => {
          submitBtnText.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
        }, 3000);
      }
    });
  }
});
