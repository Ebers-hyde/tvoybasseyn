$('[name="phone"]').mask("+7 (999) 999-99-99");

$(".blog-header").each(function(){
    $(this).css("background-image", 'url('+$(this).data('bgimage')+')');
});

if($('.gidropool')) {
    $('.gidropool__variant').hover(function() {
        $(this).toggleClass('gidropool__variant-active');
        $(this).find('.btn').toggleClass('btn--secondDisabled');
        $(this).find('.btn').toggleClass('btn--primary');
    })
}

if($('.product__description_toggler')) {
    $('.product__description_toggler').click(function() {
        $('.product__info2-description').toggleClass('opened');
        $('.product__description_toggler').text(function() {
            let text;
            if($('.product__description_toggler').text() == 'Раскрыть описание') {
                text = 'Скрыть описание';
            } else {
                text = 'Раскрыть описание';
            }
            return text;
        })
    })
}

if($('.gidropool__video')) {
    $('.gidropool__videoIcon_container').click(function() {
        $('.gidropool__videoIcon_container').hide();
        $('#mrSpa_video').get(0).play();
    })
}

if($('.addToCartBlock').length > 0) {
    console.log($('.addToCartBlock'));
    $('.footer').addClass('product_footer');
}