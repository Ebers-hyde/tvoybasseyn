let Filter = class {

    constructor() {
        this.posits = null;
        this.titles = {};
        this.params = null;
        this.checkContainers = null;
    }

    init() {
        this.posits = document.querySelectorAll('.pool-filters__sort .pool-filters__position');
        for (let i = 0; i < this.posits.length; i++) {
            this.posits[i].addEventListener('click', function () {
                document.querySelector('.pool-filters__position--active').classList.remove('pool-filters__position--active');
                this.posits[i].classList.add('pool-filters__position--active');
            })
        }

        $('.pool-filters__position').on('click', function() {
            var $button = $(this);
            var className = $button.data('class');
            $.cookie('catalog_class', className);
        
            $('#catalog_category')
                .removeClass('goods catalog_list catalog_inline')
                .addClass(className);
        });
    }
}

if(document.querySelector('.desktop_filters')) {
    new Filter().init();
}

