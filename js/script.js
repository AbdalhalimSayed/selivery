// العناصر
const sliderTrack = document.getElementById("sliderTrack");
const dotsContainer = document.getElementById("dotsContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const items = document.querySelectorAll(".slider-item");

// المتغيرات
const itemWidth = 420; // 400px + 20px margin
let currentSlide = 0;
let startPosX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let isDragging = false;
let animationID;
let slideInterval;
let velocity = 0;
let lastTime = 0;
let lastPosX = 0;

// تهيئة السلايدر
function initSlider() {
  // إنشاء النقاط
  items.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  // بدء السلايدر التلقائي
  startAutoSlide();

  // إضافة أحداث السحب
  addDragEvents();
}

// تحديث السلايدر
function updateSlider() {
  sliderTrack.style.transform = `translateX(-${currentSlide * itemWidth}px)`;

  // تحديث النقاط النشطة
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

// الانتقال لشريحة محددة
function goToSlide(index) {
  currentSlide = index;
  updateSlider();
  resetAutoSlide();
}

// السلايدر التلقائي
function autoSlide() {
  if (currentSlide < items.length - 1) {
    currentSlide++;
    updateSlider();
  } else {
    currentSlide = 0;
    updateSlider();
  }
}

function startAutoSlide() {
  slideInterval = setInterval(autoSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  slideInterval = setInterval(autoSlide, 5000);
}

// وظائف السحب
function addDragEvents() {
  sliderTrack.addEventListener('mousedown', dragStart);
  sliderTrack.addEventListener('touchstart', dragStart, { passive: false });

  sliderTrack.addEventListener('mousemove', drag);
  sliderTrack.addEventListener('touchmove', drag, { passive: false });

  sliderTrack.addEventListener('mouseup', dragEnd);
  sliderTrack.addEventListener('mouseleave', dragEnd);
  sliderTrack.addEventListener('touchend', dragEnd);

  // أزرار التنقل
  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
      resetAutoSlide();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentSlide < items.length - 1) {
      currentSlide++;
      updateSlider();
      resetAutoSlide();
    }
  });
}

function dragStart(e) {
  if (e.type === 'touchstart') {
    startPosX = e.touches[0].clientX;
  } else {
    startPosX = e.clientX;
    e.preventDefault();
  }

  isDragging = true;
  sliderTrack.style.cursor = 'grabbing';
  sliderTrack.style.transition = 'none';
  prevTranslate = currentSlide * itemWidth;
  lastPosX = startPosX;
  lastTime = performance.now();
  velocity = 0;
  cancelAnimationFrame(animationID);
  clearInterval(slideInterval);
}

function drag(e) {
  if (!isDragging) return;

  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  const currentPosX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const diff = currentPosX - startPosX;
  currentTranslate = prevTranslate - diff;

  // حساب السرعة
  const deltaPos = currentPosX - lastPosX;
  velocity = deltaPos / deltaTime;
  lastPosX = currentPosX;
  lastTime = currentTime;

  // تطبيق الحركة
  sliderTrack.style.transform = `translateX(-${currentTranslate}px)`;
}

function dragEnd() {
  if (!isDragging) return;
  isDragging = false;
  sliderTrack.style.cursor = 'grab';
  sliderTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  // تحديد الشريحة بناء على السرعة والمسافة
  const movedBy = currentTranslate - prevTranslate;
  const threshold = itemWidth / 4;
  const speedThreshold = 0.3;

  if (Math.abs(velocity) > speedThreshold) {
    // الانتقال بناء على السرعة
    if (velocity > 0 && currentSlide > 0) {
      currentSlide--;
    } else if (velocity < 0 && currentSlide < items.length - 1) {
      currentSlide++;
    }
  } else if (Math.abs(movedBy) > threshold) {
    // الانتقال بناء على المسافة
    if (movedBy < 0 && currentSlide < items.length - 1) {
      currentSlide++;
    } else if (movedBy > 0 && currentSlide > 0) {
      currentSlide--;
    }
  }

  updateSlider();
  resetAutoSlide();
}

// بدء التشغيل
window.addEventListener('DOMContentLoaded', initSlider);