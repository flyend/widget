_$.namespace("app.mobile");
app.mobile.config = {
	"DragItem": {
		"NAME": "Navigation",
		"SHOW": "x-show",
		"DRAGGABLE": "x-draggable",
		"CLOSE": "x-close"
	}
};
app.mobile.factory = {
	"ready": function(module,options){
		switch(module){
			case widget.desktop.config.DragItem.NAME:
				new widget.desktop.DragItem({"nav": options["nav"], "desktop": options["desktop"], "placehoder": options["placehoder"],"saving": options["saving"], "callback": options["callback"]});//.bind(options["bind"]["element"],options["bind"]["type"],options["bind"]["callback"]);
			break;
		}
		return this;
	}
};
app.mobile.isSupport = "ontouchstart" in window ? true : false;
app.mobile.events = {
	"click": app.mobile.isSupport ? "touchstart" : "click"
};
(function(window,document,$){
	$.namespace("_$.widget.Tab");
	var TAB_NAME = "x-tab",
		TAB_NAV = TAB_NAME + "-nav",
		TAB_CONTENT = TAB_NAME + "-content",
		TAB_CONTENT_PANEL = TAB_CONTENT + "-panel",
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
		for(var i = 0; i ^ navs.length; i++){
			var nav = this.addTab(navs[i]);
			if(i == active){
				//console.log(this.tabList[i])
				//me.setActivedTab(nav);
			}
		}
		this.tab.appendChild(tabUI["nav"]);
		this.tab.appendChild(tabUI["content"]);
		//console.log(this.getActivedTab());
	};
	var stacks = [];
	function pushStack(stacks,value){
		for(var i = 0, l = stacks.length; i ^ l; i++){
			if(stacks[i] == value){
				return stacks.slice(0, i).concat(stacks.slice(i + 1, stacks.length));
			}
		}
		return stacks;	
	}
	Tab.prototype.addTab = function(tab){
		var nav = TabUI.addTab(tab["name"]);
		var panel = TabUI.addPanel(tab["panel"]),
			me = this;
		nav.panel = panel;//tab对应的panel
		
		this.setActivedTab(nav);
		if(tab["closable"]){
			this.setClosable();
		}
		$(nav).bind("click",function(e){
			if(e.target.tagName == "A"){
				var value = +this.title;
				me.setActivedTab(this);
				stacks = pushStack(stacks,value);//reset stack
				stacks.unshift(value);
				console.log(stacks);
			}
		});
		nav.index = this.getTabLength();
		this.tabList[nav.index] = {"nav": nav, "panel": panel};
		//nav.title = nav.index;
		stacks.unshift(nav.index);
		return nav;
	};
	Tab.prototype.removeTab = function(tab){
		
	};
	Tab.prototype.setTab = function(){};
	Tab.prototype.getTab = function(){};
	Tab.prototype.getActivedTab = function(){
		return this.activedTab;	
	};
	Tab.prototype.setActivedTab = function(tab){
		//tab index, panel
		//console.log(tab)
		$(tab).addClass(TAB_NAV + TAB_ACTIVE);
		$(tab["panel"]).addClass(TAB_CONTENT_PANEL + TAB_ACTIVE);
		if(this.activedTab){
			$(this.activedTab).removeClass(TAB_NAV + TAB_ACTIVE);//cancel prev actived tab
		}
		if(this.activedPanel){
			$(this.activedPanel).removeClass(TAB_CONTENT_PANEL + TAB_ACTIVE);
		}
		this.activedTab = tab;
		this.activedPanel = tab["panel"];
	};
	Tab.prototype.getActivedPanel = function(){
		return this.activedPanel;	
	};
	Tab.prototype.setActivedPanel = function(panel){
		this.setActivedTab(panel);
	};
	Tab.prototype.getAllTab = function(){
		return this.tabList;	
	};
	Tab.prototype.getTabLength = function(){
		var l = 0;
		for(var i in this.tabList){
			l++;	
		}
		return l;
	};
	Tab.prototype.bind = function(){};
	Tab.prototype.dnd = function(){};
	Tab.prototype.appendTo = function(el){
		el.appendChild(this.tab);
		return this;
	};
	Tab.prototype.setClosable = function(){
		var closable = document.createElement("span"),
			me = this;
		closable.className = TAB_CLOSE;
		closable.innerHTML = "&times;"
		closable.tab = this.getActivedTab();
		$(closable).bind("click",function(e){
			e.stopPropagation();
			var prev = stacks.shift();//
			
			//console.log(me.tabList[stacks[0]]);
			var pt = me.tabList[stacks[0]]["nav"];
			delete me.tabList[prev];
			
			if(this.tab == me.activedTab){
				console.log(stacks);
				me.setActivedTab(pt);
			}
			//pt.className = TAB_NAV + TAB_ACTIVE;
			this.tab.parentNode.removeChild(this.tab);
			this.tab.panel.parentNode.removeChild(this.tab.panel);
			this.tab = null;
		});
		this.getActivedTab().appendChild(closable);
	};
	Tab.getInstance = function(){
		if(!Tab.instance)
			Tab.instance = new TabUI();
		return Tab.instance;
	};
	function TabUI(){
		this.nav = TabUI.nav;
		this.nav.className = TAB_NAV;
		this.content = TabUI.panel;
		this.content.className = TAB_CONTENT;
	}
	TabUI.nav = document.createElement("ul");
	TabUI.panel = document.createElement("div");
	TabUI.addTab = function(name){
		var item = document.createElement("li"),
			link = document.createElement("a");
		link.href = "javascript:void(0);";
		link.appendChild(document.createTextNode(name));
		item.appendChild(link);
		/*if(!TabUI.nav.index)
			TabUI.nav.index = 0;
		item.index = TabUI.nav.index++;*/
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
	TabUI.prototype.bind = function(){
		console.log(this);	
	};
})(this,document,_$);
/*
* Menu
*/
(function(window,document,$){
	$.namespace("app.mobile.Menu");
	//app.mobile.Menu = Menu;
	var menu;
	function Menu(){
		this.toString = function(){
			return "[object mobile->Menu]";	
		};
		/*$.ajax("menu.php",function(res){
			//var data = $.parseJSON(res);
			console.log(res);
		});*/
		//this.menu = opt["menu"];
	}
	Menu.prototype.bind = function(el,opt){
		//console.log($(el).find(opt["title"]))
		$(el).bind(app.mobile.events["click"], function(e){
			var e = e || window.event,
				target = e.target || e.srcElement;
			if(!!~target.className.indexOf(opt["title"])){
				var parent = target.parentNode;
				!parent.show ? ($(parent).addClass("x-hide"), parent.show = 1) : ($(parent).removeClass("x-hide"), parent.show = 0); 
				console.log(parent);	
			}
		});
	};
	app.mobile.Menu.getInstance = function(){
		if(!menu)
			menu = new Menu();
		return menu;
	};
})(this,document,_$);
_$(document).ready(function(){
	/*new app.mobile.Menu({
		"menu": _$("#xMenu")[0]	
	});	*/
	var m = app.mobile.Menu.getInstance();
	m.bind(_$("#xMenu")[0],{
		"title": "x-menu-title"	
	});
	var tab = new _$.widget.Tab({
		"nav": [{"name": "Home", "panel": "widget/widget.html"}/*,{"name": "Chromium", "panel": "data:text/html,<html contenteditable><meta charset='utf-8'/><h1>编辑器<h1>"}*/],
		"activeTab": 0
	}).appendTo(_$("#xmain")[0]);
	_$("#xMenu").find("a").each(function(){
		//_$(this).bind("click",function(e){
		this.onclick = function(e){
			e.stopPropagation();
			var nav = tab.addTab({"name": this.textContent || this.innerText, "panel": "data:text/html,<htm><h2>" + this.innerHTML + "</h2>", "closable": true});
			//startDrag(nav);
			return false;
		};
	});
	//dialog
	function ditem(){
		var item = document.querySelectorAll("#xMenu .x-menu-section"),
			array = [],
			o;
		for(var i = 0; i < item.length; i++){
			o = {};
			o["text"] = item[i].getElementsByTagName("h2")[0].innerHTML.replace(/<[^>]*>/g, "");
			array.push(o);
			for(var j = 0, link = item[i].getElementsByTagName("li"); j < link.length; j++){
				if(!o["children"])
					o["children"] = [];
				var lk = {};
				lk["text"] = link[j].innerHTML.replace(/<[^>]*>/g, "");
				o["children"].push(lk);
			}
		}
		//console.log(array);
		return array;
	}
	var td = ditem();
	/*new _$.widget.SimpleDialog({
		"width": 250,
		"height": 350,
		"title": "Widget",
		"content": new dx.widget.SmartTree({
						"root": {"text": "ROOT", "value": -1},
						"store": td
					}).getContext(),
		"draggable": true
	});*/
	//
	new fd.util.Draggable([document.getElementById("moveTile")], {
		/*"onStart": function(){
			console.log(this);
		}*/
	}).onStart(function(){
		//console.log(this);
	}).onDrag(function(){
		document.body.className = "x-draggable";
	}).onDrop(function(){
		document.body.className = "";
	}).destory();
	//drag the menu
	var box = document.getElementById("dialogBox"), step = 0;
	new fd.util.Draggable(document.querySelectorAll("#xMenu .x-menu-title")).onStart(function(){
		//console.log(this)
		document.body.className = "x-draggable";
	}).onDrag(function(e){
		if(step++ > 10){
			box.style.display = "block";
			box.style.left = e.clientX + "px";
			box.style.top = e.clientY + "px";
		}
	}).onDrop(function(e){
		document.body.className = "";
		if(step > 10){
			box.style.display = "none";
			document.querySelectorAll(".x-sidebar")[0].style.display = "none";
			var tree = new fd.widget.SmartTree({
				"root": {"text": "ROOT", "value": -1},
				"store": td
			});
			new _$.widget.SimpleDialog({
				"width": 250,
				"height": 350,
				"title": "Widget",
				"location": {"x": e.clientX, "y": e.clientY},
				"content": tree.onClick(function(a, b){
								if(!this.isLeaf(b)){
									tree.expandTo(this);
								}
								else{
									tab.addTab({"name": a.textContent || a.innerText, "panel": "data:text/html,<htm><h2>" + a.innerHTML + "</h2>", "closable": true});
								}
							}).getContext(),
				"draggable": true
			}).id("dialogTree");
			step = 0;
		}
	});
});