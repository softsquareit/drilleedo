





const DatatableColumnReorder = function() {


    
    
    

    
    const _componentDatatableColumnReorder = function() {
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
            colReorder: true,
            dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
            language: {
                search: '<span class="me-3">Filter:</span> <div class="form-control-feedback form-control-feedback-end flex-fill">_INPUT_<div class="form-control-feedback-icon"><i class="ph-magnifying-glass opacity-50"></i></div></div>',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span class="me-3">Show:</span> _MENU_',
                paginate: { 'first': 'First', 'last': 'Last', 'next': document.dir == "rtl" ? '&larr;' : '&rarr;', 'previous': document.dir == "rtl" ? '&rarr;' : '&larr;' }
            }
        });


        
        $('.datatable-reorder').DataTable();


        
        $('.datatable-reorder-realtime').DataTable({
            colReorder: {
                realtime: false
            }
        });


        
        $('.datatable-reorder-state-saving').DataTable({
            stateSave: true
        });


        
        $('.datatable-reorder-predefined').DataTable({
            colReorder: {
                order: [1, 3, 2, 4, 0, 5]
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentDatatableColumnReorder();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableColumnReorder.init();
});
