let link = document.querySelectorAll('.sidebar__nav-item');
let drop = document.querySelectorAll('.sidebar__drop');

$(function () {
    link.forEach(linkDrop);

    function linkDrop(item, index) {
        $(item).mouseover(function () {
            $('.sidebar__drop[data-drop="'+$(item).data('drop')+'"]').addClass('active')
        });
    
        $(item).mouseout(function () {
            $('.sidebar__drop[data-drop="'+$(item).data('drop')+'"]').removeClass('active')
        });
    }

    drop.forEach(dropDrop);

    function dropDrop(item, index) {
        $(item).mouseover(function () { 
            $(this).addClass('active') 
        });
    
        $(item).mouseout(function () { 
            $(this).removeClass('active')
        }); 
    }
    
    
});

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