fd.namespace("app.mobile");
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
/*
* Menu
*/
(function(window, ocument, fd){
	fd.namespace("app.mobile.Menu");
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
	}
	Menu.prototype.bind = function(el,opt){
		fd.selectAll(el).bind(app.mobile.events["click"], function(e){
			var e = e || window.event,
				target = e.target || e.srcElement;
			if(!!~target.className.indexOf(opt["title"])){
				var parent = target.parentNode;
				!parent.show ? (fd.selectAll(parent).addClass("x-hide"), parent.show = 1) : (fd.selectAll(parent).removeClass("x-hide"), parent.show = 0); 
				console.log(parent);	
			}
		});
	};
	app.mobile.Menu.getInstance = function(){
		if(!menu)
			menu = new Menu();
		return menu;
	};
})(this, document, fd);
fd.selectAll(document).ready(function(){
	var m = app.mobile.Menu.getInstance();
	m.bind(fd.selectAll("#xMenu")[0],{
		"title": "x-menu-title"	
	});
	var tab = new fd.widget.SmartTab({
		"nav": [{"name": "Home", "panel": "widget/widget.html"}]
	}).appendTo(fd.selectAll("#xmain")[0]);
	fd.selectAll("#xMenu").bind("click", function(e){
		var e = e || window.event,
			target = e.target || e.srcElement;
		if(target.tagName == "A"){
			if(e.preventDefault)
				e.preventDefault();
			if(e.cancelBubble)
				e.cancelBubble = true;
			tab.addTab({"name": target.textContent || target.innerText, "panel": "data:text/html,<htm><h2>" + target.innerHTML + "</h2>", "closable": true, "actived": true});
			return false;
		}
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
			new fd.widget.SimpleDialog({
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