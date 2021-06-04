(function(w, $, _, getLabel) {

/**
 * Модуль корзины товаров
 * @type {Object}
 */
 
site.Cart = {
	/** @type {Boolean} Статус готовности корзины */
	ready: true,

	/** @type {Boolean} Является ли текущая страница корзиной */
	isCartPage: _.isArray(w.document.location.pathname.match(/emarket\/cart/)),

	/** Инициализация модуля */
	init: function() {

		/** @type {string} Селектор всплывающего окна для кнопки "Купить" */
		var buyModalSelector = '#buy_modal';

		/** @type {string} Селектор всплывающего окна для кнопки "Купить в один клик" */
		var oneClickModalSelector = '#oneclick_modal';

		/**
		 * Нажатие на кнопку "Купить" ("Добавить" для связанных товаров в корзине).
		 * Если у товара есть опционные свойства - появляется всплывающее окно с выбором свойств.
		 * Если опционных свойств нет - товар добавляется в корзину.
		 */

		$('a.add_to_cart_button').on('click', function(e) {
			e.preventDefault();
			var $button = $(this);

			$(this).toggleClass('hidden');
			$(this).next().toggleClass('product__quantity-active');

			if ($button.hasClass('not_buy')) {
				return;
			}

			

			if (site.TradeOffers.isAvailable()) {
				site.Cart.putElementInCart($button, {
					'offer_id': site.TradeOffers.getOfferId(),
					'price_type_id': $('#price_type_id').data('price-type-id')
				});
				console.log(site.TradeOffers.getOfferId());
				return;
			}

			var $optionedPropertiesBlock = $button.parents('.add_to_cart_block').find('.hidden_optioned_properties');

			if ($optionedPropertiesBlock.length === 0) {
				site.Cart.putElementInCart($button);
				return;
			}

			var $buyModal = $(buyModalSelector);
			$buyModal.find('main').html($optionedPropertiesBlock.html());
			var $form = $buyModal.find('form');
			$form.attr('action', this.href);

			$buyModal.modal('show');
		});

		$('.show_orderDetails').on('click', function() {
			$('.onestep-mobile').toggleClass('hidden');
			$(this).toggleClass('open');
		})

		$('.header__basket.desktop--hide').on('click', function(evt) {
			if(+$('.order_item_count-mobile').text() < 1 ) {
				evt.preventDefault();
			}
		})


		/** Нажатие на кнопку "Купить в один клик". */
		$('a.buy_one_click_button').on('click', function(e) {
			e.preventDefault();
			var $button = $(this);

			if ($button.hasClass('not_buy')) {
				return; 
			}
 
			var $addToCartBlock = $button.closest('.product').find('.add_to_cart_block');
			
			var $oneClickModal = $(oneClickModalSelector);

			var elementId = $addToCartBlock.data('element_id');
			$oneClickModal.attr('data-element_id', elementId);

			if (site.TradeOffers.isAvailable()) {
				$oneClickModal.attr("data-offer_id", elementId);
				show_popup('oneclick_modal');
				return;
			}

			var $optionedPropertiesBlock = $addToCartBlock.find('.hidden_optioned_properties');

			if ($optionedPropertiesBlock.length > 0) {
				$('#one_click_order_optioned_properties')
					.html($optionedPropertiesBlock.html())
					.find('input[type="submit"]')
					.remove(); // Удаляем ненужную кнопку 'Добавить в корзину'
			}

			show_popup('oneclick_modal');
		});

		/** Нажатие на кнопку "Оформить заказ" внутри всплывающего окна для заказа в один клик. */
		$(oneClickModalSelector).find('form').on('submit', function(e) {
			e.preventDefault();
			var elementId = $(oneClickModalSelector).data('element_id');
			var offerId = $(oneClickModalSelector).data('offer_id');
			var url = '/' + window.pageData.lang + '/emarket/getOneClickOrder/element/' + elementId + '.json';

			if (site.TradeOffers.isAvailable() && offerId) {
				url = url + '?offer_id=' + site.TradeOffers.getOfferId();
			}

			var $form = $(this);
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: url,
				data: $form.serialize(),

				success: function(data) {
					if (data && data.data.error) {
						site.forms.showErrorMessage($form, data.data.error);
						return;
					}

					var message = getLabel('js-one_click_order_fail');

					var orderNumber = (data && data.data.orderId) ? data.data.orderId : null;
					if (orderNumber) {
						message = getLabel('js-one_click_order_success');
						message = message.replace('%s', orderNumber);
					}

					$form.parent().html(message);
				}
			});
		});

		/** Кнопка-крестик удаления товара из корзины */
		$('.order_delete').on('click', function(e) {
			e.preventDefault();
			site.Cart.remove($(this).data("id"));
			$(this).closest('.cart__list__item').remove();
		});

		$('.cart__hide-list-trigger').on('click', function(e) {
			e.preventDefault();
			$('.order-1').hide();
			$('.cart__show-list-trigger').show();
			$('.order-2').removeClass('col-md-7');
			$('.order-2').addClass('col-md-12');
		})

		$('.cart__show-list-trigger').on('click', function(e) {
			e.preventDefault();
			$(this).hide();
			$('.order-1').show();
			$('.order-2').removeClass('col-md-12');
			$('.order-2').addClass('col-md-7');
		})

		/** Изменение количества товара через клавиатуру */
		$('.current_quantity').on('focus', function() {
			var $input = $(this);
			$input.data('oldvalue', $input.val());
		}).change(function() {
			var $input = $(this);
			var $parent = $('.pool-filters').length != 0 ? $input.closest('.card') : $('.add_to_cart_block');
			var orderItemId = $parent.data('order_id');
			var oldValue = $input.data('oldvalue');
			site.Cart.modify(orderItemId, $input.val(), oldValue);

			if(+$input.val() <= 0) {
				$parent.find('.product__quantity').toggleClass('product__quantity-active');
				$parent.find('.add_to_cart_button').toggleClass('hidden');
			}
		});

		/** Изменение количества товара через кнопки "плюс/минус" */
		$('.change_product_quantity').on('click', function(e) {

			if (!site.Cart.ready) {
				return;
			}

			//site.Cart.ready = false;

			var $button = $(this);
			var $parent = $('.pool-filters').length != 0 ? $button.closest('.card') : $button.closest('.add_to_cart_block');
			var orderItemId = $parent.attr('data-order_id');
			var quantityNode = $parent.find('.current_quantity');
			var oldValue = quantityNode.val();
			quantityNode.val($button.hasClass('quantity__up') ? (+quantityNode.val() + 1) : (+quantityNode.val() - 1));
			site.Cart.modify(orderItemId, quantityNode.val(), oldValue);
		
			if(+quantityNode.val() <= 0) {
				$parent.find('.product__quantity').toggleClass('product__quantity-active');
				$parent.find('.add_to_cart_button').toggleClass('hidden');
			}
		});

		/** Применение промокода */
		$('form#promocode').on('submit', function(e) {
			e.preventDefault();

			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: '/udata/emarket/savePromoCode/.json',
				data: $(this).serialize(),

				success: function(data) {
					if (data.result) {
						window.location.reload();
					} else {
						$('.wrong_promocode').show();
					}
				}
			});
		});
	},

	/**
	 * Добавляет товар в корзину
	 * @param {jQuery} $button кнопка товара "Купить"
	 * @param {object} paramList параметры GET запроса
	 */
	putElementInCart: function($button, paramList) {
		var url = $button.attr('href');
		url = paramList ? site.Cart.addParamsToUrl(url, paramList) : url;

		$.ajax({
			url: '/udata' + url,
			success: function() {
				basket.get(function(data) {
					site.Cart.updateOrderItemCount(data.summary.amount);
					site.Cart.ready = true;
					site.Cart.changeAddedProductButton($button,data);
				});
			}
		});
	},

	/**
	 * Добавляет гет параметры к url
	 * @param {string} url адрес
	 * @param {object} paramList параметры GET запроса
	 * @returns {string}
	 */
	addParamsToUrl: function(url, paramList) {
		return url + '?' + $.param(paramList);
	},

	/**
	 * Изменяет внешний вид кнопки "Купить" при добавлении товара в корзину
	 * @param {jQuery} $button кнопка товара "Купить"
	 */
	changeAddedProductButton: function($button,data=null) {
		Object.entries(data.items.item).forEach(function(item, i, arr) {

			if($button.closest('.card').find('.card__title').text() == item[1].name) {
				$button.closest('.card').attr('data-order_id', item[1].id);
				$button.closest('.card').find('.current_quantity').val(1);
				console.log('card mode');
			};

			if(typeof item[1].offer !== 'undefined'){
				if($('.add_to_cart_block').attr('data-offer_id') == item[1].offer.id) {
					$('.add_to_cart_block').find('.current_quantity').val(item[1].amount);
					$('.add_to_cart_block').attr('data-order_id', item[1].id);
				}
				console.log('offer mode');
			}else{
				if($('.product').data('id') == item[1].page.id) {
					$('.add_to_cart_block').attr('data-order_id', item[1].id);
					$('.add_to_cart_block').find('.current_quantity').val(1);
					console.log('product mode');
				}
			}
		});
		if(site.TradeOffers.isAvailable()) {
			console.log('TradeOffers isAvailable');
			site.TradeOffers.basketOffers = data;
		}

		
		/*site.Cart.changeButtonHtml($button, getLabel('js-product-added-successfully-label'));

		setTimeout(function() {
			site.Cart.changeButtonHtml($button, getLabel('js-buy-button-label'));
		}, 1500)*/
	},

	/**
	 * Изменяет содержимое html кнопки
	 * @param {jQuery} $button кнопка товара "Купить"
	 * @param {string} html содержимое html кнопки
	 */
	changeButtonHtml: function($button, html) {
		$button.html(html);
	},

	/**
	 * Возвращает функцию, которая вызывается после обновления корзины в бекенде,
	 * @see js/client/basket.js, basket.__request()
	 * Функция отвечает за обновление фронтенда корзины - пересчет количества товаров, цен, скидок и т.д.
	 *
	 * @param {Number|String} id Идентификатор измененного товарного наименования
	 * @returns {Function}
	 */
	redraw: function(id) {
		return function(data) {
			if(site.TradeOffers.isAvailable()) {
				console.log('TradeOffers isAvailable');
				site.TradeOffers.basketOffers = data;
			}
			var orderItemCount = data.summary.amount || 0;

			if (orderItemCount > 0) {
				site.Cart.drawPopulatedCart(id, data);
			} else {
				site.Cart.drawEmptyCart();
			}

			site.Cart.updateOrderItemCount(orderItemCount);
			site.Cart.ready = true;
		};
	},

	/**
	 * Обновляет UI непустой корзины
	 * @param {Number|String} id Идентификатор измененного товарного наименования
	 * @param {Array} data данные корзины из бекенда
	 */
	drawPopulatedCart: function(id, data) {
		var formatPrice = site.helpers.formatPrice;
		var prefix = data.summary.price.prefix;
		var suffix = data.summary.price.suffix;

		var orderDiscount = data.summary.price.discount || 0;
		$('#order_discount').text(formatPrice(orderDiscount, prefix, suffix));

		var orderPrice = data.summary.price.actual || data.summary.price.original;
		$('#order_price2,.order_total').text(formatPrice(orderPrice, prefix, suffix));

		var orderItemsQty = data.summary.amount;
		$('.count-goods').text(orderItemsQty);

		var orderItemBlock = $('#order_item_' + id);
		var orderItemWasRemoved = true;

		_.each(data.items.item, function(orderItem) {
			if (orderItem.id != id) {
				return;
			}

			orderItemWasRemoved = false;
			var orderItemTotalPrice = formatPrice(orderItem["total-price"].actual, '', '');
			var discount = orderItem.discount ? orderItem.discount.amount : 0;
			var orderItemDiscount = (discount == 0) ? 0 : formatPrice(discount, '', '');

			$('.order_sum span', orderItemBlock).text(orderItemTotalPrice);
			$('.order_sale span', orderItemBlock).text(orderItemDiscount);
		});

		if (orderItemWasRemoved) {
			orderItemBlock.remove();
		}
	},

	/** Выводит на фронтенд пустую корзину */
	drawEmptyCart: function() {
		$.get('/templates/demomarket/js/cart/empty.html', function (data) {
			var emptyTemplate = _.template(data);
			var params = {
				'cart_empty': getLabel('js-cart_empty'),
				'return_to_catalog': getLabel('js-return_to_catalog')
			};

			$('.cart')
				.removeClass('cart')
				.addClass('cart-empty')
				.html(emptyTemplate(params));
		});
	},

	/**
	 * Обновляет информацию о количестве товаров в корзине в шапке сайта
	 * @param {Number} count новое количество товаров в корзине
	 */
	updateOrderItemCount: function (count) {
		var $itemCount = $('.order_item_count');
		if (count < 1 && $itemCount.hasClass('not_show')) {
			return;
		}

		$itemCount.each(function () {
			$(this).text(count);
		});
		$itemCount.removeClass('not_show');

		var cartHeader = getLabel('js-cart_header') + count;
		$('#basketTooltipToggle').text(cartHeader);
	},

	/**
	 * Отправляет аякс-запрос на изменение количества товарного наименования.
	 * Обновляет UI корзины.
	 *
	 * @param {number|string} id Идентификатор товарного наименования
	 * @param {number} newQuantity новое количество
	 * @param {number} oldQuantity предыдущее количество
	 */
	modify: function(id, newQuantity, oldQuantity) {
		if (newQuantity !== oldQuantity) {
			basket.modifyItem(id, {amount: newQuantity}, this.redraw(id));
		} else {
			this.ready = true;
		}
	},

	/**
	 * Отправляет аякс-запрос на удаление товарного наименования из корзины.
	 * Обновляет UI корзины.
	 *
	 * @param {number|string} id Идентификатор товарного наименования - числовое значение или ключевая строка `all`
	 */
	remove: function(id) {
		if (id === 'all') {
			basket.removeAll(this.redraw(id));
		} else {
			basket.removeItem(id, this.redraw(id));
		}
	}
};

$(function() {
	site.Cart.init();
});

})(window, jQuery, _, getLabel);
