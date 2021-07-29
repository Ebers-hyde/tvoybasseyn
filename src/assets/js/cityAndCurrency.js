window.city = window.city || {};
		$(document).ready(function(){
		const locateWrap = document.querySelector('.header__region-list-wrap');
		const locateBox = document.querySelector('.header__city');
		const locateMsk = document.querySelectorAll('.region-modal__msk');
		const footerAddress = document.querySelectorAll('.footer__address');
		const locateSpb = document.querySelectorAll('.region-modal__spb');
		const locateAny = document.querySelectorAll('.region-modal__any');
		const header__tel = document.querySelectorAll('.select-phone--service a');
		const header__tel_shop = document.querySelectorAll('.select-phone--shop a');
		const sidebar__footer_phone = document.querySelector('.sidebar__footer a:last-child');
		const sidebar__footer_mail = document.querySelector('.sidebar__footer a:first-child');
		const header__tel3 = document.querySelector('.header__tel_mobile');
        const token = "11b8adbf35744dda02c4b7e4ce92e225111e1077";

		window.city = {
            cityRu: '',
            city: '',
			init: function () {
				if (this.getCookie('locate')) {
					this.showLocate();
				} else {
                    city.detect();
				}
		
			},
            iplocate: function(ip) {
                var serviceUrl = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address";
                if (ip) {
                    serviceUrl += "?ip=" + ip;
                }
                var params = {
                    type: "GET",
                    contentType: "application/json",
                    headers: {
                    "Authorization": "Token " + token
                    }
                };
                return $.ajax(serviceUrl, params);
            },
            detect: function() {
                
                let ip = document.querySelector('body').dataset.ip;
                city.iplocate(ip).done(function(response) {
                    city.cityRu = response.location.data.city;
                    city.region = response.location.data.federal_district;
                    city.setLocate('locate', city.checkLocate());
                    city.setLocate('locate-city', response.location.data.city);
					city.showLocate();
                    city.showConfirm();
					document.querySelector('.header__region-list-confirm').innerHTML = 'Да';
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
      
                });
            },
			getCookie: function(name) {
				let matches = document.cookie.match(new RegExp(
					"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
				));
				return matches ? decodeURIComponent(matches[1]) : undefined;
			},
			setLocate: function(name, value) {
                document.querySelectorAll('.list-group-item-action[data-city]').forEach(c => {
                    console.log(value);
                    if (c.dataset.city !== value) {
                        c.classList.add('city_toSelect');
                    } else {
                        c.classList.remove('city_toSelect');
                    }
                })
                
				document.cookie = `${name}=${value}; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`;

			},
			checkLocate: function(name,region='') {
                name = city.cityRu;
                region = city.region;

              

				if (name == 'Санкт-Петербург'||region == 'Северо-Западный') {
                    city.city = 'spb';
					return 'spb';
				} else if (name == 'Москва'||region == 'Центральный'||region == 'Приволжский') {
                    city.city = 'msk';
					return 'msk';
				} else {
                    city.city = 'any';
					return 'any';
				}
			}, 
			showLocate: function(val = this.getCookie('locate')) {
                if(locateBox)
				    document.querySelector('.header__city span').innerHTML = city.names[val];

                    document.querySelectorAll('.list-group-item-action[data-city]').forEach(c => {
                        if (c.dataset.city !== val) {
                            c.classList.add('city_toSelect');
                        }
                    })
                
                if(header__tel){
                    header__tel.forEach(function(tel,index) { 
                        tel.innerHTML = city.phone[val];
                        tel.setAttribute('href', 'tel:'+city.phone[val]);
                    });
                }
				if(header__tel_shop){
                    header__tel_shop.forEach(function(tel,index) { 
                        tel.innerHTML = city.phone2[val];
                        tel.setAttribute('href', 'tel:'+city.phone2[val]);
                    });                        
                }
                if(sidebar__footer_phone){
                    sidebar__footer_phone.innerHTML = city.phone[val];
                    sidebar__footer_phone.setAttribute('href', 'tel:'+city.phone[val]);
                }
                if(sidebar__footer_mail){
                    sidebar__footer_mail.innerHTML = city.email[val];
				    sidebar__footer_mail.setAttribute('href', 'mailto:'+city.email[val]);
                }

				if (header__tel3) {
                    header__tel3.setAttribute('href', 'tel:'+city.phone[val]);
				}
                if(document.querySelector('[name="system_email_to"]')){
					let arr = document.querySelectorAll('[name="system_email_to"]');
					for(k in arr){
						arr[k].value = city.system_email_to[val];
					}
				}
                if(document.querySelector('.contacts__list')){
                    document.querySelector('.contacts__listItem.phone a:first-child').innerHTML = city.phone[val];
                    document.querySelector('.contacts__listItem.phone a:first-child').setAttribute('href', 'tel:'+city.phone[val]);
                    document.querySelector('.contacts__listItem.phone a:last-child').innerHTML = city.phone2[val];
                    document.querySelector('.contacts__listItem.phone a:last-child').setAttribute('href', 'tel:'+city.phone2[val]);
                    document.querySelector('.contacts__listItem.mail a').innerHTML = city.email[val];
 
                    document.querySelector('.contacts__listItem.mail a').setAttribute('href', 'mailto:'+city.email[val]);
                    document.querySelector('.contacts__listItem.address span').innerHTML = city.address[val];

                    document.querySelector('.contacts__map').outerHTML = city.map[val];
				}
				if (document.querySelector('.header__address .address__text')) {
					document.querySelector('.header__address .address__text').innerHTML = city.address[val];
				}
				if (footerAddress) {
					footerAddress.innerHTML = city.address[val];
				}
				if (document.querySelector('.home-page__subtitle')) {
					document.querySelector('.home-page__subtitle').innerHTML = city.mainPage[val];
				}   
				if (document.querySelector('.data-form__title')) {
					let deliveryBoxes = document.querySelectorAll('.delivery__choose-adress');
					let deliveryBoxes_array = Array.prototype.slice.call(deliveryBoxes);
					deliveryBoxes_array.map((el) => el.style.display = "block");

					let optionsList = document.querySelectorAll('.data-form__wrapper');
					let optionsList_array = Array.prototype.slice.call(optionsList);

					document.querySelector('.delivery__choose-adress iframe').outerHTML = city.map[val];
					document.querySelector('.delivery__choose-adress iframe').style.height = '50vh';
					if (val == 'msk') {
						optionsList_array.map((el) => el.style.display = "block");
						optionsList_array[0].style.display = "none";
					} else {
						optionsList_array.map((el) => el.style.display = "block");
						optionsList_array[2].style.display = "none";
					}
				}     
				city.cityRu = city.names[val];     
                
			},
			showConfirm: function() {
				locateWrap.classList.add('header__region-list-wrap--hover');
			},
			names: {
				spb: 'Санкт-Петербург',
				msk: 'Москва', 
				any: 'работаем по всей России'
			},
            phone: {
                spb: '+7 (812) 970-71-71',
				msk: '+7 (499) 113-71-71', 
				any: '+7 (812) 970-71-71'
            },
            phone2: {
                spb: '+7 (812) 716-77-11',
				msk: '+7 (499) 113-70-70', 
				any: '+7 (812) 716-77-11'
            },
            email: {
                spb: 'sale@tvoybasseyn.ru',
				msk: 'msk@tvoybasseyn.ru', 
				any: 'sale@tvoybasseyn.ru'
            },
            address: {
                spb: 'ул. Бассейная, д.73, корпус 1',
				msk: 'Киевское шоссе, БЦ Румянцево, корпус Е', 
				any: 'ул. Бассейная, д.73, корпус 1'
            },
            map: {
                spb: '<iframe class="contacts__map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2003.1004996777938!2d30.339779615783712!3d59.86407738184916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46963aaafda9c53f%3A0xe1c4654a691678a0!2z0YPQuy4g0JHQsNGB0YHQtdC50L3QsNGPLCA3MyDQutC-0YDQv9GD0YEgMSwg0KHQsNC90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMsIDE5NjIxMQ!5e0!3m2!1sru!2sru!4v1580406932524!5m2!1sru!2sru" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen=""></iframe>',
                // msk: '',
				msk: '<iframe class="contacts__map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2252.1254147928125!2d37.43568151604289!3d55.63463230856709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b55289d4fa639f%3A0xcaf392ca401cb288!2z0JHQuNC30L3QtdGBLdC_0LDRgNC6INCg0YPQvNGP0L3RhtC10LLQvg!5e0!3m2!1sru!2sru!4v1583156838556!5m2!1sru!2sru"  style="border:0;" allowfullscreen=""></iframe>', 
				any: '<iframe class="contacts__map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2003.1004996777938!2d30.339779615783712!3d59.86407738184916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46963aaafda9c53f%3A0xe1c4654a691678a0!2z0YPQuy4g0JHQsNGB0YHQtdC50L3QsNGPLCA3MyDQutC-0YDQv9GD0YEgMSwg0KHQsNC90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMsIDE5NjIxMQ!5e0!3m2!1sru!2sru!4v1580406932524!5m2!1sru!2sru" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen=""></iframe>'
            },
            system_email_to: {
                spb: '959',
				msk: '10588', 
				any: '959'
            },
            header: {
                spb: 'в Санкт-Петербурге',
				msk: 'в Москве', 
				any: 'в России'
			},
			mainPage: {
				spb: 'в Санкт-Петербурге и Ленинградской области',
				msk: 'в Москве и Московской области', 
				any: 'Работаем по всей России'
			},
			deliveryAdress: {
				spb: 'в Санкт-Петербурге и Ленинградской области',
				msk: 'в Москве и Московской области', 
				any: 'по всей России'
			}
		};window.city.init();

		

        for (let locate of locateMsk) {
            locate.onclick = function(e) {
                city.setLocate('locate', 'msk');
                document.cookie = `locate-city=Москва; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
                city.showLocate();
                close_popup('city');
                close_popup('other');
                return false;
            }
        }

        for (let locate of locateSpb) {
            locate.onclick = function(e) {
                city.setLocate('locate', 'spb');
                document.cookie = `locate-city=Санкт-Петербург; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
                city.showLocate();
                close_popup('city');
                close_popup('other');
                return false;
            }
        }

        for (let locate of locateAny) {
            locate.onclick = function(e) {
                city.setLocate('locate', 'any');
                document.cookie = `locate-city=${city.cityRu}; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
                let ip = document.querySelector('body').dataset.ip;
                city.iplocate(ip).done(function(response) {
                    city.cityRu = response.location.data.city;
                    city.setLocate('locate-city', response.location.data.city);
                    console.log(response, response.location.data.city);
                    
                });
                city.showLocate();
                close_popup('city');
                close_popup('other');
                document.querySelector('.header__region-current').innerHTML = 'Другой город';
                return false;
            }
        }
 


	});

    $('.selectCurrency').click(function(){
        let $form = $(this).closest('form');
        $form.submit();
    });