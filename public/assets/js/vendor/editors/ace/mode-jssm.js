define("ace/mode/jssm_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){this.$rules={start:[{token:"punctuation.definition.comment.mn",regex:/\/\*/,push:[{token:"punctuation.definition.comment.mn",regex:/\*\
                    window.require(["ace/mode/jssm"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            