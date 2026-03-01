





const I18nextQuery = function() {


    
    
    

    
    const _componentI18nextQuery = function() {
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
    };


    
    
    

    return {
        init: function() {
            _componentI18nextQuery();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    I18nextQuery.init();
});
