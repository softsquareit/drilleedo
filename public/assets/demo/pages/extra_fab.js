





const FloatingActionButton = function() {


    
    
    

    
    const _componentFab = function() {

        
        window.addEventListener('scroll', function() {
            const bottomFabs = document.querySelectorAll('.fab-menu-bottom-start, .fab-menu-bottom-end'),
                fabClass = 'reached-bottom';

            for (const i = 0; i < bottomFabs.length; ++i) {
                if(window.pageYOffset + window.innerHeight > document.body.clientHeight - 40) {
                    bottomFabs[i].classList.add(fabClass);
                }
                else {
                    bottomFabs[i].classList.remove(fabClass);
                }
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentFab();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    FloatingActionButton.init();
});
