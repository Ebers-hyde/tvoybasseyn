$('.anchors a:not([data-anchors]):not(.sidebar__nav-linkFollow)').on("click", function(e){
    e.preventDefault();
    var elementid = $(this).attr("href");
    if ( document.querySelector("#"+elementid) ) {
        var destination = $("#"+elementid).offset().top;
        $('html, body').animate({
            scrollTop: destination}, 1000, function(){
                // window.animations1.checkScroll();
                window.hideMenu();
            });
            console.log(destination);
    } else {
        location.href = '/#' + elementid;
    }
});