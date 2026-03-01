





const DatatableScroller = function() {


    
    
    

    
    const _componentDatatableScroller = function() {
        if (!$().DataTable) {
            console.warn('Warning - datatables.min.js is not loaded.');
            return;
        }

        
        $.extend( $.fn.dataTable.defaults, {
            columnDefs: [
                { 
                    width: 100,
                    targets: 0
                },
                { 
                    width: "23%",
                    targets: [ 1, 2, 3, 4 ]
                }
            ],
            dom: '<"datatable-header"fi><"datatable-scroll"t>',
            ajax: '../../../assets/demo/data/tables/datatable_2500.json',
            deferRender: true,
            scroller: true,
            scrollY: 419,
            scrollCollapse: true,
            language: {
                search: '<span class="me-3">Filter:</span> <div class="form-control-feedback form-control-feedback-end flex-fill">_INPUT_<div class="form-control-feedback-icon"><i class="ph-magnifying-glass opacity-50"></i></div></div>',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span class="me-3">Show:</span> _MENU_',
                paginate: { 'first': 'First', 'last': 'Last', 'next': document.dir == "rtl" ? '&larr;' : '&rarr;', 'previous': document.dir == "rtl" ? '&rarr;' : '&larr;' }
            }
        });


        
        

        
        $('.datatable-scroller').DataTable();


        
        $('.datatable-scroller-buttons').DataTable({
            dom: '<"datatable-header dt-buttons-right"fB><"datatable-scroll"tS><"datatable-footer"i>',
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


        
        $('.datatable-scroller-state').DataTable({
            stateSave: true
        });


        
        $('.datatable-scroller-api').DataTable({
            stateSave: true,
            initComplete: function () {
                const api = this.api();
                api.scroller().scrollToRow(1000);
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentDatatableScroller();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableScroller.init();
});
