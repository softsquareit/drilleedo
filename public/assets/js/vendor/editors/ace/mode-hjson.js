define("ace/mode/hjson_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){this.$rules={start:[{include:"#comments"},{include:"#rootObject"},{include:"#value"}],"#array":[{token:"paren.lparen",regex:/\[/,push:[{token:"paren.rparen",regex:/\]/,next:"pop"},{include:"#value"},{include:"#comments"},{token:"text",regex:/,|$/},{token:"invalid.illegal",regex:/[^\s\]]/},{defaultToken:"array"}]}],"#comments":[{token:["comment.punctuation","comment.line"],regex:/(#)(.*$)/},{token:"comment.punctuation",regex:/\/\*/,push:[{token:"comment.punctuation",regex:/\*\
                    window.require(["ace/mode/hjson"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            