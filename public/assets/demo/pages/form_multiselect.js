





var BootstrapMultiselect = function() {


    
    
    

    
    var _componentMultiselect = function() {
        if (!$().multiselect) {
            console.warn('Warning - bootstrap-multiselect.js is not loaded.');
            return;
        }


        
        

        
        $('.multiselect').multiselect();

        
        var $preventDeselectElement = $('.multiselect-prevent-deselect');
        $preventDeselectElement.multiselect({
            onChange: function(option, checked) {
                if (checked === false) {
                    $preventDeselectElement.multiselect('select', option.val());
                }
            }
        });


        
        

        
        $('.multiselect-onchange-notice').multiselect({
            onChange: function(element, checked){
                alert('onChange event fired');
            }
        });

        
        $('.multiselect-show-event').multiselect({
            onDropdownShow: function() {
                alert('onDropdownShow event fired');
            }
        });

        
        $('.multiselect-hide-event').multiselect({
            onDropdownHide: function() {
                alert('onDropdownHide event fired');
            }
        });



        
        

        
        
        

        
        $('.multiselect-method-destroy').multiselect();

        
        $('.multiselect-destroy-button').on('click', function() {
            $('.multiselect-method-destroy').multiselect('destroy');
        });

        
        $('.multiselect-create-button').on('click', function() {
            $('.multiselect-method-destroy').multiselect();
        });


        
        
        

        
        $('.multiselect-method-refresh').multiselect();

        
        $('.multiselect-select-button').on('click', function() {
            
            $('option[value="tomatoes"]', $('.multiselect-method-refresh')).attr('selected', 'selected');
            $('option[value="tomatoes"]', $('.multiselect-method-refresh')).prop('selected', true);
            
            $('option[value="mushrooms"]', $('.multiselect-method-refresh')).prop('selected', true);
            $('option[value="mushrooms"]', $('.multiselect-method-refresh')).attr('selected', 'selected');
            
            $('option[value="onions"]', $('.multiselect-method-refresh')).prop('selected', true);
            $('option[value="onions"]', $('.multiselect-method-refresh')).attr('selected', 'selected');

            alert('Selected Tomatoes, Mushrooms and Onions.');
        });

        
        $('.multiselect-deselect-button').on('click', function() {
            $('option', $('.multiselect-method-refresh')).each(function(element) {
                $(this).removeAttr('selected').prop('selected', false);
            });
        });

        
        $('.multiselect-refresh-button').on('click', function() {
            $('.multiselect-method-refresh').multiselect('refresh');
        });


        
        
        

        
        $('.multiselect-method-rebuild').multiselect();

        
        $('.multiselect-add-button').on('click', function() {
            $('.multiselect-method-rebuild').append('<option value="add1">Addition 1</option><option value="add2">Addition 2</option><option value="add3">Addition 3</option>');
        });

        
        $('.multiselect-delete-button').on('click', function() {
            $('option[value="add1"]', $('.multiselect-method-rebuild')).remove();
            $('option[value="add2"]', $('.multiselect-method-rebuild')).remove();
            $('option[value="add3"]', $('.multiselect-method-rebuild')).remove();
        });

        
        $('.multiselect-rebuild-button').on('click', function() {
            $('.multiselect-method-rebuild').multiselect('rebuild');
        });


        
        
        

        
        $('.multiselect-method-select').multiselect();

        
        $('.multiselect-select-cheese-button').on('click', function() {
            $('.multiselect-method-select').multiselect('select', 'cheese');
        });

        
        $('.multiselect-select-onions-button').on('click', function() {
            $('.multiselect-method-select').multiselect('select', 'onions');
        });


        
        
        

        
        $('.multiselect-method-deselect').multiselect();

        
        $('.multiselect-deselect-cheese-button').on('click', function() {
            $('.multiselect-method-deselect').multiselect('deselect', 'cheese');
        });

        
        $('.multiselect-deselect-onions-button').on('click', function() {
            $('.multiselect-method-deselect').multiselect('deselect', 'onions');
        });


        
        
        

        
        $('.multiselect-method-disable').multiselect();

        
        $('.multiselect-enable1-button').on('click', function() {
            $('.multiselect-method-disable').multiselect('enable');
        });

        
        $('.multiselect-disable1-button').on('click', function() {
            $('.multiselect-method-disable').multiselect('disable');
        });


        
        
        

        
        $('.multiselect-method-enable').multiselect();

        
        $('.multiselect-enable2-button').on('click', function() {
            $('.multiselect-method-enable').multiselect('enable');
        });

        
        $('.multiselect-disable2-button').on('click', function() {
            $('.multiselect-method-enable').multiselect('disable');
        });



        
        

        
        $('.multiselect-simulate-selections').multiselect({
            onChange: function(option, checked) {
                var values = [];
                $('.multiselect-simulate-selections option').each(function() {
                    if ($(this).val() !== option.val()) {
                        values.push($(this).val());
                    }
                });

                $('.multiselect-simulate-selections').multiselect('deselect', values);
            }
        });

        
        $('.multiselect-limit-options').multiselect({
            onChange: function(option, checked) {
                
                var selectedOptions = $('.multiselect-limit-options option:selected');
 
                if (selectedOptions.length >= 3) {
                    
                    var nonSelectedOptions = $('.multiselect-limit-options option').filter(function() {
                        return !$(this).is(':selected');
                    });
 
                    nonSelectedOptions.each(function() {
                        var input = $('input[value="' + $(this).val() + '"]');
                        input.prop('disabled', true);
                        input.parents('.multiselect-item').addClass('disabled');
                    });
                }
                else {
                    
                    $('.multiselect-limit-options option').each(function() {
                        var input = $('input[value="' + $(this).val() + '"]');
                        input.prop('disabled', false);
                        input.parents('.multiselect-item').removeClass('disabled');
                    });
                }
            }
        });


        
        $('.multiselect-templates').multiselect({
            templates: {
                divider: '<div class="multiselect-item dropdown-divider border-danger"></div>'
            }
        });


        
        
        

        
        $('.multiselect-display-values').multiselect();

        
        $('.multiselect-display-values-select').on('click', function() {
            $('.multiselect-display-values').multiselect('select', 'cheese');
            $('.multiselect-display-values').multiselect('select', 'tomatoes');

            $('.values-area').addClass('alert alert-info').text('Selected: ' + $('.multiselect-display-values').val().join(', '));
        });

        
        $('.multiselect-display-values-deselect').on('click', function() {
            $('.multiselect-display-values').multiselect('deselect', 'cheese');
            $('.multiselect-display-values').multiselect('deselect', 'tomatoes');

            $('.values-area').addClass('alert alert-info').text('Selected: ' + $('.multiselect-display-values').val() > 0 ? $('.multiselect-display-values').val().join(', ') : 'Nothing selected');
        });


        
        
        

        
        function multiselect_selected($el) {
            var ret = true;
            $('option', $el).each(function(element) {
                if (!!!$(this).prop('selected')) {
                    ret = false;
                }
            });
            return ret;
        }
        function multiselect_selectAll($el) {
            $('option', $el).each(function(element) {
                $el.multiselect('select', $(this).val());
            });
        }
        function multiselect_deselectAll($el) {
            $('option', $el).each(function(element) {
                $el.multiselect('deselect', $(this).val());
            });
        }
        function multiselect_toggle($el, $btn) {
            if (multiselect_selected($el)) {
                multiselect_deselectAll($el);
                $btn.text('Select All');
            }
            else {
                multiselect_selectAll($el);
                $btn.text('Deselect All');
            }
        }

        
        $('.multiselect-toggle-selection').multiselect();

        
        $('.multiselect-toggle-selection-button').on('click', function(e) {
            e.preventDefault();
            multiselect_toggle($('.multiselect-toggle-selection'), $(this));
        });


        
        
        

        var orderCount = 0;

        
        $('.multiselect-order-options').multiselect({
            buttonText: function(options) {
                if (options.length == 0) {
                    return 'None selected';
                }
                else if (options.length > 3) {
                    return options.length + ' selected';
                }
                else {
                    var selected = [];
                    options.each(function() {
                        selected.push([$(this).text(), $(this).data('order')]);
                    });

                    selected.sort(function(a, b) {
                        return a[1] - b[1];
                    });

                    var text = '';
                    for (var i = 0; i < selected.length; i++) {
                        text += selected[i][0] + ', ';
                    }

                    return text.substr(0, text.length -2);
                }
            },
            onChange: function(option, checked) {
                if (checked) {
                    orderCount++;
                    $(option).data('order', orderCount);
                }
                else {
                    $(option).data('order', '');
                }
            }
        });
     
        
        $('.multiselect-order-options-button').on('click', function() {
            var selected = [];
            $('.multiselect-order-options option:selected').each(function() {
                selected.push([$(this).val(), $(this).data('order')]);
            });

            selected.sort(function(a, b) {
                return a[1] - b[1];
            });

            var text = '';
            for (var i = 0; i < selected.length; i++) {
                text += selected[i][0] + ', ';
            }
            text = text.substring(0, text.length - 2);

            alert(text);
        });


        
        
        

        
        $('.multiselect-reset').multiselect();

        
        $('#multiselect-reset-form').on('reset', function() {
            $('.multiselect-reset option:selected').each(function() {
                $(this).prop('selected', false);
            })

            $('.multiselect-reset').multiselect('refresh');
        });
    };


    
    
    

    return {
        init: function() {
            _componentMultiselect();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    BootstrapMultiselect.init();
});
