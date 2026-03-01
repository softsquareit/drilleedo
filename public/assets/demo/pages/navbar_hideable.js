





var NavbarHideable = function() {


    
    
    

    
    var _componentHeadroom = function() {
        if (typeof Headroom == 'undefined') {
            console.warn('Warning - headroom.min.js is not loaded.');
            return;
        }

        
        var navbarTop = document.querySelector('.navbar-slide-top'),
            navbarBottom = document.querySelector('.navbar-slide-bottom');


        
        
        

        if (navbarTop) {

            
            var headroomTop = new Headroom(navbarTop, {
                offset: navbarTop.offsetHeight,
                tolerance: {
                    up: 10,
                    down: 10
                },
                onUnpin : function() {
                    document.querySelectorAll('.headroom .show').forEach(function(element) {
                        element.classList.remove('show');
                    });
                }
            });

            
            headroomTop.init(); 
        }



        
        
        

        if (navbarBottom) {
            
            
            var headroomBottom = new Headroom(navbarBottom, {
                offset: navbarBottom.offsetHeight,
                tolerance: {
                    up: 10,
                    down: 10
                },
                onUnpin : function() {
                    document.querySelectorAll('.headroom .show').forEach(function(element) {
                        element.classList.remove('show');
                    });
                }
            });

            
            headroomBottom.init();
        }
    };


    
    
    

    return {
        init: function() {
            _componentHeadroom();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    NavbarHideable.init();
});
