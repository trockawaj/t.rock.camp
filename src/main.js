import './style.css';

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
});
