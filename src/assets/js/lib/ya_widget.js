(function () {
    window['yandexChatWidgetCallback'] = function() {
        try {
            window.yandexChatWidget = new Ya.ChatWidget({
                guid: 'beb3bb03-4b7a-9aca-7ea0-7b1b45462520',
                buttonText: 'Мессенджер',
                title: 'Чат с оператором',
                theme: 'light',
                collapsedDesktop: 'never',
                collapsedTouch: 'always'
            });
        } catch(e) { }
    };
    var n = document.getElementsByTagName('script')[0],
        s = document.createElement('script');
    s.async = true;
    s.charset = 'UTF-8';
    s.src = 'https://yastatic.net/s3/chat/widget.js';
    n.parentNode.insertBefore(s, n);
})();