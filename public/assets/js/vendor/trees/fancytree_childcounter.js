
















(function (factory) {
	if (typeof define === "function" && define.amd) {
		
		define(["jquery", "./jquery.fancytree"], factory);
	} else if (typeof module === "object" && module.exports) {
		
		require("./jquery.fancytree");
		module.exports = factory(require("jquery"));
	} else {
		
		factory(jQuery);
	}
})(function ($) {
	
	"use strict";

	
	
	

	

	
	

	
	
	
	
	

	$.ui.fancytree._FancytreeClass.prototype.countSelected = function (
		topOnly
	) {
		var tree = this,
			treeOptions = tree.options;

		return tree.getSelectedNodes(topOnly).length;
	};

	
	
	
	
	
	
	$.ui.fancytree._FancytreeNodeClass.prototype.updateCounters = function () {
		var node = this,
			$badge = $("span.fancytree-childcounter", node.span),
			extOpts = node.tree.options.childcounter,
			count = node.countChildren(extOpts.deep);

		node.data.childCounter = count;
		if (
			(count || !extOpts.hideZeros) &&
			(!node.isExpanded() || !extOpts.hideExpanded)
		) {
			if (!$badge.length) {
				$badge = $("<span class='fancytree-childcounter'/>").appendTo(
					$(
						"span.fancytree-icon,span.fancytree-custom-icon",
						node.span
					)
				);
			}
			$badge.text(count);
		} else {
			$badge.remove();
		}
		if (extOpts.deep && !node.isTopLevel() && !node.isRootNode()) {
			node.parent.updateCounters();
		}
	};

	
	
	
	

	$.ui.fancytree.prototype.widgetMethod1 = function (arg1) {
		var tree = this.tree;
		return arg1;
	};

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	$.ui.fancytree.registerExtension({
		
		name: "childcounter",
		
		version: "2.38.2",

		
		

		options: {
			deep: true,
			hideZeros: true,
			hideExpanded: false,
		},

		
		
		
		
		foo: 42,

		
		

		_appendCounter: function (bar) {
			var tree = this;
		},

		
		
		
		
		
		
		
		
		
		

		
		
		
		treeInit: function (ctx) {
			var tree = this, 
				opts = ctx.options,
				extOpts = ctx.options.childcounter;
			
			
			
			this._superApply(arguments);
			
			this.$container.addClass("fancytree-ext-childcounter");
		},

		
		

		treeDestroy: function (ctx) {
			this._superApply(arguments);
		},

		
		nodeRenderTitle: function (ctx, title) {
			var node = ctx.node,
				extOpts = ctx.options.childcounter,
				count =
					node.data.childCounter == null
						? node.countChildren(extOpts.deep)
						: +node.data.childCounter;
			
			
			
			this._super(ctx, title);
			
			if (
				(count || !extOpts.hideZeros) &&
				(!node.isExpanded() || !extOpts.hideExpanded)
			) {
				$(
					"span.fancytree-icon,span.fancytree-custom-icon",
					node.span
				).append(
					$("<span class='fancytree-childcounter'/>").text(count)
				);
			}
		},
		
		nodeSetExpanded: function (ctx, flag, callOpts) {
			var tree = ctx.tree,
				node = ctx.node;
			
			
			return this._superApply(arguments).always(function () {
				tree.nodeRenderTitle(ctx);
			});
		},

		
	});
	
	return $.ui.fancytree;
}); 
