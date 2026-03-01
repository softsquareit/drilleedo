





const DatatableSelect = function() {


    
    
    

    
    const _componentDatatableSelect = function() {
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
            dom: '<"datatable-header"fl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
            language: {
                search: '<span class="me-3">Filter:</span> <div class="form-control-feedback form-control-feedback-end flex-fill">_INPUT_<div class="form-control-feedback-icon"><i class="ph-magnifying-glass opacity-50"></i></div></div>',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span class="me-3">Show:</span> _MENU_',
                paginate: { 'first': 'First', 'last': 'Last', 'next': document.dir == "rtl" ? '&larr;' : '&rarr;', 'previous': document.dir == "rtl" ? '&rarr;' : '&larr;' }
            }
        });


        
        $('.datatable-select-basic').DataTable({
            select: true
        });


        
        $('.datatable-select-single').DataTable({
            select: {
                style: 'single'
            }
        });


        
        $('.datatable-select-multiple').DataTable({
            select: {
                style: 'multi'
            }
        });


        
        $('.datatable-select-checkbox').DataTable({
            columnDefs: [
                {
                    orderable: false,
                    className: 'select-checkbox',
                    targets: 0
                },
                {
                    orderable: false,
                    width: 100,
                    targets: 6
                }
            ],
            select: {
                style: 'os',
                selector: 'td:first-child'
            },
            order: [[1, 'asc']]
        });


        
        $('.datatable-select-buttons').DataTable({
            dom: '<"dt-buttons-full"B><"datatable-header"fl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
            buttons: [
                {extend: 'selected', className: 'btn btn-light'},
                {extend: 'selectedSingle', className: 'btn btn-light'},
                {extend: 'selectAll', className: 'btn btn-primary'},
                {extend: 'selectNone', className: 'btn btn-primary'},
                {extend: 'selectRows', className: 'btn btn-teal'},
                {extend: 'selectColumns', className: 'btn btn-teal'},
                {extend: 'selectCells', className: 'btn btn-teal'}
            ],
            select: true
        });
    };


    
    
    

    return {
        init: function() {
            _componentDatatableSelect();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableSelect.init();
});
