





var Fancytree = function() {


    
    
    

    
    var _componentFancytree = function() {
        if (!$().fancytree) {
            console.warn('Warning - fancytree_all.min.js is not loaded.');
            return;
        }


        
        

        
        $('.tree-default').fancytree({
            init: function(event, data) {
                $('.has-tooltip .fancytree-title').tooltip();
            }
        });

        
        $('.tree-ajax').fancytree({
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            },
            init: function(event, data) {
                $('.has-tooltip .fancytree-title').tooltip();
            }
        });

        
        $('.tree-json').fancytree({
            init: function(event, data) {
                $('.has-tooltip .fancytree-title').tooltip();
            }
        });

        
        $('.tree-child-count').fancytree({
            extensions: ['childcounter'],
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            },
            childcounter: {
                deep: true,
                hideZeros: true,
                hideExpanded: true
            },
            init: function(event, data) {
                $('.has-tooltip .fancytree-title').tooltip();
            }
        });

        
        $('.tree-drag').fancytree({
            extensions: ['dnd5'],
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            },
            dnd5: {
                autoExpandMS: 400,
                focusOnClick: true,
                preventVoidMoves: true, 
                preventRecursion: true, 
                dragStart: function(node, data) {
                    return true;
                },
                dragEnter: function(node, data) {
                    return true;
                },
                dragDrop: function(node, data) {

                    
                    data.otherNode.moveTo(node, data.hitMode);
                }
            },
            init: function(event, data) {
                $('.has-tooltip .fancytree-title').tooltip();
            }
        });

        
        $('.tree-editable').fancytree({
            extensions: ['edit'],
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            },
            edit: {
                adjustWidthOfs: 0,
                inputCss: {minWidth: '0'},
                triggerStart: ['f2', 'dblclick', 'shift+click', 'mac+enter'],
                save: function(event, data) {
                    alert('save ' + data.input.val()); 
                }
            }
        });


        
        
        

        
        $('.tree-radio').fancytree({
            checkbox: true,
            selectMode: 1,
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            }    
        });

        
        $('.tree-checkbox').fancytree({
            checkbox: true,
            selectMode: 2,
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            }
        });

        
        $('.tree-checkbox-options').fancytree({
            checkbox: true,
            selectMode: 2
        });

        
        $('.tree-checkbox-hierarchical').fancytree({
            checkbox: true,
            selectMode: 3
        });


        
        
        

        
        $('.tree-checkbox-toggle').fancytree({
            checkbox: true,
            selectMode: 2,
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            }    
        });

        
        var selectAllSwitch = document.querySelector('#select_all');

        
        selectAllSwitch.addEventListener('change', function() {
            if(selectAllSwitch.checked) {

                $.ui.fancytree.getTree('.tree-checkbox-toggle').visit(function(node){
                    node.setSelected(true);
                });
                return false;
            }
            else {
                $.ui.fancytree.getTree('.tree-checkbox-toggle').visit(function(node){
                    node.setSelected(false);
                });
                return false;
            }
        });



        
        

        
        
        

        
        var enableDisableSwitch = document.querySelector('#enable_disable');

        
        enableDisableSwitch.addEventListener('change', function() {
            if(enableDisableSwitch.checked) {
                $('.tree-toggle').fancytree('disable');
            }
            else {
                $('.tree-toggle').fancytree('enable');
            }
        });

        
        $('.tree-toggle').fancytree({
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            },
            init: function(event, data) {
                $('.has-tooltip .fancytree-title').tooltip();
            }
        });


        
        
        

        
        $('.tree-sorting').fancytree();

        
        $('.sort-tree').on('click', function() {
            var node = $.ui.fancytree.getTree('.tree-sorting').getRootNode();
            node.sortChildren(null, true);
        });

        
        $('.sort-branch').on('click', function() {
            var node = $.ui.fancytree.getTree('.tree-sorting').getActiveNode();

            
            var cmp = function(a, b) {
                a = a.title.toLowerCase();
                b = b.title.toLowerCase();
                return a > b ? 1 : a < b ? -1 : 0;
            };
            node.sortChildren(cmp, false);
        });


        
        
        

        
        $('.tree-persistence').fancytree({
            extensions: ['persist'],
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            },
            checkbox: true,
            persist: {
                overrideSource: false, 
                store: 'auto' 
            },
            postProcess: function(event, data) {
                var prefix = data.node.getIndexHier() + '.';
                $.each(data.response, function(idx, childEntry) {
                    if( childEntry.key == null ) {
                        childEntry.key = prefix + (idx + 1);
                        childEntry.title += ' (' + childEntry.key + ')';
                    }
                })
            }
        });
        var tree5 = $.ui.fancytree.getTree('.tree-persistence');

        
        $('.reset-cookies').on('click', function() {
            tree5.clearPersistData();
        });


        
        
        

        $('.tree-table').fancytree({
            extensions: ['table'],
            checkbox: true,
            table: {
                indentation: 20,      
                nodeColumnIdx: 2,     
                checkboxColumnIdx: 0  
            },
            source: {
                url: '../../../assets/demo/data/fancytree/fancytree.json'
            },
            lazyLoad: function(event, data) {
                data.result = {url: 'ajax-sub2.json'}
            },
            renderColumns: function(event, data) {
                var node = data.node,
                $tdList = $(node.tr).find('>td');

                
                $tdList.eq(1).text(node.getIndexHier()).addClass('alignRight');

                
                $tdList.eq(3).text(node.key);
                $tdList.eq(4).addClass('text-center').html('<label class="form-check"><input type="checkbox" class="form-check-input" name="like" value="' + node.key + '"><span class="form-check-label p-0"></span></label>');
            }
        });

        
        $('.tree-table').on('input[name=like]', 'click', function(e) {
            var node = $.ui.fancytree.getNode(e),
            $input = $(e.target);
            e.stopPropagation(); 
            if($input.is(':checked')){
                alert('like ' + $input.val());
            }
            else{
                alert('dislike ' + $input.val());
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentFancytree();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    Fancytree.init();
});
