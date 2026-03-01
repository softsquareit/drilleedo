





const I18nextFallback = function() {


    
    
    

    
    const _componentNoty = function(lang) {
        if (typeof Noty == 'undefined') {
            console.warn('Warning - noty.min.js is not loaded.');
            return;
        }

        
        new Noty({
            text: '<span class="text-uppercase">"' + lang + '"</span>' + ' locale is missing. Loading fallback language.',
            type: 'error',
            theme: 'limitless',
            layout: 'topRight',
            timeout: 2500
        }).show();
    };

    
    const _componentI18nextFallback = function() {
        if (typeof i18next == 'undefined') {
            console.warn('Warning - i18next.min.js is not loaded.');
            return;
        }


        
        

        
        const elements = document.querySelectorAll('.language-switch .dropdown-item'),
            selector = document.querySelectorAll('[data-i18n]'),
            englishLangClass = 'en',
            spanishLangClass = 'es',
            italianLangClass = 'it';

        
        i18next.use(i18nextHttpBackend).use(i18nextBrowserLanguageDetector).init({
            backend: {
                loadPath: '../../../assets/demo/locales/{{lng}}.json'
            },
            load: 'languageOnly',
            debug: true,
            fallbackLng: 'en'
        },
        function (err, t) {
            selector.forEach(function(item) {
                item.innerHTML = i18next.t(item.getAttribute("data-i18n"));
            });
        });


        
        

        
        i18next.on('initialized', function() {

            
            if(i18next.language == "en") {
                document.querySelector('.' + englishLangClass).classList.add('active');
                document.querySelector('.language-switch .navbar-nav-link').innerHTML = document.querySelector('.' + englishLangClass).innerHTML;
            }

            
            if(i18next.language == "es") {
                _componentNoty(i18next.language);

                document.querySelector('.' + spanishLangClass).classList.add('active');
                document.querySelector('.language-switch .navbar-nav-link').innerHTML = document.querySelector('.' + spanishLangClass).innerHTML;
            }

            
            if(i18next.language == "it") {
                _componentNoty(i18next.language);

                document.querySelector('.' + italianLangClass).classList.add('active');
                document.querySelector('.language-switch .navbar-nav-link').innerHTML = document.querySelector('.' + italianLangClass).innerHTML;
            }

            
            document.querySelector('.language-switch .navbar-nav-link span').classList.add('d-none', 'd-lg-inline-block', 'me-1');
        });
    };


    
    
    

    return {
        init: function() {
            _componentI18nextFallback();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    I18nextFallback.init();
});
