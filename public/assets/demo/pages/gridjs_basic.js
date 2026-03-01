





const GridJsBasic = function() {


    
    
    

    
    const _componentGridJsBasic = function() {
        if (typeof gridjs == 'undefined') {
            console.warn('Warning - gridjs.min.js is not loaded.');
            return;
        }

        
        const demoData = [
            ["John", "john@example.com", "(353) 01 222 3333", "Netherlands"],
            ["Mark", "mark@gmail.com", "(01) 22 888 4444", "Switzerland"],
            ["Eoin", "eoin@gmail.com", "0097 22 654 00033", "Germany"],
            ["Sarah", "sarahcdd@gmail.com", "+322 876 1233", "France"],
            ["Afshin", "afshin@mail.com", "(353) 22 87 8356", "Norway"]
        ];

        
        const gridjsBasicElement = document.querySelector(".gridjs-example-basic");
        if(gridjsBasicElement) {
            const gridjsBasic = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                columns: ["Name", "Email", "Phone Number", "Country"],
                data: demoData
            });
            gridjsBasic.render(gridjsBasicElement);
        }

        
        const gridjsSortElement = document.querySelector(".gridjs-example-sorting");
        if(gridjsSortElement) {
            const gridjsSort = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                sort: true,
                columns: ["Name", "Email", "Phone Number", "Country"],
                data: demoData
            });
            gridjsSort.render(gridjsSortElement);
        }

        
        const gridjsResizeElement = document.querySelector(".gridjs-example-resizable");
        if(gridjsResizeElement) {
            const gridjsResize = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                resizable: true,
                sort: true,
                columns: ["Name", "Email", "Phone Number", "Country"],
                data: demoData
            });
            gridjsResize.render(gridjsResizeElement);
        }

        
        const gridjsSearchElement = document.querySelector(".gridjs-example-search");
        if(gridjsSearchElement) {
            const gridjsSearch = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                pagination: true,
                sort: true,
                search: true,
                columns: ["Name", "Email", "Phone Number", "Country"],
                data: demoData
            });
            gridjsSearch.render(gridjsSearchElement);
        }

        
        const gridjsPaginationElement = document.querySelector(".gridjs-example-pagination");
        if(gridjsPaginationElement) {
            const gridjsPagination = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                pagination: true,
                sort: true,
                columns: ["Name", "Email", "Phone Number", "Country"],
                data: demoData
            });
            gridjsPagination.render(gridjsPaginationElement);
        }

        
        const gridjsHiddenElement = document.querySelector(".gridjs-example-hidden");
        if(gridjsHiddenElement) {
            const gridjsHidden = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                pagination: true,
                sort: true,
                columns: [
                    "Name", 
                    {
                        name: "Email",
                        hidden: true
                    },
                    "Phone Number",
                    "Country"
                ],
                data: demoData
            });
            gridjsHidden.render(gridjsHiddenElement);
        }
    };


    
    
    

    return {
        init: function() {
            _componentGridJsBasic();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    GridJsBasic.init();
});
