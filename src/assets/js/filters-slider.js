if (document.querySelector('.pool-filters__slider')) {
	var swiper = new Swiper('.pool-filters__slider .swiper-container', {
		slidesPerView: 2,
		speed: 1000,
		loop: false,
		autoHeight: true,
		spaceBetween: 5,
		grabCursor: true,
	});
}