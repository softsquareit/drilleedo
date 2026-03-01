





const Ace = function() {


    
    
    

    
    const _componentAce = function() {
        if (typeof ace == 'undefined') {
            console.warn('Warning - ace.js is not loaded.');
            return;
        }

        
        ace.config.set('theme', 'ace/theme/limitless');
        ace.config.set('showPrintMargin', false);

        
        const js_editor = ace.edit('javascript_editor', {
            mode: 'ace/mode/javascript'
        });

        
        const html_editor = ace.edit('html_editor', {
            mode: 'ace/mode/html'
        });

        
        const css_editor = ace.edit('css_editor', {
            mode: 'ace/mode/css'
        });


        
        const json_editor = ace.edit('json_editor', {
            mode: 'ace/mode/json'
        });


        
        const less_editor = ace.edit('less_editor', {
            mode: 'ace/mode/less'
        });


        
        const php_editor = ace.edit('php_editor', {
            mode: 'ace/mode/php'
        });


        
        const ruby_editor = ace.edit('ruby_editor', {
            mode: 'ace/mode/ruby'
        });


        
        const sass_editor = ace.edit('sass_editor', {
            mode: 'ace/mode/sass'
        });


        
        const coffee_editor = ace.edit('coffee_editor', {
            mode: 'ace/mode/coffee'
        });


        
        const handlebars_editor = ace.edit('handlebars_editor', {
            mode: 'ace/mode/handlebars'
        });
    };


    
    
    

    return {
        init: function() {
            _componentAce();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    Ace.init();
});
