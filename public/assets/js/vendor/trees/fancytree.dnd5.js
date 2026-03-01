



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

	
	var FT = $.ui.fancytree,
		isMac = /Mac/.test(navigator.platform),
		classDragSource = "fancytree-drag-source",
		classDragRemove = "fancytree-drag-remove",
		classDropAccept = "fancytree-drop-accept",
		classDropAfter = "fancytree-drop-after",
		classDropBefore = "fancytree-drop-before",
		classDropOver = "fancytree-drop-over",
		classDropReject = "fancytree-drop-reject",
		classDropTarget = "fancytree-drop-target",
		nodeMimeType = "application/x-fancytree-node",
		$dropMarker = null,
		$dragImage,
		$extraHelper,
		SOURCE_NODE = null,
		SOURCE_NODE_LIST = null,
		$sourceList = null,
		DRAG_ENTER_RESPONSE = null,
		
		SUGGESTED_DROP_EFFECT = null,
		REQUESTED_DROP_EFFECT = null,
		REQUESTED_EFFECT_ALLOWED = null,
		LAST_HIT_MODE = null,
		DRAG_OVER_STAMP = null; 

	
	function _clearGlobals() {
		DRAG_ENTER_RESPONSE = null;
		DRAG_OVER_STAMP = null;
		REQUESTED_DROP_EFFECT = null;
		REQUESTED_EFFECT_ALLOWED = null;
		SUGGESTED_DROP_EFFECT = null;
		SOURCE_NODE = null;
		SOURCE_NODE_LIST = null;
		if ($sourceList) {
			$sourceList.removeClass(classDragSource + " " + classDragRemove);
		}
		$sourceList = null;
		if ($dropMarker) {
			$dropMarker.hide();
		}
		
		if ($extraHelper) {
			$extraHelper.remove();
			$extraHelper = null;
		}
	}

	
	function offsetString(n) {
		
		return n === 0 ? "" : n > 0 ? "+" + n : "" + n;
	}

	
	function normalizeDragEnterResponse(r) {
		var res;

		if (!r) {
			return false;
		}
		if ($.isPlainObject(r)) {
			res = {
				over: !!r.over,
				before: !!r.before,
				after: !!r.after,
			};
		} else if (Array.isArray(r)) {
			res = {
				over: $.inArray("over", r) >= 0,
				before: $.inArray("before", r) >= 0,
				after: $.inArray("after", r) >= 0,
			};
		} else {
			res = {
				over: r === true || r === "over",
				before: r === true || r === "before",
				after: r === true || r === "after",
			};
		}
		if (Object.keys(res).length === 0) {
			return false;
		}
		
		
		
		return res;
	}

	
	
	
	
	
	
	
	
	
	
	

	
	

	
	function autoScroll(tree, event) {
		var spOfs,
			scrollTop,
			delta,
			dndOpts = tree.options.dnd5,
			sp = tree.$scrollParent[0],
			sensitivity = dndOpts.scrollSensitivity,
			speed = dndOpts.scrollSpeed,
			scrolled = 0;

		if (sp !== document && sp.tagName !== "HTML") {
			spOfs = tree.$scrollParent.offset();
			scrollTop = sp.scrollTop;
			if (spOfs.top + sp.offsetHeight - event.pageY < sensitivity) {
				delta =
					sp.scrollHeight -
					tree.$scrollParent.innerHeight() -
					scrollTop;
				
				
				
				
				
				
				
				if (delta > 0) {
					sp.scrollTop = scrolled = scrollTop + speed;
				}
			} else if (scrollTop > 0 && event.pageY - spOfs.top < sensitivity) {
				sp.scrollTop = scrolled = scrollTop - speed;
			}
		} else {
			scrollTop = $(document).scrollTop();
			if (scrollTop > 0 && event.pageY - scrollTop < sensitivity) {
				scrolled = scrollTop - speed;
				$(document).scrollTop(scrolled);
			} else if (
				$(window).height() - (event.pageY - scrollTop) <
				sensitivity
			) {
				scrolled = scrollTop + speed;
				$(document).scrollTop(scrolled);
			}
		}
		if (scrolled) {
			tree.debug("autoScroll: " + scrolled + "px");
		}
		return scrolled;
	}

	
	function evalEffectModifiers(tree, event, effectDefault) {
		var res = effectDefault;

		if (isMac) {
			if (event.metaKey && event.altKey) {
				
				res = "link";
			} else if (event.ctrlKey) {
				
				res = "link";
			} else if (event.metaKey) {
				
				res = "move";
			} else if (event.altKey) {
				
				res = "copy";
			}
		} else {
			if (event.ctrlKey) {
				
				res = "copy";
			} else if (event.shiftKey) {
				
				res = "move";
			} else if (event.altKey) {
				
				res = "link";
			}
		}
		if (res !== SUGGESTED_DROP_EFFECT) {
			tree.info(
				"evalEffectModifiers: " +
					event.type +
					" - evalEffectModifiers(): " +
					SUGGESTED_DROP_EFFECT +
					" -> " +
					res
			);
		}
		SUGGESTED_DROP_EFFECT = res;
		
		return res;
	}
	
	function prepareDropEffectCallback(event, data) {
		var tree = data.tree,
			dataTransfer = data.dataTransfer;

		if (event.type === "dragstart") {
			data.effectAllowed = tree.options.dnd5.effectAllowed;
			data.dropEffect = tree.options.dnd5.dropEffectDefault;
		} else {
			data.effectAllowed = REQUESTED_EFFECT_ALLOWED;
			data.dropEffect = REQUESTED_DROP_EFFECT;
		}
		data.dropEffectSuggested = evalEffectModifiers(
			tree,
			event,
			tree.options.dnd5.dropEffectDefault
		);
		data.isMove = data.dropEffect === "move";
		data.files = dataTransfer.files || [];

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}

	function applyDropEffectCallback(event, data, allowDrop) {
		var tree = data.tree,
			dataTransfer = data.dataTransfer;

		if (
			event.type !== "dragstart" &&
			REQUESTED_EFFECT_ALLOWED !== data.effectAllowed
		) {
			tree.warn(
				"effectAllowed should only be changed in dragstart event: " +
					event.type +
					": data.effectAllowed changed from " +
					REQUESTED_EFFECT_ALLOWED +
					" -> " +
					data.effectAllowed
			);
		}

		if (allowDrop === false) {
			tree.info("applyDropEffectCallback: allowDrop === false");
			data.effectAllowed = "none";
			data.dropEffect = "none";
		}
		
		
		
		
		
		
		
		
		
		

		data.isMove = data.dropEffect === "move";
		

		
		
		if (event.type === "dragstart") {
			REQUESTED_EFFECT_ALLOWED = data.effectAllowed;
			REQUESTED_DROP_EFFECT = data.dropEffect;
		}

		
		
		
		
		
		
		
		
		
		
		dataTransfer.effectAllowed = REQUESTED_EFFECT_ALLOWED;
		dataTransfer.dropEffect = REQUESTED_DROP_EFFECT;

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		return REQUESTED_DROP_EFFECT;
	}

	
	function handleDragOver(event, data) {
		
		if (data.options.dnd5.scroll) {
			autoScroll(data.tree, event);
		}
		
		if (!data.node) {
			data.tree.warn("Ignored dragover for non-node"); 
			return LAST_HIT_MODE;
		}

		var markerOffsetX,
			nodeOfs,
			pos,
			relPosY,
			hitMode = null,
			tree = data.tree,
			options = tree.options,
			dndOpts = options.dnd5,
			targetNode = data.node,
			sourceNode = data.otherNode,
			markerAt = "center",
			$target = $(targetNode.span),
			$targetTitle = $target.find("span.fancytree-title");

		if (DRAG_ENTER_RESPONSE === false) {
			tree.debug("Ignored dragover, since dragenter returned false.");
			return false;
		} else if (typeof DRAG_ENTER_RESPONSE === "string") {
			$.error("assert failed: dragenter returned string");
		}
		
		nodeOfs = $target.offset();
		relPosY = (event.pageY - nodeOfs.top) / $target.height();
		if (event.pageY === undefined) {
			tree.warn("event.pageY is undefined: see issue #1013.");
		}

		if (DRAG_ENTER_RESPONSE.after && relPosY > 0.75) {
			hitMode = "after";
		} else if (
			!DRAG_ENTER_RESPONSE.over &&
			DRAG_ENTER_RESPONSE.after &&
			relPosY > 0.5
		) {
			hitMode = "after";
		} else if (DRAG_ENTER_RESPONSE.before && relPosY <= 0.25) {
			hitMode = "before";
		} else if (
			!DRAG_ENTER_RESPONSE.over &&
			DRAG_ENTER_RESPONSE.before &&
			relPosY <= 0.5
		) {
			hitMode = "before";
		} else if (DRAG_ENTER_RESPONSE.over) {
			hitMode = "over";
		}
		
		
		if (dndOpts.preventVoidMoves && data.dropEffect === "move") {
			if (targetNode === sourceNode) {
				targetNode.debug("Drop over source node prevented.");
				hitMode = null;
			} else if (
				hitMode === "before" &&
				sourceNode &&
				targetNode === sourceNode.getNextSibling()
			) {
				targetNode.debug("Drop after source node prevented.");
				hitMode = null;
			} else if (
				hitMode === "after" &&
				sourceNode &&
				targetNode === sourceNode.getPrevSibling()
			) {
				targetNode.debug("Drop before source node prevented.");
				hitMode = null;
			} else if (
				hitMode === "over" &&
				sourceNode &&
				sourceNode.parent === targetNode &&
				sourceNode.isLastSibling()
			) {
				targetNode.debug("Drop last child over own parent prevented.");
				hitMode = null;
			}
		}
		
		data.hitMode = hitMode;
		if (hitMode && dndOpts.dragOver) {
			prepareDropEffectCallback(event, data);
			dndOpts.dragOver(targetNode, data);
			var allowDrop = !!hitMode;
			applyDropEffectCallback(event, data, allowDrop);
			hitMode = data.hitMode;
		}
		LAST_HIT_MODE = hitMode;
		
		if (hitMode === "after" || hitMode === "before" || hitMode === "over") {
			markerOffsetX = dndOpts.dropMarkerOffsetX || 0;
			switch (hitMode) {
				case "before":
					markerAt = "top";
					markerOffsetX += dndOpts.dropMarkerInsertOffsetX || 0;
					break;
				case "after":
					markerAt = "bottom";
					markerOffsetX += dndOpts.dropMarkerInsertOffsetX || 0;
					break;
			}

			pos = {
				my: "left" + offsetString(markerOffsetX) + " center",
				at: "left " + markerAt,
				of: $targetTitle,
			};
			if (options.rtl) {
				pos.my = "right" + offsetString(-markerOffsetX) + " center";
				pos.at = "right " + markerAt;
				
			}
			$dropMarker
				.toggleClass(classDropAfter, hitMode === "after")
				.toggleClass(classDropOver, hitMode === "over")
				.toggleClass(classDropBefore, hitMode === "before")
				.show()
				.position(FT.fixPositionOptions(pos));
		} else {
			$dropMarker.hide();
			
		}

		$(targetNode.span)
			.toggleClass(
				classDropTarget,
				hitMode === "after" ||
					hitMode === "before" ||
					hitMode === "over"
			)
			.toggleClass(classDropAfter, hitMode === "after")
			.toggleClass(classDropBefore, hitMode === "before")
			.toggleClass(classDropAccept, hitMode === "over")
			.toggleClass(classDropReject, hitMode === false);

		return hitMode;
	}

	
	function onDragEvent(event) {
		var json,
			tree = this,
			dndOpts = tree.options.dnd5,
			node = FT.getNode(event),
			dataTransfer =
				event.dataTransfer || event.originalEvent.dataTransfer,
			data = {
				tree: tree,
				node: node,
				options: tree.options,
				originalEvent: event.originalEvent,
				widget: tree.widget,
				dataTransfer: dataTransfer,
				useDefaultImage: true,
				dropEffect: undefined,
				dropEffectSuggested: undefined,
				effectAllowed: undefined, 
				files: undefined, 
				isCancelled: undefined, 
				isMove: undefined,
			};

		switch (event.type) {
			case "dragstart":
				if (!node) {
					tree.info("Ignored dragstart on a non-node.");
					return false;
				}
				
				SOURCE_NODE = node;

				
				if (dndOpts.multiSource === false) {
					SOURCE_NODE_LIST = [node];
				} else if (dndOpts.multiSource === true) {
					if (node.isSelected()) {
						SOURCE_NODE_LIST = tree.getSelectedNodes();
					} else {
						SOURCE_NODE_LIST = [node];
					}
				} else {
					SOURCE_NODE_LIST = dndOpts.multiSource(node, data);
				}
				
				$sourceList = $(
					$.map(SOURCE_NODE_LIST, function (n) {
						return n.span;
					})
				);
				
				$sourceList.addClass(classDragSource);

				
				
				
				
				
				
				
				var nodeData = node.toDict(true, dndOpts.sourceCopyHook);
				nodeData.treeId = node.tree._id;
				json = JSON.stringify(nodeData);
				try {
					dataTransfer.setData(nodeMimeType, json);
					dataTransfer.setData("text/html", $(node.span).html());
					dataTransfer.setData("text/plain", node.title);
				} catch (ex) {
					
					tree.warn(
						"Could not set data (IE only accepts 'text') - " + ex
					);
				}
				
				
				
				
				
				
				
				
				
				if (dndOpts.setTextTypeJson) {
					dataTransfer.setData("text", json);
				} else {
					dataTransfer.setData("text", node.title);
				}

				
				
				
				prepareDropEffectCallback(event, data);

				
				
				if (dndOpts.dragStart(node, data) === false) {
					
					
					_clearGlobals();
					return false;
				}
				applyDropEffectCallback(event, data);

				
				
				$extraHelper = null;

				if (data.useDefaultImage) {
					
					$dragImage = $(node.span).find(".fancytree-title");

					if (SOURCE_NODE_LIST && SOURCE_NODE_LIST.length > 1) {
						
						
						
						
						
						
						
						
						$extraHelper = $(
							"<span class='fancytree-childcounter'/>"
						)
							.text("+" + (SOURCE_NODE_LIST.length - 1))
							.appendTo($dragImage);
					}
					if (dataTransfer.setDragImage) {
						
						dataTransfer.setDragImage($dragImage[0], -10, -10);
					}
				}
				return true;

			case "drag":
				
				
				
				prepareDropEffectCallback(event, data);
				dndOpts.dragDrag(node, data);
				applyDropEffectCallback(event, data);

				$sourceList.toggleClass(classDragRemove, data.isMove);
				break;

			case "dragend":
				
				
				
				
				prepareDropEffectCallback(event, data);

				_clearGlobals();

				data.isCancelled = !LAST_HIT_MODE;
				dndOpts.dragEnd(node, data, !LAST_HIT_MODE);
				
				break;
		}
	}
	
	function onDropEvent(event) {
		var json,
			allowAutoExpand,
			nodeData,
			isSourceFtNode,
			r,
			res,
			tree = this,
			dndOpts = tree.options.dnd5,
			allowDrop = null,
			node = FT.getNode(event),
			dataTransfer =
				event.dataTransfer || event.originalEvent.dataTransfer,
			data = {
				tree: tree,
				node: node,
				options: tree.options,
				originalEvent: event.originalEvent,
				widget: tree.widget,
				hitMode: DRAG_ENTER_RESPONSE,
				dataTransfer: dataTransfer,
				otherNode: SOURCE_NODE || null,
				otherNodeList: SOURCE_NODE_LIST || null,
				otherNodeData: null, 
				useDefaultImage: true,
				dropEffect: undefined,
				dropEffectSuggested: undefined,
				effectAllowed: undefined, 
				files: null, 
				isCancelled: undefined, 
				isMove: undefined,
			};

		

		switch (event.type) {
			case "dragenter":
				
				

				DRAG_OVER_STAMP = null;
				if (!node) {
					
					tree.debug(
						"Ignore non-node " +
							event.type +
							": " +
							event.target.tagName +
							"." +
							event.target.className
					);
					DRAG_ENTER_RESPONSE = false;
					break;
				}

				$(node.span)
					.addClass(classDropOver)
					.removeClass(classDropAccept + " " + classDropReject);

				
				
				isSourceFtNode =
					$.inArray(nodeMimeType, dataTransfer.types) >= 0;

				if (dndOpts.preventNonNodes && !isSourceFtNode) {
					node.debug("Reject dropping a non-node.");
					DRAG_ENTER_RESPONSE = false;
					break;
				} else if (
					dndOpts.preventForeignNodes &&
					(!SOURCE_NODE || SOURCE_NODE.tree !== node.tree)
				) {
					node.debug("Reject dropping a foreign node.");
					DRAG_ENTER_RESPONSE = false;
					break;
				} else if (
					dndOpts.preventSameParent &&
					data.otherNode &&
					data.otherNode.tree === node.tree &&
					node.parent === data.otherNode.parent
				) {
					node.debug("Reject dropping as sibling (same parent).");
					DRAG_ENTER_RESPONSE = false;
					break;
				} else if (
					dndOpts.preventRecursion &&
					data.otherNode &&
					data.otherNode.tree === node.tree &&
					node.isDescendantOf(data.otherNode)
				) {
					node.debug("Reject dropping below own ancestor.");
					DRAG_ENTER_RESPONSE = false;
					break;
				} else if (dndOpts.preventLazyParents && !node.isLoaded()) {
					node.warn("Drop over unloaded target node prevented.");
					DRAG_ENTER_RESPONSE = false;
					break;
				}
				$dropMarker.show();

				
				prepareDropEffectCallback(event, data);
				r = dndOpts.dragEnter(node, data);

				res = normalizeDragEnterResponse(r);
				
				DRAG_ENTER_RESPONSE = res;

				allowDrop = res && (res.over || res.before || res.after);

				applyDropEffectCallback(event, data, allowDrop);
				break;

			case "dragover":
				if (!node) {
					tree.debug(
						"Ignore non-node " +
							event.type +
							": " +
							event.target.tagName +
							"." +
							event.target.className
					);
					break;
				}
				
				
				
				
				
				
				
				
				prepareDropEffectCallback(event, data);
				LAST_HIT_MODE = handleDragOver(event, data);

				
				allowDrop = !!LAST_HIT_MODE;
				allowAutoExpand =
					LAST_HIT_MODE === "over" || LAST_HIT_MODE === false;

				if (
					allowAutoExpand &&
					!node.expanded &&
					node.hasChildren() !== false
				) {
					if (!DRAG_OVER_STAMP) {
						DRAG_OVER_STAMP = Date.now();
					} else if (
						dndOpts.autoExpandMS &&
						Date.now() - DRAG_OVER_STAMP > dndOpts.autoExpandMS &&
						!node.isLoading() &&
						(!dndOpts.dragExpand ||
							dndOpts.dragExpand(node, data) !== false)
					) {
						node.setExpanded();
					}
				} else {
					DRAG_OVER_STAMP = null;
				}
				break;

			case "dragleave":
				
				
				if (!node) {
					tree.debug(
						"Ignore non-node " +
							event.type +
							": " +
							event.target.tagName +
							"." +
							event.target.className
					);
					break;
				}
				if (!$(node.span).hasClass(classDropOver)) {
					node.debug("Ignore dragleave (multi).");
					break;
				}
				$(node.span).removeClass(
					classDropOver +
						" " +
						classDropAccept +
						" " +
						classDropReject
				);
				node.scheduleAction("cancel");
				dndOpts.dragLeave(node, data);
				$dropMarker.hide();
				break;

			case "drop":
				

				if ($.inArray(nodeMimeType, dataTransfer.types) >= 0) {
					nodeData = dataTransfer.getData(nodeMimeType);
					tree.info(
						event.type +
							": getData('application/x-fancytree-node'): '" +
							nodeData +
							"'"
					);
				}
				if (!nodeData) {
					
					
					
					nodeData = dataTransfer.getData("text");
					tree.info(
						event.type + ": getData('text'): '" + nodeData + "'"
					);
				}
				if (nodeData) {
					try {
						
						
						json = JSON.parse(nodeData);
						if (json.title !== undefined) {
							data.otherNodeData = json;
						}
					} catch (ex) {
						
						
					}
				}
				tree.debug(
					event.type +
						": nodeData: '" +
						nodeData +
						"', otherNodeData: ",
					data.otherNodeData
				);

				$(node.span).removeClass(
					classDropOver +
						" " +
						classDropAccept +
						" " +
						classDropReject
				);

				
				data.hitMode = LAST_HIT_MODE;
				prepareDropEffectCallback(event, data, !LAST_HIT_MODE);
				data.isCancelled = !LAST_HIT_MODE;

				var orgSourceElem = SOURCE_NODE && SOURCE_NODE.span,
					orgSourceTree = SOURCE_NODE && SOURCE_NODE.tree;

				dndOpts.dragDrop(node, data);
				

				
				event.preventDefault();

				if (orgSourceElem && !document.body.contains(orgSourceElem)) {
					
					
					if (orgSourceTree === tree) {
						tree.debug(
							"Drop handler removed source element: generating dragEnd."
						);
						dndOpts.dragEnd(SOURCE_NODE, data);
					} else {
						tree.warn(
							"Drop handler removed source element: dragend event may be lost."
						);
					}
				}

				_clearGlobals();

				break;
		}
		
		if (allowDrop) {
			event.preventDefault();
			return false;
		}
	}

	
	$.ui.fancytree.getDragNodeList = function () {
		return SOURCE_NODE_LIST || [];
	};

	
	$.ui.fancytree.getDragNode = function () {
		return SOURCE_NODE;
	};

	

	$.ui.fancytree.registerExtension({
		name: "dnd5",
		version: "2.38.2",
		
		options: {
			autoExpandMS: 1500, 
			dropMarkerInsertOffsetX: -16, 
			dropMarkerOffsetX: -24, 
			
			dropMarkerParent: "body", 
			multiSource: false, 
			effectAllowed: "all", 
			
			dropEffectDefault: "move", 
			preventForeignNodes: false, 
			preventLazyParents: true, 
			preventNonNodes: false, 
			preventRecursion: true, 
			preventSameParent: false, 
			preventVoidMoves: true, 
			scroll: true, 
			scrollSensitivity: 20, 
			scrollSpeed: 5, 
			setTextTypeJson: false, 
			sourceCopyHook: null, 
			
			dragStart: null, 
			dragDrag: $.noop, 
			dragEnd: $.noop, 
			
			dragEnter: null, 
			dragOver: $.noop, 
			dragExpand: $.noop, 
			dragDrop: $.noop, 
			dragLeave: $.noop, 
		},

		treeInit: function (ctx) {
			var $temp,
				tree = ctx.tree,
				opts = ctx.options,
				glyph = opts.glyph || null,
				dndOpts = opts.dnd5;

			if ($.inArray("dnd", opts.extensions) >= 0) {
				$.error("Extensions 'dnd' and 'dnd5' are mutually exclusive.");
			}
			if (dndOpts.dragStop) {
				$.error(
					"dragStop is not used by ext-dnd5. Use dragEnd instead."
				);
			}
			if (dndOpts.preventRecursiveMoves != null) {
				$.error(
					"preventRecursiveMoves was renamed to preventRecursion."
				);
			}

			
			
			if (dndOpts.dragStart) {
				FT.overrideMethod(
					ctx.options,
					"createNode",
					function (event, data) {
						
						this._super.apply(this, arguments);
						if (data.node.span) {
							data.node.span.draggable = true;
						} else {
							data.node.warn(
								"Cannot add `draggable`: no span tag"
							);
						}
					}
				);
			}
			this._superApply(arguments);

			this.$container.addClass("fancytree-ext-dnd5");

			
			
			
			$temp = $("<span>").appendTo(this.$container);
			this.$scrollParent = $temp.scrollParent();
			$temp.remove();

			$dropMarker = $("#fancytree-drop-marker");
			if (!$dropMarker.length) {
				$dropMarker = $("<div id='fancytree-drop-marker'></div>")
					.hide()
					.css({
						"z-index": 1000,
						
						"pointer-events": "none",
					})
					.prependTo(dndOpts.dropMarkerParent);
				if (glyph) {
					FT.setSpanIcon(
						$dropMarker[0],
						glyph.map._addClass,
						glyph.map.dropMarker
					);
				}
			}
			$dropMarker.toggleClass("fancytree-rtl", !!opts.rtl);

			
			if (dndOpts.dragStart) {
				
				tree.$container.on(
					"dragstart drag dragend",
					onDragEvent.bind(tree)
				);
			}
			
			if (dndOpts.dragEnter) {
				
				tree.$container.on(
					"dragenter dragover dragleave drop",
					onDropEvent.bind(tree)
				);
			}
		},
	});
	
	return $.ui.fancytree;
}); 
