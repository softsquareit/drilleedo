





var FixedSidebarCustomScroll = function() {


    
    
    

    
    var _componentPerfectScrollbar = function() {
        if (typeof PerfectScrollbar == 'undefined') {
            console.warn('Warning - perfect_scrollbar.min.js is not loaded.');
            return;
        }

        
        var ps = new PerfectScrollbar('.sidebar-fixed .sidebar-content', {
            wheelSpeed: 2,
            wheelPropagation: true
        });
    };


    
    
    

    return {
        init: function() {
            _componentPerfectScrollbar();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    FixedSidebarCustomScroll.init();
});
