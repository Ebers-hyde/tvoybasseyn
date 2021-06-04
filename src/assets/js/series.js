if(document.querySelector('.series-list')) {
    let dropItemsBtns = document.querySelectorAll('.series__name-mobile');

    dropItemsBtns.forEach(btn => {
        let category = btn.dataset.list;
        btn.onclick = function() {
            let list = document.querySelector(`.series__modelsList-mobile[data-list="${category}"]`);
            list.classList.toggle('inactive');
            btn.querySelector('.series__dropIcon').classList.toggle('opened');
        }
    })
}

$('.series__itemGallery').each(function(){
    let mySwiper = new Swiper($(this), {
    slidesPerView: 1,
    loop: false,
    navigation: {
        nextEl: '.button-next'+$(this).data('index'),
        prevEl: '.button-prev'+$(this).data('index'),
    },
    });
});