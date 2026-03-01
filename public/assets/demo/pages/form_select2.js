





var Select2Selects = function() {


    
    
    

    
    var _componentSelect2 = function() {
        if (!$().select2) {
            console.warn('Warning - select2.min.js is not loaded.');
            return;
        }


        
        
        

        
        $('.select').select2();


        
        
        

        
        $('.select-multiple-search-disabled').select2();

        $('.select-multiple-search-disabled').on('select2:opening select2:closing', function( event ) {
            const $searchfield = $(this).parent().find('.select2-search__field');
            $searchfield.prop('disabled', true);
        });


        
        
        

        
        function iconFormat(icon) {
            var originalOption = icon.element;
            if (!icon.id) { return icon.text; }
            var $icon = '<i class="ph-' + $(icon.element).data('icon') + '"></i>' + icon.text;

            return $icon;
        }

        
        $('.select-icons').select2({
            templateResult: iconFormat,
            minimumResultsForSearch: Infinity,
            templateSelection: iconFormat,
            escapeMarkup: function(m) { return m; }
        });


        
        
        

        
        function matchStart (term, text) {
            if (text.toUpperCase().indexOf(term.toUpperCase()) == 0) {
                return true;
            }

            return false;
        }

        
        $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
            $('.select-matched-customize').select2({
                minimumResultsForSearch: Infinity,
                placeholder: 'Select a State',
                matcher: oldMatcher(matchStart)
            });
        });


        
        
        

        
        var array_data = [
            {id: 0, text: 'enhancement'},
            {id: 1, text: 'bug'},
            {id: 2, text: 'duplicate'},
            {id: 3, text: 'invalid'},
            {id: 4, text: 'wontfix'}
        ];

        
        $('.select-data-array').select2({
            placeholder: 'Click to load data',
            minimumResultsForSearch: Infinity,
            data: array_data
        });


        
        
        

        
        function formatRepo (repo) {
            if (repo.loading) return repo.text;

            var markup = '<div class="select2-result-repository clearfix">' +
                '<div class="select2-result-repository__avatar"><img src="' + repo.owner.avatar_url + '" /></div>' +
                '<div class="select2-result-repository__meta">' +
                '<div class="select2-result-repository__title">' + repo.full_name + '</div>';

            if (repo.description) {
                markup += '<div class="select2-result-repository__description">' + repo.description + '</div>';
            }

            markup += '<div class="select2-result-repository__statistics">' +
                '<div class="select2-result-repository__forks">' + repo.forks_count + ' Forks</div>' +
                '<div class="select2-result-repository__stargazers">' + repo.stargazers_count + ' Stars</div>' +
                '<div class="select2-result-repository__watchers">' + repo.watchers_count + ' Watchers</div>' +
                '</div>' +
                '</div></div>';

            return markup;
        }

        
        function formatRepoSelection (repo) {
            return repo.full_name || repo.text;
        }

        
        $('.select-remote-data').select2({
            ajax: {
                url: 'https://api.github.com/search/repositories',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term, 
                        page: params.page
                    };
                },
                processResults: function (data, params) {

                    
                    
                    
                    
                    params.page = params.page || 1;

                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup; }, 
            minimumInputLength: 1,
            templateResult: formatRepo, 
            templateSelection: formatRepoSelection 
        });


        
        
        

        
        $('.select-access-value').select2({
            minimumResultsForSearch: Infinity,
            placeholder: 'Select State...'
        });
        $('.access-get').on('click', function () { alert('Selected value is: '+$('.select-access-value').val()); });
        $('.access-set').on('click', function () { $('.select-access-value').val('CA').trigger('change'); });


        
        $('.select-access-open').select2({
            minimumResultsForSearch: Infinity,
            placeholder: 'Select State...'
        });
        $('.access-open').on('click', function () { $('.select-access-open').select2('open'); });
        $('.access-close').on('click', function () { $('.select-access-open').select2('close'); });


        
        $('.select-access-enable').select2({
            minimumResultsForSearch: Infinity,
            placeholder: 'Select State...'
        });
        $('.access-disable').on('click', function () { $('.select-access-enable').prop('disabled', true); });
        $('.access-enable').on('click', function () { $('.select-access-enable').prop('disabled', false); });


        
        function create_menu() {
            $('.select-access-create').select2({
                minimumResultsForSearch: Infinity,
                placeholder: 'Select State...'
            });
        }
        create_menu();
        $('.access-create').on('click', function () { return create_menu()});
        $('.access-destroy').on('click', function () { $('.select-access-create').select2('destroy'); });


        
        
        

        
        $('.select-access-multiple-value').select2();
        $('.change-to-ca').on('click', function() { $('.select-access-multiple-value').val('CA').trigger('change'); });
        $('.change-to-ak-co').on('click', function() { $('.select-access-multiple-value').val(['AK','CO']).trigger('change'); });


        
        $('.select-access-multiple-open').select2({
            minimumResultsForSearch: Infinity
        });
        $('.access-multiple-open').on('click', function () { $('.select-access-multiple-open').select2('open'); });
        $('.access-multiple-close').on('click', function () { $('.select-access-multiple-open').select2('close'); });


        
        $('.select-access-multiple-enable').select2({
            minimumResultsForSearch: Infinity
        });
        $('.access-multiple-disable').on('click', function () { $('.select-access-multiple-enable').prop('disabled', true); });
        $('.access-multiple-enable').on('click', function () { $('.select-access-multiple-enable').prop('disabled', false); });


        
        function create_menu_multiple() {
            $('.select-access-multiple-create').select2({
                minimumResultsForSearch: Infinity
            });
        }
        create_menu_multiple();
        $('.access-multiple-create').on('click', function () { return create_menu_multiple()});
        $('.access-multiple-destroy').on('click', function () { $('.select-access-multiple-create').select2('destroy'); });


        
        $('.select-access-multiple-clear').select2({
            minimumResultsForSearch: Infinity
        });
        $('.access-multiple-clear').on('click', function () { $('.select-access-multiple-clear').val(null).trigger('change'); });
    };


    
    
    

    return {
        init: function() {
            _componentSelect2();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    Select2Selects.init();
});
