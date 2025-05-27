document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.mySwiper', {
    slidesPerView: 'auto',
    centeredSlides: false,
    spaceBetween: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap-size')),
    loop: false,
    speed: 4000,
    autoplay: {
      delay: 0,
      disableOnInteraction: true,
      reverseDirection: false,
      pauseOnMouseEnter: true
    },
    freeMode: {
      enabled: true,
      momentum: false,
      sticky: false
    },
    grabCursor: true,
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    },
    on: {
      init() {
        this.autoplay.start();
      },
      reachEnd() {
        this.autoplay.stop();
        setTimeout(() => {
          this.params.autoplay.reverseDirection = true;
          this.autoplay.start();
        }, 100);
      },
      reachBeginning() {
        this.autoplay.stop();
        setTimeout(() => {
          this.params.autoplay.reverseDirection = false;
          this.autoplay.start();
        }, 100);
      }
    }
  });

  // نظام التحكم بالحركة
  let isReversed = false;
  const toggleDirection = () => {
    isReversed = !isReversed;
    swiper.params.autoplay.reverseDirection = isReversed;
    swiper.autoplay.start();
  };

  // مراقبة الوصول للنهاية أو البداية
  swiper.on('reachEnd', toggleDirection);
  swiper.on('reachBeginning', toggleDirection);
});
