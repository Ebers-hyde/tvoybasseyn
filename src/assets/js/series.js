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