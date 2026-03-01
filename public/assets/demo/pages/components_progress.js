





const Progress = function() {


    
    
    

    
    const _componentOverlay = function() {

        
        
        
        const buttonClass = 'btn-launch-spinner',
              containerClass = 'card',
              overlayClass = 'card-overlay',
              overlayAnimationClass = 'card-overlay-fadeout';

        
        document.querySelectorAll(`.${buttonClass}`).forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                
                const parentContainer = button.closest(`.${containerClass}`),
                      overlayElement = document.createElement('div'),
                      overlayElementIcon = document.createElement('span');

                
                overlayElement.classList.add(overlayClass);
                parentContainer.appendChild(overlayElement);
                if(button.getAttribute('data-spin') == 'false') {
                    overlayElementIcon.classList.add(button.getAttribute('data-icon'));
                }
                else {
                    overlayElementIcon.classList.add(button.getAttribute('data-icon'), 'spinner');
                }
                overlayElement.appendChild(overlayElementIcon);

                
                setTimeout(function() {
                    overlayElement.classList.add(overlayAnimationClass);
                    ['animationend', 'animationcancel'].forEach(function(e) {
                        overlayElement.addEventListener(e, function() {
                            overlayElement.remove();
                        });
                    });
                }, 2500);
            });
        });
    };


    
    
    

    return {
        init: function() {
            _componentOverlay();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    Progress.init();
});
