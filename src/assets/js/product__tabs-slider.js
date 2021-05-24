if (document.querySelector('.product__info')) {
    var swiper = new Swiper('.product__tabs-slider .swiper-container', {
        slidesPerView: 2,
        speed: 500,
        loop: false,
        autoHeight: true,
        spaceBetween: 12,
        grabCursor: true,
    });
}