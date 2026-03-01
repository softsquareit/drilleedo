





const AnimationsVelocityBasic = function() {


    
    
    

    
    const _componentAnimationVelocityBasic = function() {
        if (typeof Velocity == 'undefined') {
            console.warn('Warning - velocity.min.js is not loaded.');
            return;
        }

        
        const animationClass = document.querySelectorAll('.velocity-property');
        animationClass.forEach(function(element) {
            element.addEventListener('click', function (e) {
                e.preventDefault();
                
                
                const property = element.dataset.property;
                const property2 = element.dataset.property2;
                const property3 = element.dataset.property3;
                const value = element.dataset.value;
                const value2 = element.dataset.value2;
                const value3 = element.dataset.value3;

                
                const animateMap = {},
                animateOptions = {
                    easing: 'easeInOut',
                    duration: 250
                };
                animateMap[property] = value;
                animateMap[property2] = value2;
                animateMap[property3] = value3;

                
                const currentElement = element.closest('.demo-velocity-box');

                
                Velocity(currentElement, animateMap, animateOptions);
                Velocity(currentElement, "reverse", {
                    delay: 1000,
                    complete: function() {
                        currentElement.removeAttribute('style');
                    }
                });
            });
        });
    };


    
    
    

    return {
        init: function() {
            _componentAnimationVelocityBasic();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    AnimationsVelocityBasic.init();
});
