/*!
* TabPanel Javascript Widget
* Author: flyend
* Contact: flyend@126.com(e-mail), 269644230(qq)
* Date: Wed Oct 2012
*/
(function(window,document,$){
	$.namespace("_$.widget.Tab");
	var TAB_NAME = "x-tab",
		TAB_NAV = TAB_NAME + "-nav",
		TAB_CONTENT = TAB_NAME + "-content",
		TAB_CONTENT_PANEL = TAB_CONTENT + "-panel",
		TAB_SCROLLER = TAB_NAV + "-scroller",
		TAB_CLOSE = TAB_NAME + "closable",
		TAB_ACTIVE = "-active";
	$.widget.Tab = Tab;
	function Tab(opt){
		this.toString = function(){
			return "[object Tab]";	
		};
		this.create = function(){
			this.tab = document.createElement("div");
			this.tab.className = TAB_NAME;
			return this.tab;	
		};
		this.id = function(id){
			this.tab.setAttribute("id",id);
			return this;
		};
		this.getContext = function(){
			return this.tab || this.create();
		};
		if(!this.tab){
			this.tab = this.create();
		}
		this.tabList = {};
		this.length = 0;
		document.body.appendChild(this.tab);
		this.init(opt);
	}
	Tab.prototype.init = function(opt){
		if(!opt["nav"])
			throw Error("nav undefined!");
		this.activedTab = null;
		this.activedPanel = null;
		var active = opt["activeTab"] | 0,
			navs = opt["nav"],
			nav,
			panel,
			me = this;
		var tabUI = Tab.getInstance();//return a,b
		var tab = tabUI["nav"];
		this.tab.appendChild(tab);
		this.tab.appendChild(tabUI["content"]);
		this.width = opt["width"] || this.tab.offsetWidth;
		for(var i = 0; i ^ navs.length; i++){
			nav = this.addTab(navs[i]);
			//panel = this.addPanel(navs[i]["panel"]);
			/*if(!(i ^ active)){
				this.setActivedTab(nav);
			}*/
		}
		if(opt["createTab"]){
			//tab.appendChild(document.createElement("div"));	
		}
	};
	var stacks = [], width = 0;
	function pushStack(stacks,value){
		for(var j = 0, l = stacks.length; j ^ l; j++){
			if(stacks[j]["index"] == value){
				return stacks.slice(0,j).concat(stacks.slice(j + 1,stacks.length));
			}
		}
		return stacks;
	}
	var hWidth = 0;
	Tab.prototype.addTab = function(tab){
		var nav = TabUI.addTab(tab["name"]);
		var panel = TabUI.addPanel(tab["panel"]),
			me = this,
			obj = {};
		nav.panel = panel;
		nav.index = this.getTabLength();
		nav.title = nav.index;
		this.tabList[nav.index] = nav;
		obj["tab"] = nav;
		obj["index"] = nav.index;
		obj["panel"] = nav.panel;
		stacks.unshift(obj);
		this.setActivedTab(nav);
		width += nav.offsetWidth;
		console.log(width)
		if(width > this.width){
			//hWidth += nav.offsetWidth;
			hWidth = width - this.width;
			//console.log(width - this.width)
			document.querySelectorAll(".x-tab-nav ul")[0].style.marginLeft = "-" + (hWidth) + "px";
		}
		if(tab["closable"]){
			this.setClosable();
		}
		if(tab["loaded"]){
			tab["loaded"](nav);	
		}
		$(nav).bind("click",function(e){
			var value = +this.title;
			obj["index"] = value;
			obj["tab"] = this;
			obj["panel"] = this.panel;
			if(e.target.tagName == "A"){
				stacks = pushStack(stacks,value);
				stacks.unshift(obj);
				me.setActivedTab(this);
				tab["handler"] && tab["handler"](this);
			}
			//console.log(stacks);
		});
		return nav;
	};
	Tab.prototype.removeTab = function(tab){
		tab.parentNode.removeChild(tab);
		tab.panel.parentNode.removeChild(tab.panel);
		tab.panel = null;
		tab.index = null;
	};
	Tab.prototype.setTab = function(){};
	Tab.prototype.getTab = function(){};
	Tab.prototype.getActivedTab = function(){
		return this.activedTab;	
	};
	Tab.prototype.setActivedTab = function(tab){
		if(tab == this.getActivedTab())
			return;
		$(tab).addClass(TAB_NAV + TAB_ACTIVE);
		//console.log(tab.panel);
		$(tab.panel).addClass(TAB_CONTENT_PANEL + TAB_ACTIVE);
		if(this.activedTab){
			$(this.activedTab).removeClass(TAB_NAV + TAB_ACTIVE);//cancel prev actived tab
		}
		if(this.activedPanel){
			$(this.activedPanel).removeClass(TAB_CONTENT_PANEL + TAB_ACTIVE);
		}
		this.activedTab = tab;
		this.activedPanel = tab.panel;
	};
	Tab.prototype.getActivedPanel = function(){
		return this.activedPanel;
	};
	Tab.prototype.getAllTab = function(){
		return this.tabList;	
	};
	Tab.prototype.getTabLength = function(){
		//var length = 0;
		/*for(var i in this.tabList){
			length++;	
		}*/
		return this.length++;
	};
	Tab.prototype.setWidth = function(width){
		width += width;
		return width;
	};
	Tab.prototype.bind = function(){};
	Tab.prototype.dnd = function(){};
	Tab.prototype.appendTo = function(el){
		el.appendChild(this.tab);
		this.width = this.tab.offsetWidth;
		return this;
	};
	Tab.prototype.setClosable = function(){
		var closable = document.createElement("span"),
			me = this;
		closable.className = TAB_CLOSE;
		closable.innerHTML = "&times;";
		closable.tab = this.getActivedTab();
		$(closable).bind("click",function(e){
			e.stopPropagation();
			var prev = stacks.shift();
			delete me.tabList[prev["index"]];
			/*this.tab.parentNode.removeChild(this.tab);
			this.tab.panel.parentNode.removeChild(this.tab.panel);*/
			me.removeTab(this.tab);
			
			var nav = stacks[0]["tab"];//me.tabList[stacks[0]["index"]];
			nav.panel = stacks[0]["panel"];
			//console.log(nav);
			if(!!~this.tab.className.indexOf(TAB_NAV + TAB_ACTIVE)){
				me.setActivedTab(nav);
			}
			
			console.log(hWidth + "=======" + width);
			//if(width > this.width){
			if(width <= 90){
				width = me.width - hWidth;
				document.querySelectorAll(".x-tab-nav ul")[0].style.marginLeft = "0px";
			}
			else{
				hWidth -= 90;
				width -= hWidth;
				document.querySelectorAll(".x-tab-nav ul")[0].style.marginLeft = "-" + (hWidth) + "px";
			}
		});
		this.getActivedTab().appendChild(closable);
	};
	Tab.getInstance = function(){
		if(!Tab.instance)
			Tab.instance = new TabUI();
		return Tab.instance;
	};
	function TabUI(){
		this.nav = document.createElement("div");
		this.nav.className = TAB_NAV;
		this.content = TabUI.panel;
		this.content.className = TAB_CONTENT;
		this.nav.appendChild(TabUI.nav);
		this.nav.appendChild(TabUI.addScroller.left);
		this.nav.appendChild(TabUI.addScroller.right);
	}
	TabUI.nav = document.createElement("ul");
	TabUI.panel = document.createElement("div");
	TabUI.addTab = function(name){
		var item = document.createElement("li"),
			link = document.createElement("a");
		link.href = "javascript:void(0);";
		link.appendChild(document.createTextNode(name));
		item.appendChild(link);
		TabUI.nav.appendChild(item);
		return item;
	};
	TabUI.addPanel = function(url){
		var panel = document.createElement("div");
		panel.className = TAB_CONTENT_PANEL;
		if($.isString(url)){
			var u = url;
			url = document.createElement("iframe");
			url.src = u;
			url.setAttribute("frameborder","0");
			url.allowtransparency = "true";
			url.setAttribute("allowtransparency","true");
		}
		else if($.isObject(url)){
				
		}
		panel.appendChild(url);
		TabUI.panel.appendChild(panel);
		return panel;
	};
	TabUI.addScroller = (function(){
		var scrollerLeft = document.createElement("div"),
			scrollerRight = document.createElement("div");
		scrollerLeft.className = TAB_SCROLLER + "-left";
		scrollerRight.className = TAB_SCROLLER + "-right";
		return{
			"left": scrollerLeft,
			"right": scrollerRight	
		};
	})();
})(this,document,_$);