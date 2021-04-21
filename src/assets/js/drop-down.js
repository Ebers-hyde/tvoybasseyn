const links = document.querySelectorAll('.sidebar__nav-linkDrop');
const drops = document.querySelectorAll('.sidebar__drop');
let dropsArr = {};
drops.forEach(drop => {
    dropsArr[drop.dataset.drop] = drop;
});

const mobileDrops = document.querySelectorAll('.sidebar__drop--mobile');
let mobileDropsArr = {};
mobileDrops.forEach(drop => {
    mobileDropsArr[drop.dataset.drop] = drop;
});


const overlay = document.querySelector('.content__overlay');
const catalogSidebar = document.querySelector('.sidebar--catalog');
const mobileMenu = document.querySelector('.mobile-menu--catalog');
const subcatArrows = document.querySelectorAll('.sidebar__nav-linkArrow');
const sidebarNav = document.querySelector('.sidebar__nav--catalog');
const subcatList = document.querySelector('.sidebar__nav-subcatList');
const backButton = document.querySelector('.mobile-menu__act--back');
const closeButton = document.querySelector('.mobile-menu__act--close');


class Dropdown {
    
    linkDrop(link) {
        let dropId = link.dataset.drop;
        drops.forEach(drop => {
            drop.classList.remove('active');
        });
        dropsArr[dropId].classList.add('active');
        overlay.classList.remove('hidden');
    }

    hideDrop() {
        overlay.classList.add('hidden');
        drops.forEach(drop => {
            drop.classList.remove('active');
        });
    }
    linkDropMobile(link) {
        closeButton.style.display = "none";
        backButton.style.display = "inherit";
        let dropId = link.dataset.drop;
        mobileDrops.forEach(drop => {
            drop.classList.remove('active');
        });
        sidebarNav.style.transform = "translateX(-27rem)";
        mobileDropsArr[dropId].classList.add('active');
    }
    hideDropMobile() {
        mobileDrops.forEach(drop => {
            drop.classList.remove('active');
        });
        backButton.style.display = "none";
        sidebarNav.style.transform = "none";
        closeButton.style.display = "inherit";
    }
}

if(catalogSidebar) {
    let dropdown = new Dropdown();
    links.forEach(link => {
        link.onmousemove = function() {
            dropdown.linkDrop(link);
        }
    });
    overlay.onclick = function() {
        dropdown.hideDrop();
    }
};

if (mobileMenu) {
    let dropdown = new Dropdown();
    links.forEach(link => {
        link.onclick = function(evt) {
            evt.preventDefault();
            dropdown.linkDropMobile(link);
        }
    });
    backButton.onclick = function() {
        dropdown.hideDropMobile();
    }
};



/*let link = document.querySelectorAll('.sidebar__nav-link');
let drop = document.querySelectorAll('.sidebar__drop');
let overlay = document.querySelector('.content__overlay');
let catalogSidebar = document.querySelector('.sidebar--catalog');

$(function () {
    link.forEach(linkDrop);

    function linkDrop(item, index) {
        if(catalogSidebar) {
            $(item).mouseover(function () {
                $('.sidebar__drop').removeClass('active');
                $('.sidebar__drop[data-drop="'+$(item).data('drop')+'"]').addClass('active');
                overlay.classList.remove('hidden');
            });
        }
    
        /*$(item).mouseout(function () {
            $('.sidebar__drop[data-drop="'+$(item).data('drop')+'"]').removeClass('active')
        });
    }

    $('.content__overlay').click(function() {
        overlay.classList.add('hidden');
        $('.sidebar__drop').removeClass('active');
    });
    /*drop.forEach(dropDrop);

    function dropDrop(item, index) {
        $(item).mouseover(function () { 
            $(this).addClass('active') 
        });
    
        $(item).mouseout(function () { 
            $(this).removeClass('active')
        }); 
    } 
    
    
});*/



let linkMob = document.querySelector('.mobile-menu .sidebar__nav-item--equipment');
let dropMob = document.querySelector('.mobile-menu .sidebar__drop--equipment');

$(function () {

    $(linkMob).mouseover(function () { 
        $(dropMob).addClass('active');
    });

    $(linkMob).mouseout(function () {
        $(dropMob).removeClass('active');
    });
    $(dropMob).mouseover(function () {
        $(this).addClass('active');
    });

    $(dropMob).mouseout(function () {
        $(this).removeClass('active');
    });
    
});