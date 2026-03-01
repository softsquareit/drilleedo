





const CardsDraggable = function() {


    
    
    

    const _componentDragula = function() {
        if (typeof dragula == 'undefined') {
            console.warn('Warning - dragula.min.js is not loaded.');
            return;
        }

        
        
        

        
        const containersBasic = Array.from(document.querySelectorAll('.row-sortable [class*="col-"]'));

        
        dragula(containersBasic, {
            mirrorContainer: document.querySelector('.content-inner'),
            moves: function(el, container, handle) {
                return handle.parentNode.matches('[data-card-action="sort"]');
            }
        });


        
        
        

        
        const containersArea = Array.from(document.querySelectorAll('.column-card-sortable'));

        
        dragula(containersArea, {
            mirrorContainer: document.querySelector('.content-inner'),
            moves: function (el, container, handle) {
                return handle.parentNode.matches('[data-card-action="sort"]');
            }
        });


        
        
        

        
        const containersExclude = Array.from(document.querySelectorAll('.sortable-exclude [class*="col-"]'));

        
        dragula(containersExclude, {
            mirrorContainer: document.querySelector('.content-inner'),
            moves: function (el, container, handle) {
                return handle.parentNode.matches('.card:not(.skip-sort) [data-card-action="sort"]');
            }
        });


        
        
        

        
        const containersHandle = Array.from(document.querySelectorAll('.sortable-heading [class*="col-"]'));

        
        dragula(containersHandle, {
            mirrorContainer: document.querySelector('.content-inner'),
            moves: function (el, container, handle) {
                return handle.parentNode.matches('.card-header, [data-card-action="sort"]');
            }
        });


        
        
        

        
        const containersCardHandle = Array.from(document.querySelectorAll('.sortable-card [class*="col-"]'));

        
        dragula(containersCardHandle, {
            mirrorContainer: document.querySelector('.content-inner')
        });
    };


    
    
    

    return {
        init: function() {
            _componentDragula();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    CardsDraggable.init();
});
