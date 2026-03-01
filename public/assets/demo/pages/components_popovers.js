





const Popovers = function () {


    
    
    

    
    const _componentPopoverCustomHeaderColor = function() {
		const customPopoverHeaderElement = document.querySelector('[data-popup=popover-custom]');
		if(customPopoverHeaderElement) {
			new bootstrap.Popover(customPopoverHeaderElement, {
				customClass: 'popover-custom',
				template: '<div class="popover border-teal"><div class="popover-arrow border-teal"></div><h3 class="popover-header bg-teal border-teal text-white"></h3><div class="popover-body"></div></div>'
			});
		}
    };

    
    const _componentPopoverCustomBackgroundColor = function() {
		const customPopoverElement = document.querySelector('[data-popup=popover-solid]');
		if(customPopoverElement) {
			new bootstrap.Popover(customPopoverElement, {
				customClass: 'popover-custom',
				template: '<div class="popover bg-primary border-primary"><div class="popover-arrow border-primary"></div><h3 class="popover-header bg-primary text-white border-white border-opacity-25"></h3><div class="popover-body text-white"></div></div>'
			});
		}
    };

    
    const _componentPopoverEvents = function() {

    	
		const onShowPopoverElement = document.querySelector('#popover-show');
		const onShownPopoverElement = document.querySelector('#popover-shown');
		const onHidePopoverElement = document.querySelector('#popover-hide');
		const onHiddenPopoverElement = document.querySelector('#popover-hidden');

		
		if(onShowPopoverElement) {
			const onShowPopover = new bootstrap.Popover(onShowPopoverElement, {
				title: 'Popover title',
				content: 'And here\'s some amazing content. It\'s very engaging. Right?',
				trigger: 'click'
			});

			onShowPopoverElement.addEventListener('show.bs.popover', function() {
				alert('onShow event fired.');
			});
		}

		
		if(onShownPopoverElement) {
			const onShownPopover = new bootstrap.Popover(onShownPopoverElement, {
				title: 'Popover title',
				content: 'And here\'s some amazing content. It\'s very engaging. Right?',
				trigger: 'click'
			});

			onShownPopoverElement.addEventListener('shown.bs.popover', function() {
				alert('onShown event fired.');
			});
		}

		
		if(onHidePopoverElement) {
			const onHidePopover = new bootstrap.Popover(onHidePopoverElement, {
				title: 'Popover title',
				content: 'And here\'s some amazing content. It\'s very engaging. Right?',
				trigger: 'click'
			});

			onHidePopoverElement.addEventListener('hide.bs.popover', function() {
				alert('onHide event fired.');
			});
		}

		
		if(onHiddenPopoverElement) {
			const onHiddenPopover = new bootstrap.Popover(onHiddenPopoverElement, {
				title: 'Popover title',
				content: 'And here\'s some amazing content. It\'s very engaging. Right?',
				trigger: 'click'
			});

			onHiddenPopoverElement.addEventListener('hidden.bs.popover', function() {
				alert('onHidden event fired.');
			});
		}
    };

    
    const _componentPopoverMethods = function() {

    	
    	const showPopoverMethodElementTarget = document.querySelector('#show-popover-method-target');
    	const hidePopoverMethodElementTarget = document.querySelector('#hide-popover-method-target');
    	const togglePopoverMethodElementTarget = document.querySelector('#toggle-popover-method-target');
    	const disposePopoverMethodElementTarget = document.querySelector('#dispose-popover-method-target');
    	const toggleEnabledPopoverMethodElementTarget = document.querySelector('#toggle-enabled-popover-method-target');

		
		if(showPopoverMethodElementTarget) {
			const showPopover = new bootstrap.Popover(showPopoverMethodElementTarget, {
				title: 'Popover title',
				content: 'And here\'s some amazing content. It\'s very engaging. Right?',
				placement: 'top'
			});

			document.querySelector('#show-popover-method').addEventListener('click', function() {
				showPopover.show();
			});
		}

		
		if(hidePopoverMethodElementTarget) {
			const hidePopover = new bootstrap.Popover(hidePopoverMethodElementTarget, {
				title: 'Popover title',
				content: 'And here\'s some amazing content. It\'s very engaging. Right?',
				placement: 'top'
			});

			
			document.querySelector('#hide-popover-method').addEventListener('mouseenter', function() {
				hidePopover.show();
			});

			
			document.querySelector('#hide-popover-method').addEventListener('click', function() {
				hidePopover.hide();
			});
		}

		
		if(togglePopoverMethodElementTarget) {
			const togglePopover = new bootstrap.Popover(togglePopoverMethodElementTarget, {
				title: 'Popover title',
				content: 'And here\'s some amazing content. It\'s very engaging. Right?',
				placement: 'top'
			});

			document.querySelector('#toggle-popover-method').addEventListener('click', function() {
				togglePopover.toggle();
			});
		}

		
		if(disposePopoverMethodElementTarget) {
			const disposePopover = new bootstrap.Popover(disposePopoverMethodElementTarget, {
				title: 'Popover title',
				content: 'And here\'s some amazing content. It\'s very engaging. Right?',
				placement: 'top'
			});

			
			document.querySelector('#dispose-popover-method').addEventListener('mouseenter', function() {
				disposePopover.show();
			});

			document.querySelector('#dispose-popover-method').addEventListener('click', function() {
				disposePopover.dispose();
				disposePopoverMethodElementTarget.innerHTML = 'Disposed';
				disposePopoverMethodElementTarget.classList.add('disabled');
				this.classList.add('disabled');
			});
		}

		
		if(toggleEnabledPopoverMethodElementTarget) {
			const toggleEnabledPopover = new bootstrap.Popover(toggleEnabledPopoverMethodElementTarget, {
				title: 'Popover title',
				content: 'And here\'s some amazing content. It\'s very engaging. Right?',
				placement: 'top',
				trigger: 'hover'
			});

			document.querySelector('#toggle-enabled-popover-method').addEventListener('click', function() {
				if(toggleEnabledPopoverMethodElementTarget.classList.contains('disabled')) {
					toggleEnabledPopover.enable();
					toggleEnabledPopover.innerHTML = 'Target';
					toggleEnabledPopoverMethodElementTarget.classList.remove('disabled');
				}
				else {
					toggleEnabledPopover.disable();
					toggleEnabledPopover.innerHTML = 'Disabled';
					toggleEnabledPopoverMethodElementTarget.classList.add('disabled');
				}
			});
		}
    };


    
    
    

    return {
        init: function() {
            _componentPopoverCustomHeaderColor();
            _componentPopoverCustomBackgroundColor();
            _componentPopoverEvents();
            _componentPopoverMethods();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    Popovers.init();
});
