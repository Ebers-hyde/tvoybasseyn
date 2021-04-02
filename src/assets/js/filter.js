if (document.querySelector('.pool-filters__sort')) {
    let posit = document.querySelectorAll('.pool-filters__sort .pool-filters__position');
    for (var i = 0; i < posit.length; i++) {
        posit[i].addEventListener('click', function () {
            document.querySelector('.pool-filters__position--active').classList.remove('pool-filters__position--active');
            this.classList.add('pool-filters__position--active');
        })
    }
};

$('.pool-filters__position').on('click', function() {
    var $button = $(this);
    var className = $button.data('class');
    $.cookie('catalog_class', className);

    $('#catalog_category')
        .removeClass('goods catalog_list catalog_inline')
        .addClass(className);
});