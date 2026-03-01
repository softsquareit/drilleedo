





const Trumbowyg = function() {


    
    
    

    
    const _componentTrumbowyg = function() {
        if (!$().trumbowyg) {
            console.warn('Warning - trumbowyg.min.js is not loaded.');
            return;
        }

        
        $.trumbowyg.svgPath = '../../../assets/js/vendor/editors/trumbowyg/ui/icons.svg';

        
        $('#trumbowyg_default').trumbowyg();

        
        $('#trumbowyg_custom').trumbowyg({
            btns: [
                
                ['strong', 'em'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                ['unorderedList', 'orderedList'],
                ['undo', 'redo'], 
                ['insertImage', 'link'],
                ['viewHTML'],
                ['fullscreen']
            ]
        });

        
        $('#trumbowyg_plugins').trumbowyg({
            btns: [
                ['base64'],
                ['foreColor', 'backColor'],
                ['insertAudio'],
                ['noembed'],
                ['preformatted'],
                ['template'],
                ['upload'],
                ['fullscreen']
            ],
            plugins: {
                templates: [
                    {
                        name: 'Template 1',
                        html: '<p>I am a template!</p>'
                    },
                    {
                        name: 'Template 2',
                        html: '<p>I am a different template!</p>'
                    }
                ],
                upload: {
                    serverPath: '',
                    fileFieldName: 'image',
                    headers: {
                        '': ''
                    },
                    urlPropertyName: ''
                }
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentTrumbowyg();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    Trumbowyg.init();
});
