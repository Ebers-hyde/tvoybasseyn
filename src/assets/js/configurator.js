const optionWindows = document.querySelectorAll('.toggling_module');
const infoBlocks = document.querySelectorAll('.window_info');
const infoIcons = document.querySelectorAll('.info_icon-container');
const poolWindow = document.querySelector('.pool_window');
const configuratorMain = document.querySelector('.configurator');
const pools = document.querySelector('.configurator__pools');
const togglingPools = document.querySelectorAll('.toggle_pool');
const changeIcons = document.querySelectorAll('.change_icon');




const configurator = {
    showElem: function(elems, idx = 0) {
        elems[idx].style.display = "flex"; 
    },
    hideElem: function(elems, idx) {
        elems[idx].style.display = "none";
    },
    toggleBlock: function(hidden, active) {
        hidden.classList.remove('active');
        active.classList.add('active');
        window.moveTo(0, 0);
    }
}

if(configuratorMain) {   
    poolWindow.onclick = function() {
        configurator.toggleBlock(configuratorMain, pools);
    }

    optionWindows.forEach(function(window, idx) {
        window.onmouseenter = function() {
            configurator.showElem(changeIcons, idx);
        }
        window.onmouseleave = function() {
            configurator.hideElem(changeIcons, idx);
        }
    });

    infoIcons.forEach(function(icon, idx) {
        icon.onmouseenter = function() {
            configurator.showElem(infoBlocks, idx);
        };
        icon.onmouseleave = function() {
            configurator.hideElem(infoBlocks, idx);
        };
    });
} 

if(pools) {
    togglingPools.forEach(pool => {
        pool.onclick = function() {
            console.log(pool);
            poolWindow.innerHTML = pool.innerHTML;
            poolWindow.classList.remove("toggle_pool");
            configurator.toggleBlock(pools, configuratorMain);
        }
    });
}



