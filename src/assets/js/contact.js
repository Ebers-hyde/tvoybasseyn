const { default: CustomSwipe } = require("./CustomSwipe");

if(document.querySelector('.contactStores')) {
    let previews = document.querySelectorAll('.contactStore__preview');

    previews.forEach(preview => {
        let city = preview.dataset.city;
        let cityBlock = document.querySelector(`.contactStore__full[data-city='${city}']`);
        preview.onclick = function() {
            document.querySelector('.contactStore__previews').classList.add('contactStore__previews-hidden');
            document.querySelector('.contactStores.desktop--hide').style.height = '700px'; 
            cityBlock.classList.add('contactStore__full-active');

            document.querySelector(`.contactStore__full[data-city='${city}'] .contactStore__header`).onclick = function() {
                cityBlock.classList.remove('contactStore__full-active');
                document.querySelector('.contactStores.desktop--hide').style.height = '400px'; 
                document.querySelector('.contactStore__previews').classList.remove('contactStore__previews-hidden');
            }

            let contactSwiper = new CustomSwipe(cityBlock);
            contactSwiper.onRight(function() {
                cityBlock.classList.remove('contactStore__full-active');
                document.querySelector('.contactStores.desktop--hide').style.height = '400px'; 
                document.querySelector('.contactStore__previews').classList.remove('contactStore__previews-hidden');
            });
            contactSwiper.run();
        }

        let contactSwiper = new CustomSwipe(preview);
        contactSwiper.onLeft(function() {
            document.querySelector('.contactStore__previews').classList.add('contactStore__previews-hidden');
            document.querySelector('.contactStores.desktop--hide').style.height = '700px'; 
            cityBlock.classList.add('contactStore__full-active');

            document.querySelector(`.contactStore__full[data-city='${city}'] .contactStore__header`).onclick = function() {
                document.querySelector('.contactStore__previews').classList.remove('contactStore__previews-hidden');
                document.querySelector('.contactStores.desktop--hide').style.height = '400px'; 
                cityBlock.classList.remove('contactStore__full-active');
            }

            let contactSwiper = new CustomSwipe(cityBlock);
            contactSwiper.onRight(function() {
                cityBlock.classList.remove('contactStore__full-active');
                document.querySelector('.contactStores.desktop--hide').style.height = '400px'; 
                document.querySelector('.contactStore__previews').classList.remove('contactStore__previews-hidden');
            });
            contactSwiper.run();
        });
        contactSwiper.run();
    });


}