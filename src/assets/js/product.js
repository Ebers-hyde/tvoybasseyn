if(document.querySelector('.product')&&document.querySelector('.toggle_modelsDropdown')) {

    document.querySelectorAll('.toggle_modelsDropdown').forEach(btn => {
        btn.onclick = function(evt) {
            evt.preventDefault();
            document.querySelector('.product__modelDropdowns').classList.toggle('opened');
            document.querySelector('.product__info2').classList.toggle('inactive');
            document.querySelector('.product__purchase').classList.toggle('inactive');
            document.querySelector('.product__optionDropdowns').classList.toggle('inactive');
        }
    })
}

if(document.querySelector('.product__dropdowns')) {
    document.querySelectorAll('.product__dropdown').forEach(drop => {
        drop.onclick = function() {
            if(drop.dataset.dropdown) {
                document.querySelector(`.product__dropdownItem[data-dropdown='${drop.dataset.dropdown}']`).classList.toggle('hidden');
            }
        }
    })
}

if (document.querySelector('.product__power-list')) {
    let produc = document.querySelectorAll('.product__power-list .product__power-item');
    for (var i = 0; i < produc.length; i++) {
        produc[i].addEventListener('click', function () {
            document.querySelector('.product__power-item--active').classList.remove('product__power-item--active');
            this.classList.add('product__power-item--active');
        })
    }
};