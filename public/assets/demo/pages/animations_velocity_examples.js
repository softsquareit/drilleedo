





const AnimationsVelocityAdvanced = function() {


    
    
    

    
    const _componentAnimationVelocityAdvanced = function() {
        if (typeof Velocity == 'undefined') {
            console.warn('Warning - velocity.min.js is not loaded.');
            return;
        }

        
        const velocityPropsElement = document.querySelectorAll('.velocity-properties');
        velocityPropsElement.forEach(function(link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                
                const currentElements = link.closest('.card-body').querySelectorAll('.card');

                
                Velocity(currentElements, {
                    marginLeft: 20,
                    marginRight: 20,
                    opacity: 0.5
                });
                Velocity(currentElements, "reverse", {
                    delay: 1000,
                    complete: function() {
                        currentElements.forEach(function(cards) {
                            cards.removeAttribute('style');
                        });
                    }
                });
            });
        });

        
        const velocityChainedElement = document.querySelectorAll('.velocity-chained');
        velocityChainedElement.forEach(function(link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                
                const currentElements = link.closest('.card-body').querySelectorAll('.card');

                
                Velocity(currentElements, {
                    marginLeft: 20,
                    marginRight: 20,
                    opacity: 0.5
                });
                Velocity(currentElements, "reverse", {
                    delay: 1000
                });
                Velocity(currentElements, {
                    marginRight: 20
                });
                Velocity(currentElements, "reverse", {
                    delay: 1000
                });
                Velocity(currentElements, {
                    opacity: 0.5
                });
                Velocity(currentElements, "reverse", {
                    delay: 1000,
                    complete: function() {
                        currentElements.forEach(function(cards) {
                            cards.removeAttribute('style');
                        });
                    }
                });
            });
        });

        
        const velocityStaggerElement = document.querySelectorAll('.velocity-stagger');
        velocityStaggerElement.forEach(function(link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                
                const currentElements = link.closest('.velocity-container').querySelectorAll('.card');

                
                Velocity(currentElements, 'transition.slideUpIn', {
                    stagger: 500
                });
            });
        });

        
        const velocityDragElement = document.querySelectorAll('.velocity-drag');
        velocityDragElement.forEach(function(link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                
                const currentElements = link.closest('.velocity-container').querySelectorAll('.card');

                
                Velocity(currentElements, 'transition.slideUpBigIn', {
                    duration: 1000,
                    drag: true
                });
            });
        });

        
        const velocityBackwardsElement = document.querySelectorAll('.velocity-backwards');
        velocityBackwardsElement.forEach(function(link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                
                const currentElements = link.closest('.velocity-container').querySelectorAll('.card');

                
                Velocity(currentElements, 'transition.slideDownOut', {
                    stagger: 400,
                    backwards: true
                });
                Velocity(currentElements, {
                    opacity: 1
                }, {
                  duration: 500,
                  display: 'block'
                });
            });
        });


        
        
        

        
        const velocityBeginElement = document.querySelectorAll('.velocity-begin');
        velocityBeginElement.forEach(function(link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                
                const currentElements = link.closest('.velocity-container').querySelectorAll('.row');

                
                Velocity(currentElements, {
                    marginLeft: 20,
                    marginRight: 20,
                    opacity: 0.5
                }, {
                    begin: function() {
                        alert('Begin callback example');
                    }
                });
                Velocity(currentElements, "reverse", {
                    delay: 1000,
                    complete: function() {
                        currentElements.forEach(function(cards) {
                            cards.removeAttribute('style');
                        });
                    }
                });
            });
        });

        
        const velocityCompleteElement = document.querySelectorAll('.velocity-complete');
        velocityCompleteElement.forEach(function(link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                
                const currentElements = link.closest('.velocity-container').querySelectorAll('.row');

                
                Velocity(currentElements, {
                    marginLeft: 20,
                    marginRight: 20,
                    opacity: 0.5
                }, {
                    complete: function() {
                        alert('Complete callback example');
                    }
                });
                Velocity(currentElements, "reverse", {
                    delay: 1000,
                    complete: function() {
                        currentElements.forEach(function(cards) {
                            cards.removeAttribute('style');
                        });
                    }
                });
            });
        });

        
        const velocityProgressElement = document.querySelectorAll('.velocity-progress');
        velocityProgressElement.forEach(function(link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                
                const currentElements = link.closest('.velocity-container').querySelectorAll('.row');
                const percentage = document.querySelector('#percentComplete');
                const time = document.querySelector('#timeRemaining');

                
                Velocity(currentElements, {
                    marginLeft: 20,
                    marginRight: 20,
                    opacity: 0.5
                }, {
                    duration: 1000,
                    progress: function(elements, percentComplete, timeRemaining, timeStart) {
                        percentage.innerHTML = Math.round(percentComplete * 100) + '% complete.';
                        time.innerHTML = timeRemaining + 'ms remaining.';
                    }
                });
                Velocity(currentElements, "reverse", {
                    delay: 1000,
                    complete: function() {
                        currentElements.forEach(function(cards) {
                            cards.removeAttribute('style');
                        });
                    }
                });
            });
        });
    }


    
    
    

    return {
        init: function() {
            _componentAnimationVelocityAdvanced();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    AnimationsVelocityAdvanced.init();
});
