~(function(fn){
	switch(true){
		case "jQuery" in window:
			if(typeof bootstrap === "function")
				bootstrap("promise", fn);
		break;
		case typeof exports === "object":
			module.exports = fn();
		break;
		case typeof define === "function" && define.amd:
			define(fn);
		break;
		case typeof ses !== "undefined":
			if(!ses.ok())
				return;
			ses.makeQ = fn;
		break;
		default:
			fn();
		break;
	}
	//检测lib fn // cdn
})(function(){
	~~(function(document){
		var dx = (function(){
			var dx = {};
			dx.select = dx.selectAll = function(selector, context){
				return new dx.fn.init(selector, context);	//return jQuery(selector)
			};
			dx.fn = dx.prototype = {
				init: function(selector, context){
					//DOM handler
					if(selector.nodeType || selector == window){
						this[0] = selector;
						this.length = 1;
						return this;	
					}
				},
				sort: [].sort,//behaves like an array
				length: 0
			};
			dx.fn.init.prototype = dx.prototype;
			dx.extend = dx.fn.extend = function(){
				var target = arguments[0] || {},
					i = 1,
					length = arguments.length,
					deep = false,
					prop;
				if(target.constructor == Boolean){
					deep = target;
					target = arguments[1] || {};//深度复制	
				}
				if(length == 1){
					target = this;
					i = 0;
				}
				//多继承
				for(; i < length; i++){
					if((prop = arguments[i]) != null){
						//复制对象
						for(var p in prop){
							if(target == prop[p])
								continue;//对象已经存在
							
							if(deep && typeof prop[i] == "object" && target[p]){
								dx.extend(target[p], prop[p]);	
							}
							else if(prop[p]){
								target[p] = prop[p];
								//prop[p].prototype.constructor = prop[p];
							}
						}
					}
				}
				return target;
			};
			dx.ns = dx.namespace = function(){
				var len = arguments.length,
					i = 0,
					d,
					o;
				for(; i < len; i++){
					d = arguments[i].split(".");
					o = window[d[0]] = window[d[0]] || {};
					for(var j = 0, s = d.slice(1); j < s.length; j++){
						o = o[s[j]] = o[s[j]] || {};
					}
				}
				return o;
			};
			return dx;
		})();
		this["dx"] = dx;
	}).call(this, document);
	(function(window, document){
		/**
		 * TreeModel
		 */
		function TreeModel(){
			 
		}
		/**
		 * set dom model of the tree
		 */
		TreeModel.prototype.setModel = function(model){
			this.model = model;
		};
		/**
		 * get the tree dom model
		 */
		TreeModel.prototype.getModel = function(){
			return this.model || "<dl>";
		};
		
		/**
		 * Returns the child of parent at index
		 */
		TreeModel.prototype.getChild = function(parent, index){
			
		};
		/**
		 * Returns the number of children of the node parent
		 */
		TreeModel.prototype.getChildCount = function(parent){
			return this.children.length;
		};
		/**
		 * Returns the index of the child in the parent, or -1
		 */
		TreeModel.prototype.getIndexOfChild = function(parent, child){
			
		};
		/**
		 * the listener to add
		 */
		TreeModel.prototype.addTreeModelListener = function(el, callback){
			el.addEventListener ? el.addEventListener("click", callback) : 
				el.attachEvent ? el.attachEvent("onclick", function(){
					return callback.call(el, window.event);//el=null;
				}) : el.onclick = callback;
		};
		/**
		 * the listener to remove
		 */
		TreeModel.prototype.reomveTreeModelListener = function(el, callback){
			el.removeEventListener("click", callback, 0);
		};
		/**
		 * TreeNode
		 */
		function TreeNode(){
			
		}
		/**
		 * set the root of the tree
		 */
		TreeNode.prototype.setRoot = function(root){
			this.root = this.children[0];
		};
		/**
		 * Returns the root of the tree
		 */
		TreeNode.prototype.getRoot = function(){
			return this.root;
		};
		/**
		 * Returns the parent
		 */
		TreeNode.prototype.getParent = function(){
			return this.node.parentNode || null;
		};
		/**
		 * Returns true if node is a leaf
		 */
		TreeNode.prototype.isLeaf = function(node){
			//return node.getChildCount() === 0;
			return !(node && node.parent === true);
		};
		/**
		 * Tree UI
		 */
		var DefaultTreeNode = {
			"root": function(name, tag){
				var el;
				if(!tag || (tag && Object.prototype.toString.call(tag) === "[object Object]")){
					if(tag && "ns" in tag){
						//console.log(this.namespace);
						this.namespace = tag["ns"];
						el = document.createElementNS(tag["ns"], name);	
					}
					else{
						el = document.createElement(name);	
					}
				}
				else if(tag && typeof tag === "string"){
					var head = document.createElement("h2"),
						relation = document.createElement("div"),
						icon = document.createElement("div"),
						expanded = document.createElement("b"),
						text = document.createElement("strong");
					relation.className = TREE_RELATION;
					icon.className = TREE_NODE_ICON;
					expanded.className = TREE_EXPANDED;
					text.appendChild(document.createTextNode(name));
					relation.appendChild(expanded);
					icon.appendChild(text);
					head.appendChild(relation);
					head.appendChild(icon);
					el = document.createElement(tag);
					el.appendChild(head);
					//link ==> query
					el.xExpand = expanded;
					el.xText = text;
					el.xName = name;
					el.xValue = undefined;
					/*var th = "<h2>";
					th += "<div class='" + TREE_RELATION + "'><b class='" + TREE_EXPANDED + "'></b></div>";
					th += "<div class='" + TREE_NODE_ICON + "'><strong>" + name + "</strong></div>";
					th += "</h2>";
					el.innerHTML = th;*/
				}
				return el;
			},
			"node": function(name, tag){
				var child = document.createElement(tag);
				var th = "<h2>";
				th += "<div class='" + TREE_RELATION + "'><b class='" + TREE_EXPANDED + "'></b></div>";
				th += "<div class='" + TREE_NODE_ICON + "'><strong>" + name + "</strong></div>";
				th += "</h2>";
				child.innerHTML = th;
				
				this.node.appendChild(child);
				return child;
			}
		},// check dx.array.toArray
		toArray = dx.array && dx.array.toArray ? dx.array.toArray : function(element){
			var elements = [];
			if(Object.prototype.toString.call(element) !== "[object Array]"){
				if(element.nodeType === 1)
					elements[0] = element;
				else{
					elements = Array.prototype.slice.apply(element);
				}
			}
			return elements;
		},
		curCSS = {
			hasClass: function(element, className){
				return element && !!~element.className.indexOf(className);
			},
			addClass: function(el, className){
				var cls = className.split(/\s+/),
					i = 0,
					j = 0,
					elements = toArray(el),
					len = elements.length,
					element;
				for(; i < cls.length; i++){
					for(; j < len; j++){
						element = elements[j];
						if(element.nodeType === 1 && !this.hasClass(element, cls[i]))
							element.className += (element.className.length ? " " : "") + className;	
					}	
				}
			},
			removeClass: function(el, className){
				var className = /\s+/.test(className) ? className.split(/\s+/) : [className],
					i = 0,
					j = 0,
					elements = toArray(el),
					len = elements.length,
					element;
				if(className.length){
					for(; i < className.length; i++){
						for(; j < len; j++){
							element = elements[j];
							element.className = element.className.replace(new RegExp("(^|\\s+)" + className[i] + "(\\s|$)"), "");	
						}	
					}	
				}
			}
		};
		dx.event = {
			guid: 1,
			proxy: function(fn, proxy){
				proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
			},
			add: function(elem, types, handler, data){
				if(elem.nodeType === 3 || elem.nodeType === 8)
					return;
				var isIE = /msie/i.test(navigator.userAgent);
				if(isIE && elem.setInterval)
					elem = window;
				if(!handler.guid)
					handler.guid = this.guid++;
				if(data != undefined){
					var fn = handler;
					handler = this.proxy(fn, function(){
						return fn.apply(this, arguments);
					});
					handler.data = data;//data add to handler
				}

			}
		};
		/**
		 * Tree
		 */
		function Tree(name, tag){		
			dx.extend(Tree.fn, new TreeModel());	//继承TreeModel
			dx.extend(Tree.fn, new TreeNode());	//继承TreeNode
			
			var root = DefaultTreeNode.root(name, tag);
			//this.children = [];
			return new this.init(root);
		}
		Tree.fn = Tree.prototype = {
			/*init: function(){
				dx.extend(this, new TreeModel());	//继承TreeModel
				dx.extend(this, new TreeNode());	//继承TreeNode	
				return this;
			},*/
			children: [],
			init: function(node){
				this.node = node;
				//this.children.push(this.node);//{node, context, root, children, text, expanded}
				this.children.push({
					"node": node,
					"context": this,
					"text": node.xText,
					"expand": node.xExpand,
					"children": [],
					"name": node.xName,
					/*"value": this.children.length*/
				});
				this.node.xContext = this;
				this.setRoot(this.children[0]);
				return this;
				//return this.map();
			},
			/*
			 *@mapping
			 *root: [0,1,1,1,0][0]
			 *firstChild: [0,1,1,1,0][1]
			*/
			map: function(){
				var children = this.children,
					length = children.length;
				console.log(this, this.children);
				this.root = children[0];
				this.firstChild = children[1] || null;
				return this;
			}
			/*,
			splice: [].splice*/
		};
		Tree.fn.init.prototype = Tree.fn;
		Tree.fn.constructor = Tree;
		dx.extend(Tree.fn, {
			append: function(name, tag){
				var child = DefaultTreeNode.root.call(this, name, tag);
				//console.log(this.namespace);
				this.node.appendChild(child);
				var init = new Tree.fn.init(child);
				return init;
			}	
		});
		Tree.prototype.getChildAt = function(index){
			return this.children[index];
		};
		Tree.prototype.getNode = function(){
			return this.node;
		};
		/**
		 * 获取所有子节点，不包含叶子节点与根节点
		*/
		Tree.prototype.getAllChildren = function(){
			return this.children;
		};
		Tree.prototype.getAllLeaf = function(){
			var children = this.children,
				l = children.length,
				i = 0,
				newChildren = [];
			while(++i ^ l){
				if(!!~children[i].className.indexOf(TREE_LAST_LEAF_NODE)){
					//console.log(children[i])//临时检测
					newChildren.push(children[i]);
				}
			}
			return newChildren;
		};
		Tree.prototype.getLeafCount = function(){
			this.getAllLeaf().length;
		};
		/*
		Tree.prototype.insert = function(newChild, childIndex){
			
		};
		Tree.prototype.remove = function(childIndex){
			
		};
		Tree.prototype.add = function(text){
			//console.log(this.getChildCount())
			//if(newChild && newChild.getParent() == this){
	//			this.insert(newChild, this.getChildCount() - 1);	
	//		}
	//		else{
	//			this.insert(newChild, this.getChildCount());	
	//		}
			//var newChild = DefaultTreeNode.child(text);
			var parent = document.createElement("dd");
			var newChild = parent.appendChild(DefaultTreeNode.root(text));
			parent.appendChild(newChild);
			//this.children[this.getChildCount() - 1].appendChild(parent);
			return new Tree.fn(newChild);
		};*/
		/*Tree.prototype.removeAllChildren = function(){
			for(var i = this.getChildCount() - 1; i >= 0; i--){
				this.remove(i);	
			}
		};
		Tree.prototype.setParent = function(){
				
		};
		Tree.prototype.getIndex = function(index){
			return this.children.indexOf(index);
		};
		Tree.prototype.getDepth = function(){
			return 0;	
		};
		Tree.prototype.getLevel = function(){
			var levels = 0,
				el;
			while(el = this.getParent()){
				levels++;	
			}
			return levels;
		};
		Tree.prototype.getPath = function(){
			
		};
		Tree.prototype.isRoot = function(){
			return this.getParent() == null;	
		}
		Tree.prototype.getNextNode = function(){
			
		};
		Tree.prototype.getPreviousNode = function(){
			
		};
		Tree.prototype.getChildAt = function(){
				
		};
		Tree.prototype.isNodeChild = function(aNode){
			var retval;
			if(!aNode)
				return false;
			if(this.getChildCount() == 0)
				retval = false;
			else
				retval = aNode.gteParent() == this;
			return retval;
		};
		Tree.prototype.getFirstChild = function(){
			if(this.getChildCount() === 0)
				new Error("node has no children");
			return this.getChildAt(0);
		};
		Tree.prototype.getLastChild = function(){
			if(this.getChildCount() == 0)
				new Error("node has no children");
			return this.getChildAt(this.getChildCount() - 1);
		};
		Tree.prototype.getChildAfter = function(){
			
		};
		Tree.prototype.getChildBefore = function(){
			
		};
		Tree.prototype.isNodeSibling = function(anotherNode){
		
		};
		Tree.prototype.getSiblingCount = function(){
			var parent = this.getParent();
			if(parent == null)
				return 1;
			return parent.getChildCount();
		};
		Tree.prototype.getNextSibling = function(){
			
		};
		Tree.prototype.getPreviousSibling = function(){
			
		};
		Tree.prototype.getFirstLeaf = function(){
			
		};
		Tree.prototype.getLastLeaf = function(){
			
		};
		Tree.prototype.getNextLeaf = function(){
			
		};
		Tree.prototype.getPreviousLeaf = function(){
			
		};
		*/
		//////test
		dx.ns("dx.widget.Tree");
		dx.widget.Tree = Tree;
		/**
		 * SmartTree
		 */
		var TREE_NAME = "x-tree",
			TREE_CHILD_NODE = TREE_NAME + "-child",
			TREE_LAST_CHILD_NODE = TREE_NAME + "-last-child",
			TREE_LAST_LEAF_NODE = TREE_NAME + "-leaf-child",
			TREE_RELATION = TREE_NAME + "-relation",
			TREE_EXPANDED = TREE_NAME + "-expanded",
			TREE_NODE_ICON = TREE_NAME + "-icon",
			TREE_HIDDEN = TREE_NAME + "-hidden";
		dx.namespace("dx.widget.SmartTree");
		dx.widget.SmartTree = SmartTree;
		function SmartTree(options){
			this.tree = new Tree(options["root"]["text"], "div");
			dx.fn.extend(this, curCSS);
			dx.fn.extend(this, this.tree);
			//console.log(this);
			this.toString = function(){
				return "[object SmartTree]";
			};
			this.make(options);
			
		}
		SmartTree.prototype.make = function(options){
			var root = this.getRoot(),
				data = options["store"],
				self = this;
			root["node"].className = TREE_NAME;
			//注册根节点
			this.addTreeModelListener(root.expand, function(){
				var node = self.getRoot()["node"];
				self.hasClass(node, TREE_HIDDEN) ? self.removeClass(node, TREE_HIDDEN) : self.addClass(node, TREE_HIDDEN);
			});
			if(typeof data === "string"){
				//ajax
			}
			else{
				//parse JSON([{id, pid, children}]) data
				var index = 1, parents = [root["node"]];
				(function(x, dx){
					var len = dx.length,
						call = arguments.callee;
					//index++;//递归形成的数据结构
					//console.log(x);
					for(var j = 0; j < len; j++){
						if(!dx[j])
							return;
						//++index;
						var q = x.append(dx[j].text, "div"),//constructor Tree.fn.init
							newNode = q.children.slice(1).pop();//根节点除外
						//console.log(parents);
						//newNode.children.push(q.getNode());
						//未排除叶子节点
						q.addTreeModelListener(newNode.expand, function(arg, t){
							return function(){
								arg.expandTo(t);//if you do not do anything, only to show or hide
							}
						}(self, q));// call  stack ==> 识别不清晰
						q.getNode().className = TREE_CHILD_NODE;
						if(j == len - 1){
							q.getNode().className = TREE_CHILD_NODE + " " + TREE_LAST_CHILD_NODE;
						}
						if(dx[j].children){
							parents.push(q.getNode());//parent node
							newNode.parent = true;
							call(q, dx[j].children);
						}
						else{
							parents.push(null);//分隔节点的深度（叶子节点）
							q.getNode().className = TREE_CHILD_NODE + " " + TREE_LAST_LEAF_NODE;
							if(j == len - 1){
								q.getNode().className = TREE_CHILD_NODE + " " + TREE_LAST_CHILD_NODE + " " + TREE_LAST_LEAF_NODE;
							}
						}
						//console.log(k, newNode)
						
					}
				})(this.tree, data);
				document.body.appendChild(root["node"]);
			}
		};
		SmartTree.prototype.appendTo = function(){
			
		};
		SmartTree.prototype.expandTo = function(q){
			this.hasClass(q.getNode(), TREE_HIDDEN) ? this.removeClass(q.getNode(), TREE_HIDDEN) : this.addClass(q.getNode(), TREE_HIDDEN);
		};
		SmartTree.prototype.onExpand = function(callback){
			var children = this.getAllChildren(),
				self = this,
				l = children.length,
				i = 0;
			for(; i < l; i++){
				if(!~children[i]["node"].className.indexOf(TREE_LAST_LEAF_NODE)){//所有子节点，不包含叶子节点
					(function(arg){
						self.addTreeModelListener(arg.expand, function(){
							//will respond to the event function to show or hide the operation, functions may be performed twice
							//如果事件使用noclick，可能会产生bug
							callback && callback.call(arg, this, self);
						});
					})(children[i]);
				}
			}
		};
		SmartTree.prototype.onClick = function(callback){
			var children = this.getAllChildren(),
				self = this,
				l = children.length,
				i = 0;
			for(; i < l; i++){
				//console.log(children[i]);
				(function(arg){
					self.addTreeModelListener(arg.text, function(){
						callback && callback.call(arg.context, this, arg);//context
					});
				})(children[i]);
			}
		};
		SmartTree.prototype.tx = function(type, options){
			return new {
				"ajax": AjaxTree,
				"dnd": DnDTree,
				"edit": EditTree	
			}[type](options);
		};
		/*(function(){
			console.log(new Tree("isModified", "h3"));//未被修改
		})();*/
	})(this, document);
	/*if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define("jquery", [], function () { return jQuery; });
    }*/
});