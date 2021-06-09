if(document.querySelector('.offer')) {
    document.querySelectorAll('.offer__toggle').forEach(toggle => {
        toggle.onclick = function() {
            if(toggle.dataset.block) {
                document.querySelector(`.offer__description_content[data-block='${toggle.dataset.block}']`).classList.toggle('hidden');
                toggle.querySelector('svg').classList.toggle('opened');
            }
        }
    })
}