define("ace/mode/maze_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){this.$rules={start:[{token:"keyword.control",regex:/##|``/,comment:"Wall"},{token:"entity.name.tag",regex:/\.\./,comment:"Path"},{token:"keyword.control",regex:/<>/,comment:"Splitter"},{token:"entity.name.tag",regex:/\*[\*A-Za-z0-9]/,comment:"Signal"},{token:"constant.numeric",regex:/[0-9]{2}/,comment:"Pause"},{token:"keyword.control",regex:/\^\^/,comment:"Start"},{token:"keyword.control",regex:/\(\)/,comment:"Hole"},{token:"support.function",regex:/>>/,comment:"Out"},{token:"support.function",regex:/>\
                    window.require(["ace/mode/maze"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            