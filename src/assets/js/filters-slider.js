if (document.querySelector('.pool-filters__slider')) {
	var swiper = new Swiper('.pool-filters__slider .swiper-container', {
		slidesPerView: 'auto',
		initialSlide: $('.pool-filters__slider .swiper-slide').length,
		speed: 1000,
		loop: false,
		autoHeight: true,
		spaceBetween: 5,
		grabCursor: true,
	});

	setTimeout(() => swiper.slideTo(0, 500, false), 1000);
}