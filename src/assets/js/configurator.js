const Configurator = class {
    constructor() {
        this.configuratorMain = null;
        this.configuratorPools = null;
        this.optionWindows = null;
        this.infoBlocks = null;
        this.infoIcons = null;
        this.poolWindow =  null;
        this.options = null;
        this.equipmentLists = null;
        this.changeIcons = null;
        this.popupWindows = null;
        this.configuratorPopup = null;
        this.popupGrid = null;
        this.togglingPools = null;
        this.variants = null;
        this.modelQuery = window.location.search ? window.location.search : null;
        this.currentModel = '';
        this.poolJson = {
            "supreme_6530": {
                "name": 'Supreme 6530',
                "price": '410 000',
                "img": "/images/catalog/abpool/supreme_6530/left/S6530.svg",
                "length": "6.5",
                "width": "3",
                "depth": "1.7"
            },
            "hugo_4222": {
                "name": 'Hugo 4222',
                "price": '240 000',
                "img": "/images/catalog/abpool/hugo_4222/left/H4222.svg",
                "length": "4.2",
                "width": "2.2",
                "depth": "1.5"
            }
        }
    }

    init() {
        this.configuratorMain = document.querySelector('.configurator') ? document.querySelector('.configurator') : null;
        this.configuratorPools = document.querySelector('.configurator__pools') ? document.querySelector('.configurator__pools'): null;
        this.togglingPools = document.querySelectorAll('.toggle_pool') ? document.querySelectorAll('.toggle_pool') : null;
        this.options = document.querySelectorAll('.configurator__option');
        this.optionWindows = document.querySelectorAll('.configurator__option-window:not(.option_variant .configurator__option-window)');
        this.variants = document.querySelector('.option_variant');
        this.equipmentLists = document.querySelectorAll('.equipment_list');
        this.infoBlocks = document.querySelectorAll('.window_info'); 
        this.infoIcons = document.querySelectorAll('.info_icon-container');
        this.poolWindow = document.querySelector('.pool_window');
        this.changeIcons = document.querySelectorAll('.change_icon');
        this.popupWindows = document.querySelectorAll('.popup_window');
        this.configuratorPopup = document.querySelector('#configurator_popup');
        this.popupGrid = this.configuratorPopup.querySelector('.configurator__equipment-grid');

        if(this.modelQuery !== null) {
            let modelId = this.modelQuery.split("=", 2)[1];
            if(this.poolJson[modelId]) {
                this.currentModel = modelId;
                this.poolWindow.innerHTML = `
            <span class="series__modelName">${this.poolJson[modelId].name}</span>
                <img class="series__modelImage" src="${this.poolJson[modelId].img}">
                <span class="series__modelPrice">${this.poolJson[modelId].price} ₽</span>
                <div class="product__specifications">
                    <p class="product__specifications-item">Длина — <span>${this.poolJson[modelId].length} м</span></p>
                    <p class="product__specifications-item">Ширина — <span>${this.poolJson[modelId].width} м</span></p>
                    <p class="product__specifications-item">Глубина — <span>${this.poolJson[modelId].depth} м</span></p>
            </div>
            `
            this.configuratorPools.classList.remove('configurator__pools--active');
            this.configuratorMain.classList.add('configurator--active');
            }
        }

        this.poolWindow.onclick = () => {            
            this.configuratorMain.classList.remove('configurator--active');
            this.configuratorPools.classList.add('configurator__pools--active');
        }

        this.optionWindows.forEach(optionWindow => {
            optionWindow.onmouseover = (event) => {
                this.showElem(optionWindow.querySelector('.change_icon'));
                if(event.target.classList.contains('info_icon-container')){
                    this.showElem(optionWindow.querySelector('.window_info'));
                }else{
                    this.hideElem(optionWindow.querySelector('.window_info')); 
                }       
            }
            optionWindow.onmouseleave = () => {
                this.hideElem(optionWindow.querySelector('.change_icon'));
                this.hideElem(optionWindow.querySelector('.window_info'));
            }
    
            optionWindow.onclick = (e) => {
                let group_id = optionWindow.dataset.window_id;
                let section_id = optionWindow.closest('.equipment_list').dataset.section;
                if( window.json[section_id].groups[group_id].action=='show_popup'){
                    show_popup('configurator_popup');
                    let index = 1;
                    console.log(group_id);
                    let items = window.json[section_id].groups[group_id].items;
                    for (let i in items) {
                        if(typeof items[i].prices[this.currentModel] === 'undefined') continue;
                        this.popupGrid.querySelector('.popup-form__item:nth-child('+index+')').innerHTML = `<div class="configurator__option-window configurator__option-window_modified toggling_module">
                            <div class="info_icon-container">
                                <svg class="info_icon" width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="9.29319" cy="9.29319" r="8.79319" fill="white" />
                                    <path d="M8.47921 7.23784H10.38L10.304 14.2077H8.40318L8.47921 7.23784ZM9.4372 5.89969C9.09253 5.89969 8.80361 5.79325 8.57045 5.58036C8.33728 5.35734 8.2207 5.08363 8.2207 4.75923C8.2207 4.43483 8.33728 4.16618 8.57045 3.9533C8.80361 3.73027 9.09253 3.61876 9.4372 3.61876C9.78188 3.61876 10.0708 3.7252 10.304 3.93809C10.5371 4.14084 10.6537 4.39935 10.6537 4.71361C10.6537 5.04815 10.5371 5.33199 10.304 5.56516C10.0809 5.78818 9.79201 5.89969 9.4372 5.89969Z" fill="#CBCBCB" />
                                </svg>
                            </div>
                            <div class="window_info">
                                <p>${items[i].hint}</p>
                            </div>
                            <div><span>${items[i].name}</span></div>
                            <div><span>${items[i].prices[this.currentModel]} ₽</span></div>
                            <img class='option-window_country' src="${items[i].img}" alt="">
                            <div class="change_icon"><img src="dist/assets/images/configurator/icons/change.svg" style="width: 289px;max-width: 289px;height: 100%;" alt=""></div>
                        </div>`;
                        index++;
                    }
                    this.configuratorPopup.querySelector('input[name="window_id"]').value = optionWindow.dataset.window_id;
                }else{
                    document.querySelector(`.configurator__equipment[data-section="${window.json[section_id].groups[group_id].target_section}"`).classList.toggle('configurator__equipment--active');
                    optionWindow.classList.toggle('active');
                }
               
            }

            this.variants.onclick = (event) => {
                
                document.querySelectorAll('.equipment_list').forEach(list => {
                    list.style.display = "block";
                });
                this.variants.querySelectorAll('.configurator__option-window').forEach(window => {
                    window.classList.remove('active');
                });
                event.target.closest('.configurator__option-window').classList.add('active');
                // let target = event.target.closest('.configurator__option-window');
                // console.log(target);
                // if(target.classList.contains('configurator__option-window')) {
                //     target.style.borderColor = "#4081ff";
                //     this.options[2].classList.add('configurator__option--active');
                //     this.equipmentLists.forEach(list => {
                //         list.classList.add('configurator__equipment--active');
                //     })
                // } else {
                //     return
                // }
            }

            /*this.variants.forEach(variant => {
                variant.onclick = () => {
                    this.variants.forEach(variant => {
                        variant.style.borderColor = "#e5e5e5"
                    })
                    variant.style.borderColor = "#4081ff";
                    this.options[2].classList.add('configurator__option--active');
                    this.equipmentLists.forEach(list => {
                        list.classList.add('configurator__equipment--active');
                    })
                }
            })*/
            
            // this.extraEquipment.querySelectorAll('.configurator__option-window').forEach(option => {
            //     option.onclick = function() {
            //         if(document.querySelector(`#${option.dataset.eq_id}`)) {
            //             document.querySelector(`#${option.dataset.eq_id}`).classList.add('configurator__equipment--active');
            //         }
            //     }
            // })

            this.configuratorPopup.querySelectorAll('.popup-form__item').forEach(form__item => {
                form__item.onclick = () =>{
                    let popupWindow = document.querySelector('.configurator__option-window[data-window_id="'+this.configuratorPopup.querySelector('input[name="window_id"]').value+'"]');
                    popupWindow.innerHTML = form__item.querySelector('.configurator__option-window').innerHTML;
                    popupWindow.classList.add('configurator__option-window_modified');
                    close_popup('configurator_popup');
                }
                form__item.onmouseover = (event) => {
                    if(event.target.classList.contains('info_icon-container')){
                        this.showElem(form__item.querySelector('.window_info')); 
                    }else{
                        this.hideElem(form__item.querySelector('.window_info')); 
                    }
                    
                }
                form__item.onmouseleave = () => {
                    this.hideElem(form__item.querySelector('.change_icon'));
                    this.hideElem(form__item.querySelector('.window_info')); 
                }
            });
         
            this.togglingPools.forEach(pool => {
                pool.onclick = () => {
                    this.currentModel = pool.dataset.id;
                    this.poolWindow.innerHTML = pool.innerHTML;
                    this.poolWindow.classList.remove("toggle_pool");
                    this.configuratorPools.classList.remove('configurator__pools--active');
                    this.configuratorMain.classList.add('configurator--active');
                    window.history.replaceState(null, 'Конфигуратор', `https://tvoybasseyn.ru/pools_catalog/konfgurator?model=${pool.dataset.id}`);
                }
            });
            
        });
    }

    showElem(elem) {
        if(elem) {
            elem.style.display = "flex";
        }
    }

    hideElem(elem) {
        if(elem) {
            elem.style.display = "none";
        }
    }
}

if(document.querySelector('.configurator')) new Configurator().init();