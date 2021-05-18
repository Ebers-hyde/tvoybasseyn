var likes = {
    init: function() {
        $("body").on("click", ".comparisons--heart", function() {
            $(this).hasClass("comparisons__active") ? (likes.removeElement($(this).closest(".product").data("id")),
            $(this).removeClass("comparisons__active")) : (likes.putElement($(this).closest(".product").data("id")),
            $(this).addClass("comparisons__active"))
        });
        $("body").on("click", ".card__heart", function() {
            $(this).hasClass("card__heart--active") ? (likes.removeElement($(this).closest(".card").data("element_id")),
            $(this).removeClass("card__heart--active")) : (likes.putElement($(this).closest(".card").data("element_id")),
            $(this).addClass("card__heart--active"))
        });

        $(".card__plus").on("click", function() {
            if($(this).hasClass('card__plus--active')) {
                $.ajax({
                    url: `/emarket/removeFromCompare/${$(this).data('element_id')}.json`,
                    type: 'GET',
                    success: () => {
                        console.log(124);
                        $(this).removeClass("card__plus--active");
                    }
                })
            } else {
                $.ajax({
                    url: `/emarket/addToCompare/${$(this).data('element_id')}.json`,
                    type: 'GET',
                    success: () => {
                        console.log(123);
                        $(this).addClass("card__plus--active");
                    }
                })
            }
        });

        if(JSON.parse(unescape($.cookie('favorites'))).indexOf($(".product").data("id")) != -1)
        {  
            $(".comparisons--heart").addClass("comparisons__active");
            $(".comparisons--heart span").html("В&nbsp;избранном");
        }

        console.log();
    },
    putElement: function(e) {
        var t = $.cookie('favorites');
        if(t == null){ 
            t = new Array; 
            t.push(parseInt(e)); 
        }else{
            t = JSON.parse(unescape(t));
            if(t.indexOf(e) == -1)
                t.push(parseInt(e));
        }
        $.cookie('favorites',JSON.stringify(t), { path: '/' });
        $(".product[data-id='"+e+"'] .comparisons--heart span").html("В&nbsp;избранном");
        console.log(t);
    },
    removeElement: function(e) {
        var t = $.cookie('favorites');
        let n = -1;
        if(t == null) {
            t = new Array;
        }else{
            t = JSON.parse(unescape(t));
            n = t.indexOf(e);
            if(n > -1){
                t.splice(n, 1);
                $('#catalog_category .card[data-element_id="'+e+'"]').remove();
            }

        }
        console.log(t);
        $(".product[data-id='"+e+"'] .comparisons--heart span").html("В&nbsp;избранное");
        $.cookie("favorites", JSON.stringify(t), { path: '/' });
    }
};

likes.init();