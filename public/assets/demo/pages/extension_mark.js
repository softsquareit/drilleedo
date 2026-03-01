





const MarkJS = function() {


    
    
    

    
    const _markBasic = function() {

        
        
        const instanceBase = new Mark(document.querySelector(".demo-target-base"));

        
        const inputBase = document.querySelector("input[name='keyword-basic']");

        
        function performMarkBasic() {

            
            const keywordBase = inputBase.value;

            
            
            instanceBase.unmark({
                done: function(){
                    instanceBase.mark(keywordBase);
                }
            });
        }

        
        inputBase.addEventListener("input", performMarkBasic);
    };

    
    const _markExclude = function() {

        
        
        const instanceExclude = new Mark(document.querySelector(".demo-target-exclude"));

        
        const inputExclude = document.querySelector("input[name='keyword-exclude']");

        
        function performMarkExclude() {

            
            const keywordExclude = inputExclude.value;

            
            
            instanceExclude.unmark({
                done: function(){
                    instanceExclude.mark(keywordExclude, {
                        exclude: [
                            "del"
                        ]
                    });
                }
            });
        }

        
        inputExclude.addEventListener("input", performMarkExclude);
    };

    
    const _markSynonyms = function() {

        
        
        const instanceSynonym = new Mark(document.querySelector(".demo-target-synonym"));

        
        const inputSynonym = document.querySelector("input[name='keyword-synonym']");

        
        function performMarkSynonym() {

            
            const keywordSynonym = inputSynonym.value;

            
            
            instanceSynonym.unmark({
                done: function(){
                    instanceSynonym.mark(keywordSynonym, {
                        synonyms: {
                            "1": "one",
                            "10": "ten"
                        }
                    });
                }
            });
        }

        
        inputSynonym.addEventListener("input", performMarkSynonym);
    };

    
    const _markElementClass = function() {

        
        
        const instanceElementClass = new Mark(document.querySelector(".demo-target-element"));

        
        const inputElementClass = document.querySelector("input[name='keyword-element']");

        
        function performMarkElementClass() {

            
            const keywordElementClass = inputElementClass.value;

            
            
            instanceElementClass.unmark({
                done: function(){
                    instanceElementClass.mark(keywordElementClass, {
                        element: 'span',
                        className: 'bg-primary bg-opacity-10 text-primary'
                    });
                }
            });
        }

        
        inputElementClass.addEventListener("input", performMarkElementClass);
    };

    
    const _markFiltering = function() {

        
        
        const keywordInput = document.querySelector('input[name="keyword-table"]');
        const tab = document.querySelector('.table');
        const tableEl = new Mark(tab);

        
        keywordInput.addEventListener('input', function() {
            const term = this.value;

            
            if (term) {
                tab.querySelectorAll('td mark').forEach(function(mark) {
                    mark.closest('tr').classList.add('d-none');
                });
            }
            tableEl.unmark();

            
            tableEl.mark(term, {
                done: function() {
                    tab.querySelectorAll('td mark').forEach(function(mark) {
                        mark.closest('tr').classList.remove('d-none');
                    });
                }
            });
        });
    };

    
    const _markOptions = function() {

        
        
        var markInstance = new Mark(document.querySelector(".demo-target-options"));

        
        var keywordInput = document.querySelector("input[name='keyword-options']");
        var optionInputs = document.querySelectorAll("input[name='options']");

        function performMark() {

            
            var keyword = keywordInput.value;

            
            var options = {};
            [].forEach.call(optionInputs, function(opt) {
                options[opt.value] = opt.checked;
            });

            
            
            markInstance.unmark({
                done: function(){
                    markInstance.mark(keyword, options);
                }
            });
        };

        
        keywordInput.addEventListener("input", performMark);
        optionInputs.forEach(function(inputs) {
            inputs.addEventListener("change", performMark);
        });
    };


    
    
    

    return {
        init: function() {
            _markBasic();
            _markExclude();
            _markSynonyms();
            _markElementClass();
            _markFiltering();
            _markOptions();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    MarkJS.init();
});
