





const DragAndDrop = function() {


    
    
    

    
    const _componentDragula = function() {
        if (typeof dragula == 'undefined') {
            console.warn('Warning - dragula.min.js is not loaded.');
            return;
        }

        
        dragula([document.getElementById('cards-target-left'), document.getElementById('cards-target-right')]);

        
        dragula([document.getElementById('forms-target-left'), document.getElementById('forms-target-right')]);

        
        dragula([document.getElementById('media-list-target-left'), document.getElementById('media-list-target-right')], {
            mirrorContainer: document.querySelector('.media-list-container'),
            moves: function (el, container, handle) {
                return handle.classList.contains('dragula-handle');
            }
        });


        
        
        

        
        
        const containers = Array.from(document.querySelectorAll('.dropdown-menu-sortable'));

        
        dragula(containers, {
            mirrorContainer: document.querySelector('.dropdown-menu-sortable')
        });


        
        
        

        
        dragula([document.getElementById('tabs-target-left')], {
            mirrorContainer: document.querySelector('#tabs-target-left')
        });

        
        dragula([document.getElementById('tabs-target-right')], {
            mirrorContainer: document.querySelector('#tabs-target-right')
        });

        
        dragula([document.getElementById('tabs-solid-target-left')], {
            mirrorContainer: document.querySelector('#tabs-solid-target-left')
        });

        
        dragula([document.getElementById('tabs-solid-target-right')], {
            mirrorContainer: document.querySelector('#tabs-solid-target-right')
        });


        
        
        

        
        dragula([document.getElementById('pills-target-left')], {
            mirrorContainer: document.querySelector('#pills-target-left')
        });

        
        dragula([document.getElementById('pills-target-right')], {
            mirrorContainer: document.querySelector('#pills-target-right')
        });

        
        dragula([document.getElementById('pills-toolbar-target-left')], {
            mirrorContainer: document.querySelector('#pills-toolbar-target-left')
        });

        
        dragula([document.getElementById('pills-toolbar-target-right')], {
            mirrorContainer: document.querySelector('#pills-toolbar-target-right')
        });


        
        
        

        
        dragula([document.getElementById('accordion-target')], {
            mirrorContainer: document.getElementById('accordion-target')
        });

        
        dragula([document.getElementById('collapsible-target')], {
            mirrorContainer: document.getElementById('collapsible-target')
        });
    };


    
    
    

    return {
        init: function() {
            _componentDragula();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DragAndDrop.init();
});
