
ace.define('ace/theme/limitless', ['require', 'exports', 'module', 'ace/lib/dom'], function (require, exports, module) {
exports.isDark = false;
exports.cssClass = 'ace_limitless';
exports.cssText = `
	
	.ace_limitless {
		--ace-bg: transparent;
		--ace-color: #333;
		--ace-gutter-bg: #eee;
		--ace-gutter-color: #777;
		--ace-selection-bg: #B5D5FF;
		--ace-step-bg: #d3f0e3;
		--ace-bracket-border-color: #999;
		--ace-active-line-bg: rgba(0,0,0,0.075);
		--ace-fold-bg: #C800A4;

		--ace-color-keyword: #C800A4;
		--ace-color-lang: #C800A4;
		--ace-color-numeric: #3A00DC;
		--ace-color-comment: #008E00;
		--ace-color-string: #DF0002;
		--ace-color-attr: #450084;
		--ace-color-type: #790EAD;
		--ace-color-tag: #790EAD;
		--ace-color-class: #790EAD;
		--ace-color-storage: #C900A4;
		--ace-color-char: #275A5E;
		--ace-color-invisible: #bfbfbf;
	}
	[data-color-theme="dark"] .ace_limitless {
		--ace-bg: transparent;
		--ace-color: #F8F8F2;
		--ace-gutter-bg: rgba(0,0,0,0.1);
		--ace-gutter-color: #8F908A;
		--ace-selection-bg: #49483E;
		--ace-step-bg: #665200;
		--ace-bracket-border-color: #49483E;
		--ace-active-line-bg: rgba(255,255,255,0.075);
		--ace-fold-bg: #50fa7b;
		--ace-fold-border-color: #f8f8f2;

		--ace-color-keyword: #ff79c6;
		--ace-color-lang: #bd93f9;
		--ace-color-numeric: #bd93f9;
		--ace-color-comment: #6272a4;
		--ace-color-string: #f1fa8c;
		--ace-color-attr: #50fa7b;
		--ace-color-type: #66d9ef;
		--ace-color-tag: #ff79c6;
		--ace-color-class: #66d9ef;
		--ace-color-storage: #ff79c6;
		--ace-color-char: #bd93f9;
		--ace-color-invisible: #626680;
	}

	
	.ace_limitless {
		background-color: var(--ace-bg);
		color: var(--ace-color);
	}
	.ace_limitless .ace_gutter {
		background-color: var(--ace-gutter-bg);
		color: var(--ace-gutter-color);
	}
	.ace_limitless .ace_print-margin {
		width: 1px;
		background-color: var(--ace-gutter-bg);
	}
	.ace_limitless .ace_cursor {
		color: var(--ace-color);
	}

	
	.ace_limitless .ace_marker-layer .ace_selection {
		background-color: var(--ace-selection-bg);
	}
	.ace_limitless.ace_multiselect .ace_selection.ace_start {
		
	}
	.ace_limitless .ace_marker-layer .ace_selected-word {
		border: 1px solid var(--ace-selection-bg);
	}

	
	.ace_limitless .ace_marker-layer .ace_step {
		background-color: var(--ace-step-bg);
	}
	.ace_limitless .ace_marker-layer .ace_bracket {
		margin: -1px 0 0 -1px;
		border: 1px solid var(--ace-bracket-border-color);
	}

	
	.ace_limitless .ace_marker-layer .ace_active-line,
	.ace_limitless .ace_gutter-active-line {
		background-color: var(--ace-active-line-bg);
	}

	
	.ace_limitless .ace_keyword,
	.ace_limitless .ace_meta {
		color: var(--ace-color-keyword);
	}
	.ace_limitless .ace_constant.ace_language,
	.ace_limitless .ace_variable.ace_language {
		color: var(--ace-color-lang);
	}
	.ace_limitless .ace_invisible {
		color: var(--ace-color-invisible);
	}
	.ace_limitless .ace_constant.ace_character,
	.ace_limitless .ace_constant.ace_other {
		color: var(--ace-color-char);
	}
	.ace_limitless .ace_constant.ace_numeric {
		color: var(--ace-color-numeric);
	}
	.ace_limitless .ace_entity.ace_other.ace_attribute-name,
	.ace_limitless .ace_support.ace_constant,
	.ace_limitless .ace_support.ace_function {
		color: var(--ace-color-attr);
	}
	.ace_limitless .ace_fold {
		background-color: var(--ace-fold-bg);
		border-color: var(--ace-fold-border-color);
	}
	.ace_limitless .ace_support.ace_type {
		color: var(--ace-color-type);
	}
	.ace_limitless .ace_entity.ace_name.ace_tag {
		color: var(--ace-color-tag);
	}
	.ace_limitless .ace_support.ace_class {
		font-style: italic;
		color: var(--ace-color-class);
	}
	.ace_limitless .ace_storage {
		color: var(--ace-color-storage);
	}
	.ace_limitless .ace_string {
		color: var(--ace-color-string);
	}
	.ace_limitless .ace_comment {
		color: var(--ace-color-comment);
	}
	.ace_limitless .ace_indent-guide {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4
	}
	[data-color-theme="dark"] .ace_limitless .ace_indent-guide {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y;
	}
`

	exports.$selectionColorConflict = true;

	var dom = require("../lib/dom");
	dom.importCssString(exports.cssText, exports.cssClass, false);
});
