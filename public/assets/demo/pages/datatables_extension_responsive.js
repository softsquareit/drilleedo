





const DatatableResponsive = function() {


    
    
    

    
    const _componentDatatableResponsive = function() {
        if (!$().DataTable) {
            console.warn('Warning - datatables.min.js is not loaded.');
            return;
        }

        
        $.extend( $.fn.dataTable.defaults, {
            autoWidth: false,
            responsive: true,
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


        
        $('.datatable-responsive').DataTable();


        
        $('.datatable-responsive-column-controlled').DataTable({
            responsive: {
                details: {
                    type: 'column'
                }
            },
            columnDefs: [
                {
                    className: 'control',
                    orderable: false,
                    targets:   0
                },
                { 
                    width: 100,
                    targets: 6
                },
                { 
                    orderable: false,
                    targets: 6
                }
            ],
            order: [1, 'asc']
        });


        
        $('.datatable-responsive-control-right').DataTable({
            responsive: {
                details: {
                    type: 'column',
                    target: -1
                }
            },
            columnDefs: [
                {
                    className: 'control',
                    orderable: false,
                    targets: -1
                },
                { 
                    width: 100,
                    targets: [5]
                },
                { 
                    orderable: false,
                    targets: [5]
                }
            ]
        });


        
        $('.datatable-responsive-row-control').DataTable({
            responsive: {
                details: {
                    type: 'column',
                    target: 'tr'
                }
            },
            columnDefs: [
                {
                    className: 'control',
                    orderable: false,
                    targets:   0
                },
                { 
                    width: 100,
                    targets: 6
                },
                { 
                    orderable: false,
                    targets: 6
                }
            ],
            order: [1, 'asc']
        });
    };


    
    
    

    return {
        init: function() {
            _componentDatatableResponsive();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableResponsive.init();
});
