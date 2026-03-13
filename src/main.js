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
});
