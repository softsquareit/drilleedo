





const AnimationsCSS3 = function() {


    
    
    

    
    const _componentAnimationCSS = function() {

        
        const animationClass = document.querySelectorAll('.animation');
        animationClass.forEach(function(element) {
            element.addEventListener('click', function (e) {
                e.preventDefault();

                
                const animation = this.getAttribute('data-animation');
                const animationTarget = this.closest('.card');

                animationTarget.classList.add('animated', animation);

                animationTarget.addEventListener('animationend', function() {
                    animationTarget.classList.remove('animated', animation);
                });
            });
        });
    };


    
    
    

    return {
        init: function() {
            _componentAnimationCSS();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    AnimationsCSS3.init();
});
