<?php
	use UmiCms\Service;
	use UmiCms\System\Trade\iOffer;
	use UmiCms\System\Trade\Offer\iPrice;
	use UmiCms\System\Trade\Offer\iMapper;
	use UmiCms\System\Orm\Entity\iCollection;
	use UmiCms\System\Trade\Offer\iCharacteristic;
	use UmiCms\System\Trade\Offer\Price\iCurrency;
	use UmiCms\Classes\System\Utils\Captcha\Strategies\GoogleRecaptcha;

	class VskPhpExtension extends ViewPhpExtension {
        public function renderPages($page) {
			$default = 'content/default';
			if($page->getObjectTypeId()==195) $default = 'content/pools/page'; // Страница бассейна
			if($page->getObjectTypeId()==228) $default = 'content/catalog/equipment'; // Оборудование
			if($page->getObjectTypeId()==233) $default = 'content/catalog/category_sbor'; // Сборный бассейн
			if(!empty($custom_page = $page->getValue('shablon'))){ 
				return $custom_page;
			}
			return $default;
		}
		
		public function vsk_objById($ids){
            if(empty($ids)) return false;
            if(!is_array($ids)){
                return umiObjectsCollection::getInstance()->getObject($ids);
            }
            return umiObjectsCollection::getInstance()->getObjectList($ids);
        }
 
        // Получить универсальный список объектов отсортированный в админке
		public function vsk_objByType($type, $where = false, $limit = 100) {
            $sel = new selector('objects');
            $sel->types('object-type')->id($type);
            if($where){
                $sel->where($where[0])->equals($where[1]);
            }
            $sel->limit(0,$limit);
            $sel->order('ord')->asc();

			return $sel->result;
		}

		public function vsk_pageByType($ids = false, $limit = 100) {
            $sel = Service::SelectorFactory()->createPageTypeName('catalog', 'object');
            if($ids){
				$sel->where('id')->equals($ids);
			}
			$sel->option('load-all-props')->value(true);
            $sel->limit(0,$limit);
            $sel->order('ord')->asc();

			return $sel->result;
		}
        
        public function multiRender($variables, $templates) {
            if(!is_array($templates)) $templates = [$templates];
            $td = (string)cmsController::getInstance()->getTemplatesDirectory();
            foreach($templates as $template){
                if(is_readable($td . $template . '.phtml')) {
                    return umiTemplater::create('PHP')->render($variables,$template);
                }
            }
        }

		public function findPositionInList($list, $position) {
			foreach($list["items"] as $item) {
                if(strpos($item->name, $position) !== false) {
                    return true;
                }
            }
			return false;
		}

        public function getProductsListFromCategory($parent_id = false, $limit = false) {
			$hierarchy = umiHierarchy::getInstance();
			$sel = new selector('pages');
			$sel->option('or-mode',true); 
			$sel->types('hierarchy-type')->name('content', 'page');
		 
			if(!$parent_id) {
				$category_url = explode('?', $_SERVER['REQUEST_URI']);
				$parent_id = $hierarchy->getIdByPath($category_url[0]);
			}
		 
			if(!is_numeric($parent_id)) {
				$parent_id = $hierarchy->getIdByPath($parent_id);
			}
		 
			if($parent_id && is_numeric($parent_id))
				$sel->where('hierarchy')->page($parent_id)->childs(1);
			else
				return array(
					'error' => 'Укажите id категории или передайте путь к категории'
				);
		 
			// Расскоментировть и указать поля для сортировки товаров по умолчанию
			$sel->order('ord')->desc();
			if(getRequest('fields_filter'))
				selectorHelper::detectFilters($sel);
			
			if(getRequest('order_filter'))
				selectorHelper::detectOrderFilters($sel);

			$per_page = ($limit) ? $limit : $this->per_page;
			$curr_page = getRequest('p');
		 
			if(!$curr_page or $curr_page == 0)
				$offset = 0;
			else
				$offset = ($per_page * $curr_page);
		 
			$sel->limit($offset, $per_page);
		 
			$lines['items'] = $sel->result;
			$lines['total'] = $sel->length;
			$lines['category_id'] = $parent_id;
			$lines['nodes:category_h1'] = $hierarchy->getElement($parent_id)->getValue('h1');
			$lines['per_page'] = $per_page;
			$lines['nodes:numpages'] = umiPagenum::generateNumPage($sel->length, $per_page);
			return def_module::parseTemplate('', $lines);
		}

        
        public function getPicPath(iUmiHierarchyElement $product,$pic = 'menu_pic_a') {
			/** @var iUmiImageFile $photo */
			$photo = $product->getValue($pic);

			if ($photo instanceof iUmiImageFile) {
				return $photo->getFilePath(true);
			}

			return $this->noPhotoPath;
		}


		public function thumb($img,$width='auto',$height='auto'){
			$return = array(); 
			if(!is_array($img)) $img = [$img];
			foreach($img as $item){
				
			if($item){
				$src = (is_object($item))?$item->getFilePath():'.'.$item;
				$thumbnail = $this->macros(
					'system',
					'makeThumbnailFull',
					[
						'path' => $src,
						'width' => $width,
						'height' => $height,
						'default',
						true
					]
				);
				$return[] = $thumbnail['src'];
			}else{
				$return[] = $this->noPhotoPath;
			}	
		}
		//	if(count($return)==1) $return = $return[0];
			return $return;
		}

		public function setcurrency($currencyCode = 'RUR'){
			$inst = cmsController::getInstance()->getModule("emarket");
		   
			$selectedCurrency = $inst->getCurrency($currencyCode);
		  
			if ($currencyCode && $selectedCurrency) {
				$defaultCurrency = $inst->getDefaultCurrency();
		
				if (permissionsCollection::getInstance()->isAuth()){
					$customer = customer::get();
					if($customer->preffered_currency != $selectedCurrency->id) {
						if($selectedCurrency->id == $defaultCurrency->id) {
							$customer->preffered_currency = null;
						} else {
							$customer->preffered_currency = $selectedCurrency->id;
						}
						$customer->commit();
					}
				} else {
					setcookie('customer_currency', $selectedCurrency->id, (time() + 2678400), '/');
				}
			}
		}

		public function vsk_currency($old='EUR',$new='RUR',$price=0,$float = false){
			$cf = Service::CurrencyFacade();
			$currencyOld = $cf->getByCode($old);
			$currency = $cf->getByCode($new);
			$pavPrice = $cf->calculate($price,$currencyOld,$currency); 
			if($float) return $pavPrice;
			return number_format($pavPrice, 0, ',', '&nbsp;').'&nbsp;₽';
		}

		public function getCookie($field) {
			$cookieJar = Service::CookieJar();
			return $cookieJar->get($field);
		}


    } 

?>