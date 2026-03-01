





var ComponentsCollapsible = function() {


    
    
    

    
    var _componentDragula = function() {
        if (typeof dragula == 'undefined') {
            console.warn('Warning - dragula.min.js is not loaded.');
            return;
        }

        
        const containers = Array.from(document.querySelectorAll('.collapsible-sortable, .accordion-sortable'));

        
        dragula(containers, {
            mirrorContainer: document.querySelector('.content-inner'),
            moves: function (el, container, handle) {
                return handle.matches('[data-action=move]');
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentDragula();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    ComponentsCollapsible.init();
});
