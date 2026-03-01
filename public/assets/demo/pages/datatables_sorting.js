





const DatatableSorting = function() {


    
    
    

    
    const _componentDatatableSorting = function() {
        if (!$().DataTable) {
            console.warn('Warning - datatables.min.js is not loaded.');
            return;
        }

        
        $.extend( $.fn.dataTable.defaults, {
            autoWidth: false,
            columnDefs: [{ 
                orderable: false,
                width: 100,
                targets: [ 5 ]
            }],
            dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
            language: {
                search: '<span class="me-3">Filter:</span> <div class="form-control-feedback form-control-feedback-end flex-fill">_INPUT_<div class="form-control-feedback-icon"><i class="ph-magnifying-glass opacity-50"></i></div></div>',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span class="me-3">Show:</span> _MENU_',
                paginate: { 'first': 'First', 'last': 'Last', 'next': document.dir == "rtl" ? '&larr;' : '&rarr;', 'previous': document.dir == "rtl" ? '&rarr;' : '&larr;' }
            }
        });


        
        $('.datatable-sorting').DataTable({
            order: [3, "desc"]
        });


        
        $('.datatable-multi-sorting').DataTable({
            columnDefs: [{
                targets: [0],
                orderData: [0, 1]
            }, {
                targets: [1],
                orderData: [1, 0]
            }, {
                targets: [4],
                orderData: [4, 0]
            }, {
                orderable: false,
                width: '100px',
                targets: [5]
            }]
        });


        
        $('.datatable-complex-header').DataTable({
            columnDefs: []
        });


        
        $('.datatable-sequence-control').dataTable( {
            "aoColumns": [
                null,
                null,
                {"orderSequence": ["asc"]},
                {"orderSequence": ["desc", "asc", "asc"]},
                {"orderSequence": ["desc"]},
                null
            ]
        });
    };


    
    
    

    return {
        init: function() {
            _componentDatatableSorting();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableSorting.init();
});
