(function(window,document){
	var d=document, that=window;
	if(!_$.hasOwnProperty("Tree")){
		_$["Tree"]=Tree;
	}
	function Tree(){
		this.tree=null;

		this.init=function(){
			this.tree=d.createElement("dl");
			this.tree.className="tree";
			return this.tree;	
		};
		this.id=function(id){
			id && (this.tree.setAttribute("id",id));
			return this;
		};
		this.getContext=function(){
			return this.tree || this.init();
		};
		if(!this.tree){
			this.tree=this.init();
		}
		return this;
	}
	Tree.prototype.root=function(title,id,isSelected){
		var tree=this.tree || this.getContext();
		if(_$.hasClass(tree,"ajax")){
			_$.removeClass(tree,"ajax");
		}
		var s = "<div class='relation'><b class='expanded'></b></div>" +
			"<div class='tree-icon'>";
		if(!id || id=="ajax"){
			_$.ajax(title,function(response,xhr){
				var data=response.replace(/^\s+/,"").replace(/\s+$/,"").replace(/\[+/,"").replace(/\]+/,"").split(/,/);
				s += "<span class='checkbox " + (data[3] || "") + "' value='" + (data[1] || -1) +"'></span><strong>" + (data[0] || title) + "</strong></div>";
				tree.innerHTML = "<dt>" + s + "</dt>";
			});
		}
		else{
			s += "<span class='checkbox " + (isSelected || "") + "' value='" + (id || -1) +"'></span><strong>" + (title || "Root") + "</strong></div>";
			tree.innerHTML = "<dt>" + s + "</dt>";	
		}
		return this;
	};
	Tree.prototype.makeTree=function(json,isSelected){
		var tree=this.tree || this.getContext();
		//tree.innerHTML += Tree.makeTitle("root");
		if(!json || !json.length) return this;
		tree.innerHTML += "<dd>" + Tree.makeTree(json,isSelected) + "</dd>";
		return this;
	};
	Tree.makeTree=function(json){
		var s = "",
			last="last-child",
			expanded="hidden";
		var len=json.length;
		for(var i=0,j; j=json[i++]; ){
			var child=j.children;
			if(i ^ len){
				s += "<dl class='node" + (child && " " + expanded || "") + "'>";
			}
			else{
				s += "<dl class='node "+ last + (child && " " + expanded || "") +"'>";
				
			}
			if(!j.children){
				var status=j.status=="on" ? "all" : j.status;
				s += "<dd class='leaf last-child'>" +
					 "<div class='relation'></div><div class='tree-icon'><span class='checkbox " + (status || "") + "' value='" + (j.value || "novalue") +"'></span><strong class='leaf'  value='" + (j.value || "novalue") +"'>" + j.text + "</strong></div></dd>";
			}
			else{
				s += "<dt><div class='relation'><b class='expanded'></b></div><div class='tree-icon'><span class='checkbox " + (j.status || "") + "' value='" + (j.value || "novalue") +"'></span><strong>" + j.text + "</strong></div></dt>";
				if(j.children.length)
					s += "<dd>" + this.makeTree(j.children) + "</dd>";
			}
			s += "</dl>";
		}
		return s;
	};
	Tree.prototype.clearAll=function(){
		var tree=this.tree || this.getContext();
		tree.removeChild(tree.getElementsByTagName("dd")[0]);
		return this;
	};
	Tree.prototype.bind=function(type,fn){
		var self = this;
		//alert(node)
		_$.addEvent(this.tree,type,function(e){
			var e = e || that.event, target = e.target || e.srcElement;
			if(target.tagName=="B" && _$.hasClass(target,"expanded")){
				var parent=Tree.getParent(target,"DL");
				if(self.name){
					var cid = parent.getAttribute("data-cid").toString(),
						name = "tree_" + self.name,
						node = _$.getData(name) || "";
					if(!_$.hasClass(parent,"hidden")){
						node = node.replace(new RegExp("^" + cid + ",|," + cid + "(?=(?:$|,))"), "","");//.replace(/,+$/,"");
						//node = node.replace(/(\d+),*/,"").replace(/,+$/,"");
					}
					else{
						node += "," + cid;
						node = node.replace(/^,+/,"");
					}
					_$.saveData(name,node);
				}
				self.toggleTo(parent,"hidden");
			}
			fn && fn(target);
		},0);
		return self;
	};
	Tree.jsonToString=function(json){
		var str=[];
		for(var i in json){
			str.push(i + "=" + json[i]);
		}
		if(!str.length) return "";
		return str.join(",");
	};
	Tree.prototype.isMultiple=function(fn){
		var tree=this.tree || this.getContext();
		_$.addClass(tree,"multip");
		_$.addEvent(tree,"click",function(e){
			var e = e || that.event, el=e.target || e.srcElement,
				arrays;
			if(_$.hasClass(el,"checkbox")){
				var parent=Tree.getParent(el,"DL");
				if(_$.hasClass(el,"on")){
					_$.removeClass(el,"on");
				}
				if(_$.hasClass(el,"all")){
					//取消
					_$.removeClass(el,"all");
					Tree.direction.down(el,0);
					//Tree.direction.up(el,0);
					//console.log(Tree.checked(parent));
					arrays="^@^";
				}
				else{
					//选择
					_$.addClass(el,"all");
					Tree.direction.down(el,1);
					arrays=el.arrays;
				}
				Tree.direction.up(parent);
				fn && fn(el,tree);
			}
		},0);
		return this;
	};
	Tree.checked=function(parent){
		var dir="nextSibling";
		do{
			var chk=parent.getElementsByTagName("span")[0];
			if(!parent[dir]){
				dir="previousSibling";
			}
			if(_$.hasClass(chk,"all") || _$.hasClass(chk,"on") )
			{
				var t=Tree.getParent(chk,"DL"),
					selNodes = t.parentNode.childNodes,
					sel = all = 0;
				for(var i=0; i<selNodes.length; i++){
					var selNode=selNodes[i];
					if(selNode.nodeType == 1){
						var span=selNode.getElementsByTagName("span")[0];
						if(_$.hasClass(span,"checkbox")){
							all++;
							if(_$.hasClass(span,"all")){
								sel++;	
							}
						}
					}	
				}
				//console.log("sel="+sel+" hafcheck="+hafcheck);
				if(sel == all){
					return 1;//全选
				}
				else{
					return 0;//半选	
				}
			}
		}while(parent=parent[dir]);
		return -1;//没有选择
	};
	Tree.direction={
		up: function(parent){
			if(_$.hasClass(parent,"tree"))
				return;
			var parentNode = Tree.getParent(parent,"DL"),
				chk = parentNode.getElementsByTagName("span")[0];
			if(Tree.checked(parent) == 0){
				_$.removeClass(chk,"all");
				_$.addClass(chk,"on");
			}
			if(Tree.checked(parent) == 1){
				_$.removeClass(chk,"on");
				_$.addClass(chk,"all");
			}
			if(Tree.checked(parent) == -1){
				_$.removeClass(chk,"all");
				_$.removeClass(chk,"on");
			}
			Tree.direction.up(parentNode);
		},
		down: function(el,flag){
			var parent=Tree.getParent(el,"DL");
			//el.arrays="";
			var sel=parent.getElementsByTagName("span");
			for(var i=0,len=sel.length; i<len; i++){
				var t=sel[i];
				if(_$.hasClass(t,"checkbox")){
					_$.removeClass(t,"on");
					flag ? _$.addClass(t,"all") : _$.removeClass(t,"all");
					//el.arrays+=t.getAttribute("value").toString()+"|";
				}
			}
		}
	};
	Tree.getParent=function(el,tag){
		while(el=el.parentNode){
			if(el.tagName==tag)
				return el;
		}
		return null;
	};
	Tree.prototype.toggleTo=function(elem,cls){
		if(_$.hasClass(elem,cls)){
			_$.removeClass(elem,typeof cls == "string" ? cls : cls.toString());
		}
		else{
			_$.addClass(elem,cls);
		}
	};
	Tree.prototype.appendTo=function(elem){
		elem.appendChild(this.tree || this.getContext());
		return this;
	};
	Tree.prototype.expand = function(name,array){
		this.name = name;
		var tree = this.tree || this.getContext(),
			nodes = tree.getElementsByTagName("dl"),
			temp = [tree.setAttribute("data-cid","0")],
			sw = function(data,flag){
				var arr = data;
				//console.log(arr)
				for(var i = 0, len = arr.length; i < len; i++){
					//console.log(temp[parseInt(arr[i],10)])
					var t = temp[parseInt(arr[i],10)];
					_$.removeClass(t,"hidden");
					if(flag){
						while(t = t.parentNode){
							if(t.tagName == "DL"){
								_$.removeClass(t,"hidden");	
							}	
						}
					}
				}
			};
		for(var i = 0, len = nodes.length; i < len; i++){
			if(nodes[i].getElementsByTagName("dl")[0]){
				nodes[i].setAttribute("data-cid",i + 1);
			}
			temp.push(nodes[i]);
		}
		if(array){
			sw(array,1);
		}
		else{
			var data =_$.getData("tree_" + name);
			if(data && typeof data === "string"){//alert(data)
				sw(data.split(","));
			}
		}
	};
	Tree.prototype.loadTree=function(url){
		var tree=this.tree || this.getContext(),
			self=this;
		_$.addClass(tree,"hidden");
		_$.addEvent(tree,"click",k,0);
		
		function k(e){
			var e = e || that.event, target = e.target || e.srcElement;
			if(target.tagName=="B" && _$.hasClass(target,"expanded")){
				var parent=Tree.getParent(target,"DL");
				if(!parent.ajax){
					//_$.addClass(tree,"ajax");
					var value=parent.getElementsByTagName("span")[0].getAttribute("value"),
						id;
					if(!value){
						alert("not value");
						return;
					}
					id=value-0;
					var type=url.split(/[\?|&]/);
					_$.ajax(type[0],function(response,xhr){
						_$.removeClass(target,"loading");
						var data=_$.parseJSON(response);
						
						if(data.length==0){
							alert("not children!");
							return;
						}
						parent.innerHTML += "<dd>" + Tree.makeTree(data) + "</dd>";//ajax
						parent.ajax=1;
					},type[1]+""+id);
					_$.addClass(target,"loading");
				}
				self.toggleTo(parent,"hidden");
			}
		}
		return this;
	};
})(this,document);