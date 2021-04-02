if (document.querySelector('.product__slider')) {
    var swiper = new Swiper('.product__slider .swiper-container', {
        slidesPerView: 'auto',
        initialSlide: 1,
        spaceBetween: 14,
        centeredSlides: true,
        speed: 1000,
        loop: false,
        breakpoints: {
            320: {
                slidesPerView: 1,
                direction: 'horizontal',
                pagination: {
                    el: '.product__slider .swiper-pagination',
                    clickable: true,
                },
            },
            1024: {
                slidesPerView: 'auto',
                direction: 'vertical',
                centeredSlides: false,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            },
        },
    });
}
if (document.querySelector('.series__modelsList-slider')) {
    new Swiper('.series__modelsList-slider .swiper-container', {
        slidesPerView: 1,
        initialSlide: 0,
        spaceBetween: 20,
        centeredSlides: true,
        speed: 1000,
        loop: false,
        pagination: {
            el: '.series__modelsList-slider .swiper-pagination',
            clickable: true,
        },
        
    });
}

