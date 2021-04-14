window.show_popup = function(id){
	document.querySelector('#'+id).classList.add('popup-wrap--active');
	raf(function(){
		document.querySelector('#'+id).classList.add('popup-wrap--opacity1');
	});

	function xxx() {
		document.querySelector('#'+id).querySelector('.popup').classList.add('popup--opacity1');
		document.querySelector('#'+id).removeEventListener('transitionend', xxx);
	}

	document.querySelector('#'+id).addEventListener('transitionend', xxx);
}

window.close_popup = function(id){
	if ( document.querySelector('#'+id).classList.contains('sale-popup--2') ) {
		document.querySelector('#'+id).classList.remove('sale-popup--op1');


		function xxx3() {
			document.querySelector('#'+id).classList.remove('popup-wrap--active');
			document.querySelector('#'+id).classList.remove('popup-wrap--opacity1');
			document.querySelector('#'+id).classList.remove('sale-popup--op0');
			document.querySelector('#'+id).classList.remove('sale-popup--2');
			document.querySelector('#'+id).classList.add('sale-popup--1');

			document.querySelector('#'+id).querySelector('.popup--opacity1').classList.remove('popup--opacity1');


			document.querySelector('#'+id).removeEventListener('transitionend', xxx3);
		}

		document.querySelector('#'+id).addEventListener('transitionend', xxx3);



	} else {
		document.querySelector('#'+id).querySelector('.popup').classList.remove('popup--opacity1');
		function xxx() {
			document.querySelector('#'+id).classList.remove('popup-wrap--opacity1');
			setTimeout(function(){
				document.querySelector('#'+id).classList.remove('popup-wrap--active');
			},400)
			document.querySelector('#'+id).querySelector('.popup').removeEventListener('transitionend', xxx);

		}
		document.querySelector('#'+id).querySelector('.popup').addEventListener('transitionend', xxx);
	}
}

function raf(fn) {
	window.requestAnimationFrame(function(){
		window.requestAnimationFrame(function(){

			fn();
		});
	});
}


if ( document.querySelector('.popup-wrap') ) {
	let popups =document.querySelectorAll('.popup-wrap');
	for (var i = 0; i < popups.length; i++) {
	 	popups[i].addEventListener('click', function (e){ 
		if (e.target.closest('.popup') == null) {
			close_popup(e.target.getAttribute('id'));
		}
	});
	 } 
}



$('.contact__form form,#callback form').submit(function(e){
	let forma = $(this);
	console.log(forma);
	e.preventDefault();
	
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/ru/webforms/send.json?redirect_disallow=1',
        data: $(this).serialize(),

        success: function (data) {
            var sendFailure = data.error;
            if (sendFailure) {
                showErrorMessage(forma, data.error);
                return;
            }
   
            if(forma.data('file')){
                let win = window.open(forma.data('file'), '_blank');
                if (win) {
                    win.focus();
                }
                forma.html('Ваша заявка принята, специалисты свяжутся с Вами в ближайшее время.<br><br>Если скачивание не произошло автоматически, перейдите по <a target="_blank" href="'+forma.data('file')+'">этой ссылке</a>');
            }else{
                forma.html('Ваша заявка принята, специалисты свяжутся с Вами в ближайшее время');
            }
            
        }
    });
});


$(document).trigger("enhance");
var dataOffcanvas = $('#cart').data('offcanvas-component');
$('.cart__close').click(function(){
	dataOffcanvas.close();
});