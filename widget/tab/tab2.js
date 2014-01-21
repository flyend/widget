/*!
* TabPanel Javascript Widget
* Author: flyend
* Contact: flyend@126.com(e-mail), 269644230(qq)
* Date: Wed Oct 2012
*/
(function(window,document){
	var d = document, that = window;
	if(!_$.hasOwnProperty("TabPanel")){
		_$["TabPanel"] = TabPanel;
	}
	function TabPanel(opt){
		this.tabpanel = null;
		
		this.create = function(){
			this.tabpanel = d.createElement("div");
			this.tabpanel.className = "tab-panel";
			return this.tabpanel;	
		};
		this.id = function(id){
			this.tabpanel.setAttribute("id",id);
			return this;
		};
		this.getContext = function(){
			return this.tabpanel || this.create();
		};
		if(!this.tabpanel){
			this.tabpanel = this.create();
		}
		this.init(opt);
		return this;
	}
	TabPanel.prototype.init = function(opt){
		this.makeNavigation(opt).makePanel(opt);
	};
	TabPanel.prototype.appendTo = function(el){
		el.appendChild(this.tabpanel || this.getContext());
		TabPanel.create.resize(this);
		return this;
	};
	TabPanel.prototype.makeNavigation = function(opt){
		var tabpanel = this.tabpanel || this.getContext(),
			nav = opt.nav;
		tabpanel.index = opt.show | 0;
		if(nav){
			tabpanel.appendChild(TabPanel.create.nav(opt,nav));
		}
		return this;
	};
	TabPanel.prototype.makePanel = function(opt){
		var tabpanel = this.tabpanel || this.getContext(),
			nav = this.nav = opt.nav;
		tabpanel.appendChild(TabPanel.create.panel(nav,opt));
		return this;
	};
	TabPanel.prototype.bind = function(type,fn){
		var tabpanel = this.tabpanel || this.getContext(),
			me = this,
			moreItem;
		tabpanel.array = [tabpanel.index];
		_$(tabpanel).find(".tab-content").find(".tab-pane")[tabpanel.index].setAttribute("status","on");
		_$(tabpanel).find(".tab-nav").find("li").bind(type,function(){
			if(this.className.indexOf("active") != -1)
				return;
			if(_$(this).hasClass("more")){
				if(!this.init){
					moreItem = TabPanel.create.menu(tabpanel,me);
					this.appendChild(moreItem);
					this.init = 1;
				}
				_$(this).hasClass("show") ? _$(this).removeClass("show") : _$(this).addClass("show");
			}
			else{
				if(moreItem){
					_$(moreItem.parentNode).removeClass("show");
				}
				if(!this.init){
					var panel = _$(tabpanel).find(".tab-content").find(".tab-pane")[this.index],
						content = me.nav[this.index]["content"];
					//console.log(content);
					if(typeof content === "string"){
						var ifrm = d.createElement("iframe");
						ifrm.src = content;
						panel.appendChild(ifrm);
					}
					else{
						panel.appendChild(content);
					}
					this.init = 1;
				}
				var prev = cur(tabpanel.array,this.index);
				//console.log(prev)
				_$(_$(tabpanel).find(".tab-nav").find("li")[prev]).removeClass("active");
				_$(_$(tabpanel).find(".tab-content").find(".tab-pane")[prev]).removeClass("active");//nav
				_$(this).addClass("active");
				_$(_$(tabpanel).find(".tab-content").find(".tab-pane")[this.index]).addClass("active");//content
				_$(tabpanel).find(".tab-content").find(".tab-pane")[this.index].setAttribute("status","on");
				tabpanel.index = this.index;
				fn && fn(this);
			}
		});
	};
	function cur(arr,index){
		arr.unshift(index);
		//console.log(arr);
		if(arr.length > 1){
			return arr.pop();	
		}
		return 0;
	}
	TabPanel.create = {
		nav: function(opt,nav){
			var tabnav = d.createElement("ul"),
				index = opt.show | 0;
			tabnav.className = "tab-nav";
			for(var i = 0, len = nav.length; i ^ len; i++){
				var name = nav[i],
					item = d.createElement("li"),
					link = d.createElement("a");
				item.index = i;
				if(index == i)
					item.className = "active";
				link.href = "javascript:void(0);";
				link.title = name["name"] || "未命名";
				link.appendChild(d.createTextNode(name["name"] || "未命名"));
				item.appendChild(link);
				tabnav.appendChild(item);
			}
			var moreItem = d.createElement("li");
			moreItem.className = "more";
			moreItem.style.display = "none";
			moreItem.appendChild(d.createTextNode(">>"));
			tabnav.appendChild(moreItem);
			return tabnav;
		},
		panel: function(nav,opt){
			var navcontent = d.createElement("div"),
				index = opt.show | 0,
				len = nav.length;
			navcontent.className = "tab-content";
			for(var i = 0; i ^ len; i++){
				var content = nav[i].content,
					panel = d.createElement("div");
				panel.className = "tab-pane";
				if(index == i){
					_$(panel).addClass("active");
					if(typeof content === "string"){
						var ifrm = d.createElement("iframe");
						ifrm.src = content;
						panel.appendChild(ifrm);
					}
					else{
						panel.appendChild(content);
					}
				}
				navcontent.appendChild(panel);
			}
			return navcontent;
		},
		menu: function(tabpanel,that){
			var menu = d.createElement("div"),
				items = tabpanel.items,
				len = items.length;
			for(var i = 0; i  ^ len; i++){
				var item = d.createElement("a");
				item.href = "javascript:void(0);";
				item.i = i;
				item.setAttribute("data-index",items[i]["index"]);
				item.appendChild(d.createTextNode(_$(items[i]["item"]).find("a")[0].innerHTML));
				menu.appendChild(item);
			}
			var arr = [that.nav[1].content];
			_$(menu).bind("click",function(e){
				var e = e || that.event,
					target = e.target || e.srcElement;
				if(target.tagName == "A"){
					var index = +target.getAttribute("data-index");
					var curItem = _$(tabpanel).find(".tab-nav").find("li")[tabpanel.index];
					curItem.appendChild(target);
					var curLink = curItem.getElementsByTagName("a")[0];
					curLink.setAttribute("data-index",tabpanel.index);
					menu.appendChild(curItem.removeChild(curLink));
					//if(!target.init){
						var content = that.nav[index].content,
							curContent = _$(tabpanel).find(".tab-content").find(".tab-pane")[tabpanel.index];
						if(typeof content === "string"){
							var ifrm = d.createElement("iframe");
							ifrm.src = content;
							curContent.appendChild(ifrm);
							_$(tabpanel).find(".tab-content").find(".tab-pane")[index].appendChild(that.nav[tabpanel.index].content);
						}
						else{
							var prevPanel = _$(tabpanel).find(".tab-content").find(".tab-pane")[index],
								attr = prevPanel.getAttribute("status");
							arr.push(that.nav[index].content);
							var a = arr.shift();
							if(attr && attr.toString() == "on"){
								curContent.replaceChild(arr[0],curContent.getElementsByTagName("*")[0]);
								prevPanel.replaceChild(a,prevPanel.getElementsByTagName("*")[0]);
							}
							else{
								curContent.appendChild(arr[0]);
								_$(tabpanel).find(".tab-content").find(".tab-pane")[index].appendChild(a);
								_$(tabpanel).find(".tab-content").find(".tab-pane")[index].setAttribute("status","on");	
							}							
						}
						//target.init = 1;
					//}
					TabPanel.create.resize(that);
				}
			});
			return menu;
		},
		resize: function(what){
			var tabpanel = what.tabpanel,
				tabnav = _$(tabpanel).find(".tab-nav")[0],
				items = tabnav.getElementsByTagName("li"),
				moreItem = _$(tabpanel).find(".tab-nav").find(".more")[0],
				tabWidth = tabpanel.offsetWidth - 15,
				len = what.nav.length | 0,
				w = count = 0,
				arr = [];
			for(var i = 0, len = items.length; i ^ len; i++){
				var item = items[i];
				w += item.offsetWidth + (parseInt(_$(item).css("marginRight"), 10) | 0 + parseInt(_$(item).css("marginLeft"), 10) | 0);
				if(w > tabWidth){
					count = i;
					//console.log(count);
					while(len ^ count){
						if(items[count].className.indexOf("more") == -1){
							arr.push({"item": items[count], "index": count});
						}
						tabpanel.items = arr;
						items[count++].style.display = "none";
					}
					break;
				}
			}
			count && (moreItem.style.display = "block");
		}
	};
})(this,document);