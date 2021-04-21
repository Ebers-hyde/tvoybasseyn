if (document.querySelector('.sidebar__drop-yet')) {
    $(document).ready(function () {
        $('.sidebar__drop-yet').click(function (event) {
            console.log($(this));
            $(this).prev().slideToggle(500);
            $(this)[0].style.display = "none";
        });
    });
};