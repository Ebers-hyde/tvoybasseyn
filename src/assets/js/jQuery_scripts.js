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