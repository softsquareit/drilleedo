





const I18nextCallbacks = function() {


    
    
    

    
    const _componentNoty = function(message) {
        if (typeof Noty == 'undefined') {
            console.warn('Warning - noty.min.js is not loaded.');
            return;
        }

        
        new Noty({
            text: message,
            type: 'info',
            theme: 'limitless',
            layout: 'topRight',
            timeout: 2500
        }).show();
    };

    
    const _componentI18nextCallbacks = function() {
        if (typeof i18next == 'undefined') {
            console.warn('Warning - i18next.min.js is not loaded.');
            return;
        }


        
        

        
        const elements = document.querySelectorAll('.language-switch .dropdown-item'),
            selector = document.querySelectorAll('[data-i18n]'),
            englishLangClass = 'en',
            ukrainianLangClass = 'ua';

        
        i18next.use(i18nextHttpBackend).use(i18nextBrowserLanguageDetector).init({
            backend: {
                loadPath: '../../../assets/demo/locales/{{lng}}.json'
            },
            debug: true,
            fallbackLng: 'en'
        },
        function (err, t) {
            selector.forEach(function(item) {
                item.innerHTML = i18next.t(item.getAttribute("data-i18n"));
            });
        });



        
        

        
        i18next.on('initialized', function() {

            
            _componentNoty('i18Next has been initialized. <br> The following language has beed detected: ' + '<span class="fw-semibold text-uppercase">' + i18next.language + '</span>');

            
            if(i18next.language == "en") {
                document.querySelector('.' + englishLangClass).classList.add('active');
                document.querySelector('.language-switch .navbar-nav-link').innerHTML = document.querySelector('.' + englishLangClass).innerHTML;
            }

            
            if(i18next.language == "ua") {
                document.querySelector('.' + ukrainianLangClass).classList.add('active');
                document.querySelector('.language-switch .navbar-nav-link').innerHTML = document.querySelector('.' + ukrainianLangClass).innerHTML;
            }

            
            document.querySelector('.language-switch .navbar-nav-link span').classList.add('d-none', 'd-lg-inline-block', 'me-1');
        });


        
        

        elements.forEach(function(toggler) {
            toggler.addEventListener('click', function(e) {

                
                elements.forEach(function(link) {
                    link.classList.remove('active');
                });
                toggler.classList.add('active');

                
                toggler.closest('.language-switch').querySelector('.navbar-nav-link').innerHTML = toggler.innerHTML;
                toggler.closest('.language-switch').querySelector('.navbar-nav-link span').classList.add('d-none', 'd-lg-inline-block', 'me-1');

                
                _componentNoty('Language has been changed to: ' + '<span class="font-weight-semibold text-uppercase">' + i18next.language + '</span>');

                
                i18next.on('languageChanged', function() {
                    selector.forEach(function(item) {
                        item.innerHTML = i18next.t(item.getAttribute("data-i18n"));
                    });
                });

                
                toggler.classList.contains(englishLangClass) && i18next.changeLanguage('en');
                toggler.classList.contains(ukrainianLangClass) && i18next.changeLanguage('ua');
            });
        });
    };


    
    
    

    return {
        init: function() {
            _componentI18nextCallbacks();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    I18nextCallbacks.init();
});
