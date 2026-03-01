





const AnimationsVelocityUi = function() {


    
    
    

    
    const _componentAnimationVelocityUi = function() {
        if (typeof Velocity == 'undefined') {
            console.warn('Warning - velocity.min.js is not loaded.');
            return;
        }

        
        const animationClass = document.querySelectorAll('.velocity-animation');
        animationClass.forEach(function(element) {
            element.addEventListener('click', function (e) {
                e.preventDefault();

                const animation = element.dataset.animation;

                
                const currentElement = element.closest('.card');

                
                Velocity(currentElement, 'callout.' + animation, {
                    stagger: 500,
                    complete: function() {
                        currentElement.removeAttribute('style');
                    }
                });
            });
        });


        
        const transitionClass = document.querySelectorAll('.velocity-transition');
        transitionClass.forEach(function(element) {
            element.addEventListener('click', function (e) {
                e.preventDefault();

                const transition = element.dataset.transition;

                
                const currentElement = element.closest('.card');

                
                Velocity(currentElement, 'transition.' + transition, {
                    stagger: 1000,
                    duration: 1000,
                    complete: function() {
                        currentElement.removeAttribute('style');
                    }
                });
            });
        });
    };


    
    
    

    return {
        init: function() {
            _componentAnimationVelocityUi();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    AnimationsVelocityUi.init();
});
