let currentSlide = 0; // активний слайд
let totalSlides = 5; // загальна кількість слайдів
let isPlaying = false; // стан перегортання (автоматично чи ні)
let autoTimer = null; // таймер перегортання
let progressTimer = null; // таймер прогресбару
let timeTransition = 1; // час переходу в секундах
let sliderTimer = 5000; // інтервал між слайдами в мілісікундах

const slides = document.querySelector('#slides');
const slidesAll = document.querySelectorAll('#slides .slide');
const indicators = document.querySelector('#indicators');
const progress = document.querySelector('#progress');
const playText = document.querySelector('#playText');
const autoPlay = document.querySelector('#autoPlay');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');


// функція що показує наступний слайд
const nextSlide = () => {
    currentSlide++;
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    updateSlider();
};

// функція що показує попередній слайд
const prevSlide = () => {
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    updateSlider();
};

// функція що відпрацьовує по індикаторах
const goToSlide = (slideIndex) => {
    currentSlide = slideIndex;
    updateSlider();
};

// основна функція, додаємо клас active для основного слайду
const updateSlider = () => {
    slidesAll.forEach(function (el) {
        el.classList.remove('active');
        el.style.transition = `${timeTransition}s`;
    });

    slidesAll[currentSlide].classList.add('active');

    const indicatorsAll = indicators.querySelectorAll('.indicator');

    indicatorsAll.forEach(function (item, index) {
        if (index === currentSlide) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    })
};

// функція що перемикає стан кнопки autoPlay
const togglePlay = () => {
    if (isPlaying) {
        stopAutoPlay();
        isPlaying = false;
        playText.textContent = 'Play';
    } else {
        startAutoPlay();
        isPlaying = true;
        playText.textContent = 'Pause';
    }
};

// функція що запускає autoPlay
const startAutoPlay = () => {
    autoTimer = setInterval(function () {
        nextSlide();
    }, sliderTimer);
    progress.style.boxShadow = '4px 0px 10px 3px #9b9b9b';

    startProgressBar();
};

// функція що зупиняє autoPlay
const stopAutoPlay = () => {
    if (autoTimer) {
        clearInterval(autoTimer);
    };
    progress.style.boxShadow = '';

    stopProgressBar();
};

// функція що запускає та малює прогресбар
const startProgressBar = () => {
    let startTime = Date.now();
    if (progressTimer) cancelAnimationFrame(progressTimer);

    const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progressPercent = (elapsed / sliderTimer) * 100;

        if (progressPercent >= 100) {
            progress.style.width = '100%';
            startTime = Date.now();
        } else {
            progress.style.width = `${progressPercent}%`;
        }

        progressTimer = requestAnimationFrame(updateProgress);
    }

    updateProgress();
};

// функція що зупиняє прогресбар
const stopProgressBar = () => {
    if (progressTimer) {
        cancelAnimationFrame(progressTimer);
        progressTimer = null;
    }
    progress.style.width = '0';
};

// функція що відловлює нажаті клавіші
const handleKeyboard = (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            prevSlide();
            break;
        case 'ArrowRight':
            nextSlide();
            break;
        case ' ':
            togglePlay();
    }
};

// функція що створює індикатори в DOM
const createIndicators = () => {
    for (let i = 0; i < slidesAll.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('indicator');
        dot.onclick = () => goToSlide(i);
        indicators.appendChild(dot);
    }
};

// свайп пальцем на мобільних пристроях
const swiperFinger = () => {

    slides.addEventListener("touchstart", handleTouchStart, false);
    slides.addEventListener("touchmove", handleTouchMove, false);

    let xDown = null;
    let yDown = null;

    function handleTouchStart(event) {
        const firstTouch = event.touches[0];
        const clientX = firstTouch.clientX;
        const clientY = firstTouch.clientY;

        xDown = clientX;
        yDown = clientY;
    }

    function handleTouchMove(event) {
        if (!xDown || !yDown) {
            return;
        }

        const firstTouch = event.touches[0];
        const clientX = firstTouch.clientX;
        const clientY = firstTouch.clientY;

        const xDiff = xDown - clientX;
        const yDiff = yDown - clientY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            xDiff > 0 ? nextSlide() : prevSlide();
        } else {
            return;
        }

        xDown = null;
        yDown = null;
    }
}

// свайп мишкою на десктопах
const swipeMouse = () => {
    slides.addEventListener("mousedown", handleMouseStart, false);
    slides.addEventListener("mousemove", handleMouseMove, false);

    let xMouse = null;
    let yMouse = null;

    function handleMouseStart(event) {
        xMouse = event.offsetX;
        yMouse = event.offsetY;
    }

    function handleMouseMove(event) {
        if (!xMouse || !yMouse) {
            return;
        }

        const xDiff = xMouse - event.offsetX;
        const yDiff = yMouse - event.offsetY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            xDiff > 0 ? nextSlide() : prevSlide();
        } else {
            return;
        }

        xMouse = null;
        yMouse = null;
    }
}


// функція що запускає слайдер
const initSlider = () => {
    createIndicators();
    updateSlider();
    swipeMouse();
    swiperFinger();

    document.addEventListener('keydown', handleKeyboard);
    autoPlay.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
};

document.addEventListener('DOMContentLoaded', initSlider);