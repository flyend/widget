/*!
* TabPanel Javascript Widget
* Author: flyend
* Contact: flyend@126.com(e-mail), 269644230(qq)
* Date: Tue Dec 10 2013
*/
(function(callback){
	var fd = (function(){
        var fd = {};
        fd.selectAll = function(selector, context){
            return new fd.fn.init(selector, context);
        };
        fd.select = function(selector){
        	return new fd.fn.init(selector, context)[0] || null;
        };
        fd.namespace = fd.ns = function(){
            var d;
            for(var i = 0, l = arguments.length; i < l; i++){
                var n = arguments[i].split(".");
                d = window[n[0]] = window[n[0]] || {};
                for(var j = 0, s = n.slice(1); j < s.length; j++){
                    d = d[s[j]] = d[s[j]] || {};
                }
            }
            return d;
        };
        fd.fn = fd.prototype = {
            init: function(selector, context){
                if(selector.nodeType || selector === window){
                    this[0] = selector;
                    this.length = 1;
                    return this;
                }
                else if(typeof selector === "string"){
                    switch(true){
                        case !selector.indexOf("#"):
                            this[0] = document.getElementById(selector.substr(1));
                            this.length = 1;
                            return this;
                    }
                }
            },
            bind: function(type, fn, capture){
                //fd.isMobile && (type == "click" && !capture) && (type = "touchend");
                var self = this;
                for(var i = 0; i < this.length; i++){
                    document.addEventListener ? this[i].addEventListener(type, fn, !!capture) : document.attachEvent ? this[i].attachEvent("on" + type, (function(arg){
                        return function(){
                            return fn.call(self[arg] || window,  window.event);
                        }
                    })(i)) : this[i]["on" + type] = fn;
                }
            },
            unbind: function(type, fn, capture){
            	var self = this;
                for(var i = 0; i < this.length; i++){
                    document.removeEventListener ? this[i].removeEventListener(type, fn, !!capture) : document.detachEvent ? this[i].detachEvent("on" + type, (function(arg){
                        return function(){
                            return fn.call(self[arg] || window,  window.event);
                        }
                    })(i)) : this[i]["on" + type] = null;
                }
            },
            hasClass: function(className){
                return this[0] && !!~this[0].className.indexOf(className);
            },
            addClass: function(className){
                var cls = className.split(/\s+/),
                    i = 0,
                    j = 0,
                    len = this.length,
                    element;
                for(; i < cls.length; i++){
                    for(; j < len; j++){
                        element = this[j];
                        if(element.nodeType === 1 && !this.hasClass(cls[i]))
                            element.className += (element.className.length ? " " : "") + cls[i];
                    }
                }
            },
            removeClass: function(className){
                var className = /\s+/.test(className) ? className.split(/\s+/) : [className],
                    i = 0,
                    j = 0,
                    len = this.length,
                    element;
                for(; i < className.length; i++){
                    for(; j < len; j++){
                        element = this[j];
                        element.className = element.className.replace(new RegExp("(^|\\s+)" + className[i] + "(\\s|$)"), element.className.length ? " " : "");
                    }   
                }
            },
            offset: function(){
				var el = this[0],
					offset = {
						"left": this[0].offsetLeft,
						"top": this[0].offsetTop	
					};
				while(el = el.offsetParent){
					offset.left += el.offsetLeft;
					offset.top += el.offsetTop;	
				}
				return offset;
			}
        }
        fd.fn.init.prototype = fd.prototype;
        return fd;
    })();
	return function(f){
		callback && callback.call(fd, f);
	}
}).call(this, function(factory){
	return factory(window, this);
})(function(window, _fd, undefined){
	_fd.namespace("fd.widget.SmartTab");
	fd.widget.SmartTab = SmartTab;
	var TAB_NAME = "x-tab",
		TAB_NAV = TAB_NAME + "-nav",
		TAB_CONTENT = TAB_NAME + "-content",
		TAB_CONTENT_PANEL = TAB_CONTENT + "-panel",
		TAB_CLOSE = TAB_NAME + "-closable",
		TAB_ACTIVE = "-active",
		TAB_DRAGGING = TAB_NAME + "-dragging";
	//object type
	var isType = function(o){
		return o == null ? String(o) : {
			"[object String]": "string",
			"[object Object]": "object",
			"[object Function]": "function",
			"[object Array]": "array"
		}[Object.prototype.toString.call(o)] || null;
	};
	//make the global id
	var	createUUID = function(e, t) {
        return function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(e, t).toUpperCase();
        };
    }(/[xy]/g, function(e) {
        var t = Math.random() * 16 | 0, n = e == "x" ? t : t & 3 | 8;
        return n.toString(16);
    });
    /*
     * new SmartTab({nav: [], ...})
     * @nav array tab and panel
     */
	function SmartTab(options){
		var tab = document.createElement("div");
		tab.className = TAB_NAME;
		this.toString = function(){
			return "[object SmartTab]";
		};
		this.getContext = function(){
			return tab;
		};
		var tabList = [], activeList = [];
		this.getTabList = function(){
			return tabList;
		};
		this.getActivedList = function(){
			return activeList;
		};
		SmartTab.init.call(this, options, function(){
			//init active list
			//activeList = [];//reset
			var activedTab;
			for(var i = 0, length = tabList.length; i < length; i++){
				if(tabList[i]["actived"] && tabList[i]["actived"] !== true){
					if(activeList.length > 0){
						var len = activeList.length;
						activeList[len - 1]["nextActive"] = tabList[i];
						activeList[len - 1]["prevActive"] = (tabList[len - 2] && tabList[len - 2]) || null;
						tabList[i]["prevActive"] = activeList[len - 1];
						tabList[i]["nextActive"] = null;
					}
					activeList.push(tabList[i]);
				}
				else{
					activeList[0] = tabList[i];
					activedTab = tabList[i];
				}
			}
			activeList[activeList.length - 1]["nextActive"] = activedTab;
			activedTab["prevActive"] = activeList[activeList.length - 1];
			activedTab["nextActive"] = null;
			activeList.push(activedTab);
			//console.log(activeList)
			if(isType(options["nav"][0]["name"]) === "string"){
				this.appendTo();
			}
		});
	}
	SmartTab.init = function(options, callback){
		var context = this.getContext(),
			nav = options["nav"],
			tabList = this.getTabList(),
			self = this;
		if(isType(nav) === "array"){
			var tab = new Tab(options);//Tab.getInstance.call(this, options);
			if(isType(nav[0]["name"]) === "string"){
				context.appendChild(tab.getTab());
				context.appendChild(tab.getPanel());
			}
			for(var i = 0, length = nav.length; i < length; i++){
				if(!nav[i]["actived"]){
					nav[0]["actived"] = true;
				}
				this.addTab(nav[i]);
			}
		}
		options["width"] && (context.style.width = options["width"] + "px");
		options["height"] && (context.style.height = options["height"] + "px");
		callback && callback.call(this);
	};
	/*
	 * add Tab nav and panel
	 * @tab is object{name, panel}
	 * @returns the new tab
	 */
	SmartTab.prototype.addTab = function(nav){
		var tabList = this.getTabList(),
			tab = Tab.getInstance(),
			activeList = this.getActivedList(),
			length,
			self = this;
		//tab.addItem
		tab.addItem(nav).bind(function(){
			var prev = nav["prevActive"];//1
			self.activedTab2["prevActive"] = prev;//2
			self.activedTab2["nextActive"] = nav;
			//console.log(nav["name"], prev["name"], self.activedTab2)
			//self.activedTab2["nextActive"] = nav;
			nav["prevActive"] = self.activedTab2;
			nav["nextActive"] = null;
			//console.log(nav)
			self.setActivedTab(nav);
		});//处理后的tab和panel
		nav["text"] = nav["name"];
		nav["item"] = tab.getItem();
		nav["panel"] = tab.getContent();
		nav["index"] = createUUID();//this.getTabLength();
		if(tabList.length > 0){
			length = tabList.length;
			tabList[length - 1]["next"] = nav;
			tabList[length - 1]["prev"] = (tabList[length - 2] && tabList[length - 2]) || null;
			nav["prev"] = tabList[length - 1];
			nav["next"] = null;
		}
		tabList.push(nav);
		//tab list ready
		if(nav["actived"] === true){
			if(activeList.length > 0){
				activeList[activeList.length - 1]["nextActive"] = nav;
				activeList[activeList.length - 1]["prevActive"] = (activeList[activeList.length - 2] && activeList[activeList.length - 2]) || null;
				nav["prevActive"] = activeList[activeList.length - 1] || null;
				nav["nextActive"] = null;
			}
			activeList.push(nav);//外部添加
			this.setActivedTab(nav);
		}
		if(nav["closable"] === true){
			this.setClosable(nav);
		}
		return this;
		//current context this tab, addTab().bind(function(){ })// this is the nav
	};
	SmartTab.prototype.removeTab = function(tab, bool){
		var tabList = this.getTabList(),
			activeList = this.getActivedList(),
			length = tabList.length;
		for(var i = 0; i < length; i++){
			//console.log(tabList, tab)
			if(tabList[i]["index"] == tab["index"]){
				var removeTab = tabList.splice(i, 1);//remove the tab
				activeList.splice(i, 1);//长度不同出现bug
				if(typeof bool === "undefined" || bool === true){
					var item = removeTab[0]["item"],
						panel = removeTab[0]["panel"];
					item.parentNode.removeChild(item);
					panel.parentNode.removeChild(panel);
				}
				return removeTab[0];
			}
		}
		return null;
	};
	SmartTab.prototype.setActivedTab = function(tab){
		if(!tab["name"] || !tab["panel"])
			return this;
		if(this.getActivedTab() == tab){
			//return this;
		}
		if(tab["prevActive"]){
			_fd.selectAll(tab["prevActive"]["item"]).removeClass(TAB_NAV + TAB_ACTIVE);//cancel prev actived tab
			_fd.selectAll(tab["prevActive"]["panel"]).removeClass(TAB_CONTENT_PANEL + TAB_ACTIVE);
			//console.log( activeList)
		}
		_fd.selectAll(tab["item"]).addClass(TAB_NAV + TAB_ACTIVE);
		_fd.selectAll(tab["panel"]).addClass(TAB_CONTENT_PANEL + TAB_ACTIVE);
		this.activedTab2 = tab;
		return this;
	};
	SmartTab.prototype.getActivedTab = function(){
		var tabList = this.getTabList();
		return tabList[tabList.length - 1];//激活的节点总在最后
	};
	/**
	 * set this is tab closed
	 * 当tab被关闭时，它的指针将重新指向
	 * next 为null时，prev的next为null
	 * prev 为null时，next的prev为null
	 */
	SmartTab.prototype.setClosable = function(tab){
		var closable = document.createElement("span"),
			tabList = this.getTabList(),
			activeList = this.getActivedList(),
			me = this;
		closable.className = TAB_CLOSE;
		closable.innerHTML = "&times;";
		closable.tab = tab;
		_fd.selectAll(closable).bind("click", function(e){
			e.stopPropagation();//此项操作可以会触发tab的事件
			//console.log(this.tab, this.tab["prev"])
			if(this.tab["prevActive"]){
				this.tab["prevActive"]["nextActive"] = this.tab["nextActive"];
			}
			if(this.tab["nextActive"]){
				this.tab["nextActive"]["prevActive"] = this.tab["prevActive"]
			}
			var removeTab = me.removeTab(this.tab);
			//console.log(removeTab)
			if(!!~this.tab["item"].className.indexOf(TAB_NAV + TAB_ACTIVE)){
				me.setActivedTab(removeTab["prevActive"]);//关闭激活的tab
			}
		});
		tab["item"].appendChild(closable);
	};
	SmartTab.prototype.getTabLength = function(){
		return this.getTabList().length;
	}
	SmartTab.prototype.appendTo = function(el){
		(el || document.body).appendChild(this.getContext());
		return this;
	};
	SmartTab.prototype.dnd = function(){
		return this;
	};
	SmartTab.prototype.onStart = function(callback){
		var targetTab = document.createElement("div");//this.getTabList()[1]["name"].cloneNode(true);
		targetTab.textContent = this.getTabList()[1]["item"].textContent;
		targetTab.className = TAB_DRAGGING;
		document.body.appendChild(targetTab);
		this.draggable = new fd.util.Draggable([
			{"element": targetTab, "target": this.getTabList()[1]["item"]},
		]).onStart(function(){
			_fd.selectAll(document.body).addClass("x-dragging");
			callback && callback.call(this);
		});
		return this;
	};
	SmartTab.prototype.onDrag = function(callback){
		//returns element or null
		var els = [];
		for(var i = 0; i < this.getTabList().length; i++){
			els[i] = this.getTabList()[i]["item"];
		}
		var distance = new fd.util.Distance(0, 0, 0, 0),
			findNearest = function(b){
				//if(!flag)
				//	return null;
				for(var i = 0; i < els.length; i++){
					if(isEnter(els[i], b)){
						return els[i];
					}
				}
				return null;
			};
		var step = 0, flag = true;
		var parent = els[0].parentNode;
		var point = 0;
		var tw = 0;
		this.draggable.onDrag(function(e){
			this.target.style.visibility = "hidden";
			var el = findNearest(this);
			console.log(el);
			if(el != null){
				point = this.offsetWidth + this.offsetLeft + 100;
				tw = el.offsetLeft + el.offsetWidth / 2;
				
				if(step++ > 3){
					//if(el != this.target){
						console.log(point, tw, el)
						if(point >= tw){
							parent.insertBefore(this.target, el.nextSibling);
							point = tw + 90;//this.target.offsetLeft + this.target.offsetWidth;
						}
						if(tw <= point){
							parent.insertBefore(this.target, el);
						}
						step = 0;
					//}
				}
			}
			this.style.left = e.clientX - 30 + "px";
			this.style.top = e.clientY - 10 + "px";
			callback && callback.call(this);
		});
		var isEnter = function(el, b){
			var body = document.body,
				html = document.documentElement,
				offset = _fd.selectAll(el).offset(),
				//x1 = e.clientX || e.touches[0].clientX,
				//y1 = e.clientY || e.touches[0].clientY,
				x1 = _fd.selectAll(b).offset().left + b.offsetWidth,
				y1 = _fd.selectAll(b).offset().top + b.offsetHeight,
				w1 = x1 + Math.max(body.scrollLeft, html.scrollLeft),
				h1 = y1 + Math.max(body.scrollTop, html.scrollTop),
				x2 = offset.left - 90,
				y2 = offset.top,
				w2 = x2 + el.offsetWidth,
				h2 = y2 + el.offsetHeight;
			return w1 > x2 && h1 > y2 && w2 > x1 && h2 > y1;
			//return distance.isCollision(x1, y1, w1, h1, x2, y2, w2, h2);
		};
		return this;
	};
	SmartTab.prototype.onDrop = function(callback){
		this.draggable.onDrop(function(){
			_fd.selectAll(document.body).removeClass("x-dragging");
			this.target.style.visibility = "visible";
			callback && callback.call(this);
		});
		return this;
	};
	SmartTab.prototype.onClick = function(callback){
		var tabList = this.getTabList(),
			length = tabList.length,
			i = 0,
			tab;
		for(; i < length; i++){
			tab = tabList[i];
			(function(arg){
				_fd.selectAll(arg["item"]).bind("click", function(){
					callback && callback.call(this, arg["panel"]);
				});
			})(tab);
		}
	};
	function Tab(options){
		var tab = document.createElement("div"),
			panel = document.createElement("div"),
			list = [];
		if(!options["tab"]){
			var item = document.createElement("ul");
			tab.className = TAB_NAV;
			tab.appendChild(item);
		}
		if(!options["panel"]){
			panel.className = TAB_CONTENT;
		}
		this.tab = tab;
		this.panel = panel;
		this.getContext = function(){
			return options["tab"] || null;
		};
		this.getList = function(){
			return list;
		};
		Tab.instance = this;
	}
	Tab.getInstance = function(){
		//console.log(Tab.created);
		/*if(!Tab.created){
			Tab.created = new Tab(options);
		}*/
		return Tab.instance;
	};
	Tab.prototype.getTab = function(){
		return this.tab;
	};
	Tab.prototype.getPanel = function(){
		return this.panel;
	};
	Tab.prototype.addItem = function(nav){
		var item = nav["name"],
			content = nav["panel"],
			list = this.getList();
		if(isType(nav["name"]) === "string"){
			var link = document.createElement("a");
			item = document.createElement("li");
			link.href = "javascript:void(0);";
			link.appendChild(document.createTextNode(nav["name"]));
			item.appendChild(link);
			this.tab.getElementsByTagName("ul")[0].appendChild(item);
		}
		else if(nav["name"] && nav["name"].nodeType === 1){

		}
		if(isType(nav["panel"]) === "string"){
			content = document.createElement("div");
			content.className = TAB_CONTENT_PANEL;
			var url = nav["panel"],
				frame = document.createElement("iframe");
			frame.src = url;
			frame.setAttribute("frameborder", "0");
			frame.allowtransparency = "true";
			frame.setAttribute("allowtransparency", "true");
			content.appendChild(frame);
			this.panel.appendChild(content);
		}
		else if(nav["panel"] && nav["panel"].nodeType === 1 && !this.getContext()){
			//如果没有指定的tab则创建新的tab
			content = document.createElement("div");
			content.className = TAB_CONTENT_PANEL;
			content.appendChild(nav["panel"]);
			this.panel.appendChild(content);
		}
		list.push({"item": item, "content": content, "index": list.length});
		this.setItem(item).setContent(content);
		return this;
	};
	Tab.prototype.getItem = function(){
		return this.item;
	};
	Tab.prototype.setItem = function(item){
		this.item = item;
		return this;
	};
	Tab.prototype.getContent = function(){
		return this.content;
	};
	Tab.prototype.setContent = function(content){
		this.content = content;
		return this;
	};
	Tab.prototype.bind = function(callback){
		var list = this.getList(),
			length = list.length,
			self = this;
		_fd.selectAll(this.getItem()).bind("click", function(e){
			var e = e || window.event,
				target = e.target || e.srcElement;
			if(target.tagName === "A"){
				if(e.preventDefault)
					e.preventDefault();
				if(e.cancelBubble)
					e.cancelBubble = true;
				callback && callback.call(this, self.getContent());
				return false;
			}
			callback && callback.call(this, self.getContent());
		});
		return this;
	};
});