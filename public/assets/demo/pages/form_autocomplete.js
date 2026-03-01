





const AutocompleteInputs = function() {


    
    
    

    
    const _componentAutocomplete = function() {
        if (typeof autoComplete == 'undefined') {
            console.warn('Warning - autocomplete.min.js is not loaded.');
            return;
        }

        
        const autocompleteData = [
            "Andorra",
            "United Arab Emirates",
            "Afghanistan",
            "Antigua and Barbuda",
            "Anguilla",
            "Albania",
            "Armenia",
            "Angola",
            "Antarctica",
            "Argentina",
            "American Samoa",
            "Austria",
            "Australia",
            "Aruba",
            "Åland",
            "Azerbaijan",
            "Bosnia and Herzegovina",
            "Barbados",
            "Bangladesh",
            "Belgium",
            "Burkina Faso",
            "Bulgaria",
            "Bahrain",
            "Burundi",
            "Benin",
            "Saint Barthélemy",
            "Bermuda",
            "Brunei",
            "Bolivia",
            "Bonaire",
            "Brazil",
            "Bahamas",
            "Bhutan",
            "Bouvet Island",
            "Botswana",
            "Belarus",
            "Belize"
        ];

        
        const autocompleteBasic = new autoComplete({
            selector: "#autocomplete_basic",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            },
            events: {
                input: {
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteBasic.input.value = selection;
                    }
                }
            }
        });

        
        const autocompleteSelection = new autoComplete({
            selector: "#autocomplete_selection",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            }
        });

        
        const autocompleteThreshold = new autoComplete({
            selector: "#autocomplete_threshold",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            },
            threshold: 3,
            events: {
                input: {
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteThreshold.input.value = selection;
                    }
                }
            }
        });

        
        const autocompleteDebounce = new autoComplete({
            selector: "#autocomplete_debounce",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            },
            debounce: 500,
            events: {
                input: {
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteDebounce.input.value = selection;
                    }
                }
            }
        });

        
        const autocompleteEngine = new autoComplete({
            selector: "#autocomplete_engine",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            },
            searchEngine: "loose",
            events: {
                input: {
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteEngine.input.value = selection;
                    }
                }
            }
        });

        
        const autocompleteFocus = new autoComplete({
            selector: "#autocomplete_focus",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            },
            events: {
                input: {
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteFocus.input.value = selection;
                    },
                    focus() {
                        const inputValue = autocompleteFocus.input.value;
                        if (inputValue.length) autocompleteFocus.start();
                    }
                }
            }
        });

        
        const autocompleteMultiple = new autoComplete({
            selector: "#autocomplete_multiple",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            },
            query: (query) => {
                
                const querySplit = query.split(",");
                
                const lastQuery = querySplit.length - 1;
                
                const newQuery = querySplit[lastQuery].trim();

                return newQuery;
            },
            events: {
                input: {
                    selection(event) {
                        const feedback = event.detail;
                        const input = autocompleteMultiple.input;
                        
                        const selection = feedback.selection.value.trim();
                        
                        const query = input.value.split(",").map(item => item.trim());
                        
                        query.pop();
                        
                        query.push(selection);
                        
                        input.value = query.join(", ") + ", ";
                    }
                }
            }
        });

        
        const autocompleteCount = new autoComplete({
            selector: "#autocomplete_count",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            },
            resultsList: {
                element: (list, data) => {
                    const info = document.createElement('li');
                    info.classList.add('pe-none', 'border-bottom', 'pt-0', 'pb-2', 'mb-2');
                    if (data.results.length > 0) {
                        info.innerHTML = `<div class="my-1">Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results</div>`;
                    }
                    list.prepend(info);
                },
                maxResults: 15,
                tabSelect: true
            },
            events: {
                input: {
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteCount.input.value = selection;
                    }
                }
            }
        });

        
        const autocompleteEmpty = new autoComplete({
            selector: "#autocomplete_empty",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            },
            resultsList: {
                element: (list, data) => {
                    const info = document.createElement('li');
                    info.classList.add('pe-none', 'py-1');
                    if (!data.results.length) {
                        info.innerHTML = `<div class="my-1">Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong></div>`;
                    }
                    list.append(info);
                },
                noResults: true,
                maxResults: 15,
                tabSelect: true
            },
            events: {
                input: {
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteEmpty.input.value = selection;
                    }
                }
            }
        });

        
        const autocompleteHighlight = new autoComplete({
            selector: "#autocomplete_highlight",
            data: {
                src: autocompleteData
            },
            events: {
                input: {
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteHighlight.input.value = selection;
                    }
                }
            }
        });

        
        const autocompleteExternalSource = new autoComplete({
            selector: "#autocomplete_external_source",
            data: {
                src: async function(){
                    try {
                        
                        document.getElementById("autocomplete_external_source").setAttribute("placeholder", "Loading...");
                        
                        const source = await fetch(
                            "../../../assets/demo/data/typeahead/countries.json"
                        );
                        const data = await source.json();
                        
                        document.getElementById("autocomplete_external_source").setAttribute("placeholder", autocompleteExternalSource.placeHolder);
                        
                        return data;
                    }
                    catch (error) {
                        return error;
                    }
                }
            },
            resultItem: {
                highlight: true
            },
            events: {
                input: {
                    focus: () => {
                        if (autocompleteExternalSource.input.value.length) autocompleteExternalSource.start();
                    },
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteExternalSource.input.value = selection;
                    }
                }
            }
        });

        
        const autocompleteDuplicates = new autoComplete({
            selector: "#autocomplete_duplicates",
            data: {
                src: async function(){
                    try {
                        
                        document.getElementById("autocomplete_duplicates").setAttribute("placeholder", "Loading...");
                        
                        const source = await fetch(
                            "../../../assets/demo/data/typeahead/countries.json"
                        );
                        const data = await source.json();
                        
                        document.getElementById("autocomplete_duplicates").setAttribute("placeholder", autocompleteDuplicates.placeHolder);
                        
                        return data;
                    }
                    catch (error) {
                        return error;
                    }
                },
                filter: (list) => {
                    
                    
                    const filteredResults = Array.from(
                        new Set(list.map((value) => value.match))
                    ).map((food) => {
                        return list.find((value) => value.match === food);
                    });

                    return filteredResults;
                }
            },
            resultItem: {
                highlight: true
            },
            events: {
                input: {
                    focus: () => {
                        if (autocompleteDuplicates.input.value.length) autocompleteDuplicates.start();
                    },
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteDuplicates.input.value = selection;
                    }
                }
            }
        });

        
        let history = [];
        const autocompleteRecent = new autoComplete({
            selector: "#autocomplete_recent",
            data: {
                src: autocompleteData
            },
            resultItem: {
                highlight: true
            },
            resultsList: {
                element: (list) => {
                    const recentSearch = history.reverse();
                    const historyLength = recentSearch.length;

                    
                    if(historyLength) {
                        const historyBlock = document.createElement("li");
                        historyBlock.classList.add('pe-none', 'border-bottom', 'pt-0', 'pb-2', 'mb-2');
                        historyBlock.innerHTML = '<div class="fw-semibold">Recent Searches</div>';
                        
                        recentSearch.slice(0, 2).forEach((item) => {
                            const recentItem = document.createElement("div");
                            recentItem.classList.add('text-muted', 'mt-2')
                            recentItem.innerHTML = item;
                            historyBlock.append(recentItem);
                        });

                        
                        
                        

                        list.prepend(historyBlock);
                    }
                }
            },
            events: {
                input: {
                    selection(event) {
                        const feedback = event.detail;
                        const input = autocompleteRecent.input;
                        
                        const selection = feedback.selection.value;
                        
                        history.push(selection);
                        
                        autocompleteRecent.input.value = selection;
                    }
                }
            }
        });

        
        const autocompleteStart = new autoComplete({
            selector: "#autocomplete_start",
            data: {
                src: autocompleteData,
                filter: (list) => {
                    const results = list.filter((item) => {
                        const inputValue = autocompleteStart.input.value.toLowerCase();
                        const itemValue = item.value.toLowerCase();

                        if (itemValue.startsWith(inputValue)) {
                            return item.value;
                        }
                    });

                    return results;
                }
            },
            resultItem: {
                highlight: true
            },
            events: {
                input: {
                    selection: function(event){
                        const selection = event.detail.selection.value;
                        autocompleteStart.input.value = selection;
                    }
                }
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentAutocomplete();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    AutocompleteInputs.init();
});
