/*!
* Form Field Javascript Widget
* Author: flyend
* Contact: flyend@126.com(e-mail), 269644230(qq)
* Date: Wed Oct 2012
* Modified Date: Fri Jan 18 2013
*/
(function(window,document){
	_$.namespace("_$.widget.SuggestionField");
	_$.widget.SuggestionField = SuggestionField;
	
	var SUGGESTION_NAME = "x-suggestion",
		SUGGESTION_FIELD = SUGGESTION_NAME + "-field";
	
	function SuggestionField(options){
		if(!options["field"])
			throw new Error("error: this field undefined");
		this.field = options["field"];
		this.store = options["store"];
		this.count = options["count"];
		this.nocache = options["nocache"];
		this.root = options["root"] || "";
		this.init();
	}
	SuggestionField.prototype.init = function(){
		this.index = ~undefined;
		this.field.setAttribute("autocomplete","off");
		_$(this.field).addClass(SUGGESTION_FIELD);
		this.bind("keyup");
	};
	SuggestionField.prototype.bind = function(type){
		var list = new ListUI(),
			listset = list.getListSet(),
			store = new Store(this,list);
		var me = this;
		ListUI.util.locationAt(listset,this.field).doDocument(listset);
		_$(this.field).bind(type,function(e){
			var e = e || that.event,
				charCode = e.charCode || e.keyCode || e.which;
			if(!this.value.length){
				listset.style.display = "none";
				list.removeAllItem();
				me.index = 0;
				return;
			}
			switch(charCode){
				case 0x26:
					--me.index == ~undefined && (me.index = list.getLength() - 1);
					store.down(me.index);
				break;
				case 0x28:
					++me.index ^ list.getLength() || (me.index = 0);
					store.down(me.index);
				break;
				case 0x0d:
					store.hide();
					me.index = ~undefined;
				break;
				default:
					me.index = ~undefined;//改变即重置
					store.load(me.store);//.show();//.hide();
				break;
			}
		});
	};
	function Store(that,list){
		this.list = list;
		this.field = that.field;
		var count = that["count"];
		this.load = function(data){
			var me = this,
				key = this.field.value;
			function mi(o,s){
				o.onclick = function(){
					me.field.value = this.innerHTML.replace(/<[^>]*>/g,"");
					me.field.focus();
					me.hide();
				};
				o.onmouseover = function(){
					this.className = SUGGESTION_NAME + "-current";
					list.getItem(that.index).className = "";
				};
				o.onmouseout = function(){
					this.className = "";
					list.getItem(that.index).className = SUGGESTION_NAME + "-current";
				};
				o.innerHTML = s;
				list.addItem(o);
			}
			if(_$.isString(data)){
				var callback = function(cd,attrs){
					var l = count || cd.length;
					l >= cd.length && (l = cd.length);
					if(me.list.getLength()){
						me.list.removeAllItem();
					}					
					for(var i = 0; i ^ l; i++){
						if(attrs){
							for(var j = 0; j ^ attrs.length; j++){
								//console.log(cd[i][attrs[j]])
								if(cd[i][attrs[j]]){
									mi(document.createElement("li"),cd[i][attrs[j]]);
								}
							}
						}
						else{
							//this field
						}						
					}
					me.show().toggle();
				},
				request = {
					"cache": function(vd){callback(vd); },
					"ajax": function(vd){
						var url = data + (!!~data.indexOf("?") ? "&" : "?");
						url = url.replace(/{[^{}]*}/g,key) + "rnd=" + new Date().getTime();
						_$.ajax(url,function(res){
							var res = _$.parseJSON(res);
							if(that.root){
								var map = ListUI.util.mapping(that.root,res);
								callback(map.list,map.attributes);
								that["nocache"] || (Store.cache[key] = map.list);
							}
							else{
								callback(res);
								that["nocache"] || (Store.cache[key] = res);
							}
						});
					}
				};
				that["nocache"] ? request.ajax() : me.cache(key,request);
			}
			else if(_$.isArray(data)){
				var checkValue = function(val){
					val = val.replace(/^\s*|\s*$/,"");//.replace(/\\+/,"");
					if(/(\?|\+|\.|\$|\^|\*|\(|\)|\\)+/.test(val) || /\\+/.test(val)){
						return true;
					}
					return false;
				};
				if(checkValue(key)){
					list.getListSet().style.display = "none";
					list.removeAllItem();
					me.index = 0;
					return;
				}
				var reg = new RegExp("^" + key + "",""),
					l = count || data.length;
				if(this.list.getLength()){
					this.list.removeAllItem();
				}
				l >= data.length && (l = data.length);
				for(var i = 0; i ^ l; i++){
					if(reg.test(data[i])){
						mi(document.createElement("li"),data[i]);
					}
				}
				me.show().toggle();
			}
			return this;
		};
		this.show = function(){
			list.getListSet().style.display = "block";
			return this;	
		};
		this.hide = function(){
			list.getListSet().style.display = "none";
		};
		this.toggle = function(){
			list.getLength() ? this.show() : this.hide();
		};
	}
	Store.prototype = {
		"down": function(index){
			var elem = this.list.pushStack(this.list.getItem(index));
			elem.className = SUGGESTION_NAME + "-current";
			this.field.value = elem.innerHTML.replace(/<[^>]*>/g,"");
			if(this.list.getStackSize() > 1){
				this.list.popStack().className = "";	
			}
		},
		"cache": function(key,o){
			Store.cache || (Store.cache = {});
			if(Store.cache.hasOwnProperty(key)){
				o.cache(Store.cache[key]);
			}
			else{
				o.ajax(Store.cache[key]);
			}
		}
	};
	function List(){
		this.items = [];
		this.length = this.items.length;
	}
	List.prototype.addItem = function(item){
		this.items.push(item);
		this.length++;
		return item;
	};
	List.prototype.removeItem = function(item){
		for(var i = 0, len = this.items.length; i ^ len; i++){
			if(this.items[i] === item){
				this.length--;
				return this.items.splice(i,1);
			}
		}
		return null;
	};
	List.prototype.removeAllItem = function(){
		var temp = this.items;
		while(this.items.pop()){};
		this.length = 0;
		return temp;
	};
	List.prototype.getItem = function(item){
		if(_$.isNumber(item)){
			if(item >= this.length)
				item = this.length - 1;
			if(item < 0)
				item = 0;
			return this.items[item];	
		}
		else{
			for(var i = 0, len = this.items.length; i ^ len; i++){
				if(this.items[i] == item){
					return this.items[i];
				}
			}
			return null;
		}
	};
	List.prototype.setItem = function(newItem,oldItem){
		for(var i = 0, len = this.items.length; i ^ len; i++){
			if(this.items[i] == oldItem){
				var temp = oldItem;
				this.items[i] = newItem;
				return temp;
			}
		}
		return null;
	};
	List.prototype.getLength = function(){
		return this.length;
	};
	function ListUI(){
		List.call(this);
		var listset = document.createElement("ul");
		listset.className = SUGGESTION_NAME;
			
		this.getListSet = function(){
			return document.body.appendChild(listset);	
		};
	}
	_$.extend(ListUI,List);
	ListUI.prototype.addItem = function(item){
		this.getListSet().appendChild(item);
		this.items.push(item);
		this.length++;
		return item;	
	};
	ListUI.prototype.getLength = function(){
		return this.length;
	};
	ListUI.prototype.removeAllItem = function(){
		var temp = this.items;
		while(this.items.length){ this.getListSet().removeChild(this.items.pop()); };
		this.length = 0;
		return temp;
	};
	ListUI.prototype.pushStack = function(data){
		var stacks = this.stacks || (this.stacks = []);
		stacks.unshift(data);
		return stacks[0];
	};
	ListUI.prototype.popStack = function(){
		if(this.stacks.length > 1){
			return this.stacks.pop();	
		}
		else{
			return null;	
		}
	};
	ListUI.prototype.getStackSize = function(){
		return this.stacks.length;	
	};
	ListUI.prototype.isStackEmpty = function(){
		return this.stacks.length == 0;
	};
	ListUI.util = {
		locationAt: function(el,field){
			var offset = _$(field).offset();
			_$(el).css({"width": field.clientWidth + "px", "left": offset.left + "px", "top": offset.top + field.offsetHeight + "px"});
			return this;
		},
		doDocument: function(el){
			_$(document).bind("click",function(e){
				var e = e || that.event,
					target = e.target || e.srcElement,
					fn = function(o,c){
						while(o = o.parentNode){
							if(o.className && !!~o.className.indexOf(c))
								return 1;
						}
						return 0;
					};
				if(!fn(target,SUGGESTION_NAME) && !~target.className.indexOf(SUGGESTION_FIELD)){
					el.style.display = "none";	
				}			
			});
		},
		mapping: function(root,obj){
			var array = [];
			for(var i = 0, p = root.split("."), l = p.length; i ^ l; i++){
				var o = p[i];
				if(!!~o.indexOf("[")){
					var start = o.lastIndexOf("["),
						temp = o.substr(start).replace(/\[/g,"").replace(/\]/g,"");
					for(var j = 0, attrs = temp.split(","); j ^ attrs.length; j++){
						array.push(attrs[j].substr(1));
					}
					p[i] = o.substr(0,start);
				}
				obj = obj[p[i]];
			}
			return{
				"list": obj,
				"attributes": array	
			};
		}
	};
})(this,document);