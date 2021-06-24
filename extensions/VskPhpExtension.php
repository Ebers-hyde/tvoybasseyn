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
			if($page->getObjectTypeId()==195||$page->getObjectTypeId()==270) $default = 'content/pools/page'; // Страница бассейна
			if($page->getObjectTypeId()==228) $default = 'content/pools/equipment'; // Оборудование
			if($page->getObjectTypeId()==233) $default = 'content/pools/category_sbor'; // Сборный бассейн
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
		public function vsk_objByType($type, $where = [], $limit = 100, $method = 'equals', $ord = 'asc') {
            $sel = new selector('objects');
            $sel->types('object-type')->id($type);
            if($where){
				if(!empty($where['list'])){
					foreach($where['list'] as $w){
						if($w[2]=='isnotnull')
							$sel->where($w[0])->isnotnull();
						else if($w[2]=='equals')
							$sel->where($w[0])->equals($w[1]);
						else if($w[2]=='notequals')
							$sel->where($w[0])->notequals($w[1]);
					}
				}else{
					if($method=='isnotnull')
						$sel->where($where[0])->isnotnull();
					else if($method=='equals')
						$sel->where($where[0])->equals($where[1]);
					else if($method=='notequals')
						$sel->where($where[0])->notequals($where[1]);
				}
            }
            $sel->limit(0,$limit);
			if($ord == 'asc')
				$sel->order('ord')->asc();
			else
				$sel->order('ord')->desc();

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

		private function notion_cURL($url = '',$post = false){
			$data = '{"sorts": [{"timestamp":"last_edited_time","direction":"descending"}]}';
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(
					'Authorization: Bearer secret_Gs5E1YbOWqiBJxLbF6Xaa94dGnTJyfGHZd3ykhxKT9I',
					'Content-Type: application/json',
					'Notion-Version: 2021-05-13'
				));
			if($post){
				curl_setopt($ch, CURLOPT_POST, 1);
				curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			}
			$html = curl_exec($ch);
			curl_close($ch);
			return $html;
		}

		public function notion_propVal($prop){
			if (!empty($prop['rich_text'])) {
				return $prop['rich_text'][0]['plain_text'];
			}
			if (!empty($prop['title'])) {
				return $prop['title'][0]['plain_text'];
			}
			if (!empty($prop['text'])) {
				return $prop['text'][0]['plain_text'];
			}
			if (!empty($prop['select'])) {
				return $prop['select']['name'];
			}
			if (!empty($prop['number'])) {
				return $prop['number'];
			}			
			if (!empty($prop['rollup'])) {
				return $this->notion_propVal($prop['rollup']['array'][0]);
			}
			if (!empty($prop['date'])) {
				return $prop['date']['start'];
			}
			if (!empty($prop['relation'])) {
				return $this->notion_getPage($prop['relation'][0]['id']);
			}
			if (!empty($prop['multi_select'])) {
				$return = [];
				foreach($prop['multi_select'] as $item){
					$return[] = $item['name'];
				}
				return $return;
			}
			return '';
		}
		
		public function notion_findRelation($prop){
			$sel = new selector('objects');
			
			$sel->types('object-type')->id(270);
			$sel->types('object-type')->id(272);
			$sel->types('object-type')->id(274);
			
			$sel->where('notion_id')->equals($prop);
			$sel->limit(0,1);
			$sel->order('ord')->asc();
			
			return $sel->result[0];
		}
		
		public function notion_getDatabase($id){
			return json_decode($this->notion_cURL('https://api.notion.com/v1/databases/'.$id.'/query',true),true);
		}
		public function notion_getPage($id){
			return json_decode($this->notion_cURL('https://api.notion.com/v1/pages/'.$id),true);
		}
		public function notion_getPageContent($id){
			return json_decode($this->notion_cURL('https://api.notion.com/v1/blocks/'.$id.'/children?page_size=100'),true);
		}
		
		public function updateCompositeList($page,$notion_equipment){
			$arr =[];
			$i = 1;
			foreach($notion_equipment['results'] as $item){
				$arr[] = array(
					'int' => $i++,
					'rel' => $this->notion_propVal($item['properties']['Name']),
					'float' => $this->notion_propVal($item['properties']['Сумма']),
					'varchar' => $this->notion_propVal($item['properties']['Описание'])
				);
			}
			$page->setValue('varianty_sotrudnichestva',$arr);
			$page->commit();
			
		}
		
		
		public function updateEquipmentList($typeId,$notion_equipment){
			$uoc = umiObjectsCollection::getInstance();
			$removeList = [];
			$arr = $uoc->getGuidedItems($typeId);
				
			foreach($notion_equipment['results'] as $item){
				$sale = isset($item['properties']['Скидка'])?$item['properties']['Скидка']:0;
				$price = isset($item['properties']['Цена за шт.'])?$item['properties']['Цена за шт.']:0;
				$count = isset($item['properties']['Количество'])?$item['properties']['Количество']:0;
				$data = [
					'typeId' => $typeId,
					'product' => $item['properties']['Товар']['relation'][0]['id'],
					'sale' => $sale?$this->notion_propVal($item['properties']['Скидка']):0,
					'unit' => $this->notion_propVal($item['properties']['усл ед'])?:'шт.',
					'price' => $price?$this->notion_propVal($item['properties']['Цена за шт.']):0,
					'price_default' => $this->notion_propVal($item['properties']['Цена по умолчанию']),
					'count' => $count?$this->notion_propVal($item['properties']['Количество']):1
				];

				if (in_array($item['properties']['Товар']['relation'][0]['id'], $arr)) {
					$keys = array_keys($arr, $item['properties']['Товар']['relation'][0]['id']);
					$this->updateProduct($keys[0],$data);
				}else{
					$id = $this->addProduct($data);
					$this->updateProduct($id,$data);
				}
				$removeList[$item['properties']['Товар']['relation'][0]['id']] = '';
			}
			
			foreach($arr as $key=>$item){
				if(!array_key_exists($item,$removeList)) {
					echo '<br>'.$item.' removed';
					$uoc->delObject($key);
				}
			}
		}
		
		private function updateProduct($id,$data){
			echo '<h2>Update:</h2>';
			print_r($data);
			$uoc = umiObjectsCollection::getInstance();
			$obj = $uoc->getObject($id);
			$obj->setName($data['product']);
			$obj->setValue('product_name',$data['product']);
			$obj->setValue('kolichestvo',$data['count']);
			$obj->setValue('sale',$data['sale']);
			$obj->setValue('cena',$data['price']?:$data['price_default']);
			$obj->setValue('unit',$data['unit']);
			$obj->commit();
		}
		private function addProduct($data){
			if(empty($data['typeId'])) return false;
			if(empty($data['product'])) return false;
			$uoc = umiObjectsCollection::getInstance();
			return $uoc->addObject($data['product'],$data['typeId']);
		}


    } 

?>