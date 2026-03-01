





const DatatableButtons = function() {


    
    
    

    
    const _componentDatatableButtons = function() {
        if (!$().DataTable) {
            console.warn('Warning - datatables.min.js is not loaded.');
            return;
        }

        
        $.extend( $.fn.dataTable.defaults, {
            autoWidth: false,
            dom: '<"datatable-header justify-content-start"f<"ms-sm-auto"l><"ms-sm-3"B>><"datatable-scroll-wrap"t><"datatable-footer"ip>',
            language: {
                search: '<span class="me-3">Filter:</span> <div class="form-control-feedback form-control-feedback-end flex-fill">_INPUT_<div class="form-control-feedback-icon"><i class="ph-magnifying-glass opacity-50"></i></div></div>',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span class="me-3">Show:</span> _MENU_',
                paginate: { 'first': 'First', 'last': 'Last', 'next': document.dir == "rtl" ? '&larr;' : '&rarr;', 'previous': document.dir == "rtl" ? '&rarr;' : '&larr;' }
            }
        });


        
        $('.datatable-button-init-basic').DataTable({
            buttons: {
                dom: {
                    button: {
                        className: 'btn btn-light'
                    }
                },
                buttons: [
                    {extend: 'copy'},
                    {extend: 'csv'},
                    {extend: 'excel'},
                    {extend: 'pdf'},
                    {extend: 'print'}
                ]
            }
        });


        
        $('.datatable-button-init-custom').DataTable({
            buttons: [
                {
                    text: 'Custom button',
                    className: 'btn btn-teal',
                    action: function(e, dt, node, config) {
                        alert('Custom button activated')
                    }
                }
            ]
        });


        
        $('.datatable-button-init-collection').DataTable({
            buttons: [
                {
                    extend: 'collection',
                    text: '<i class="ph-list"></i>',
                    className: 'btn btn-primary btn-icon dropdown-toggle',
                    buttons: [
                        {
                            text: 'Toggle first name',
                            action: function ( e, dt, node, config ) {
                                dt.column( 0 ).visible( ! dt.column( 0 ).visible() );
                            }
                        },
                        {
                            text: 'Toggle status',
                            action: function ( e, dt, node, config ) {
                                dt.column( -2 ).visible( ! dt.column( -2 ).visible() );
                            }
                        }
                    ]
                }
            ]
        });


        
        $('.datatable-button-init-length').DataTable({
            dom: '<"datatable-header"fB><"datatable-scroll-wrap"t><"datatable-footer"ip>',
            lengthMenu: [
                [ 10, 25, 50, -1 ],
                [ '10 rows', '25 rows', '50 rows', 'Show all' ]
            ],
            buttons: [
                {
                    extend: 'pageLength',
                    className: 'btn btn-secondary'
                }
            ]
        });
    };


    
    
    

    return {
        init: function() {
            _componentDatatableButtons();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableButtons.init();
});
