/*!
* Form Field Javascript Widget
* Author: flyend
* Contact: flyend@126.com(e-mail), 269644230(qq)
* Date: Wed Oct 2012
* Modified Date: Fri Jan 18 2013
*/
(function(callback){
	var fd = (function(){
        var fd = {};
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
        fd.select = fd.selectAll = function(selector, context){
            return new fd.fn.init(selector, context);   
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
                return this;
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
			},
			css: function(name, value){
	            if(!value && typeof name === "string"){
	                var el = this[0];
	                if(el.style[name]){
	                    return el.style[name];  
	                }
	                else if(el.currentStyle){
	                    return el.currentStyle[name];   
	                }
	                else if(document.defaultView && document.defaultView.getComputedStyle){
	                    var name = name.replace(/(A-Z)/g, "-$1").toLowerCase(),
	                        style = document.defaultView.getComputedStyle(el, null);
	                    if(style){
	                        return style.getPropertyValue(name);
	                    }
	                }
	                else
	                    return null;
	            }
	            if(typeof name !== "object"){
	                var t = {};
	                t[name] = value;
	                name = t;   
	            }
	            for(var i = 0; i < this.length; i++){
	                for(var p in name){
	                    this[i].style[p] = name[p]; 
	                }
	            }
	            return this;
	        },
	        bind: function(type, fn, capture){
	            var self = this;
	            for(var i = 0; i < this.length; i++){
	                document.addEventListener ? this[i].addEventListener(type, fn, !!capture) : document.attachEvent ? this[i].attachEvent("on" + type, (function(arg){
	                    return function(){
	                        return fn.call(self[arg] || window,  window.event);
	                    }
	                })(i)) : this[i]["on" + type] = fn;
	            }
	        },
            length: 0,
            splice: [].splice
        };
        fd.fn.init.prototype = fd.fn;
        fd.extend = fd.fn.extend = function(){
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
                            d3.extend(target[p], prop[p]);  
                        }
                        else if(prop[p]){
                            target[p] = prop[p];    
                        }
                    }
                }
            }
            return target;
        };
        return fd;
    })();
    fd.ajax = function(options){
        var xmlhttp,
            xhr = [
                function(){return new XMLHttpRequest()},
                function(){return new ActiveXObject("Msxml2.XMLHTTP")},
                function(){return new ActiveXObject("Msxml3.XMLHTTP")},
                function(){return new ActiveXObject("Microsoft.XMLHTTP")}
            ],
            url = options["url"],
            data = options["data"],
            type = options["type"],
            query = "";
        function parseParams(o){
            var s = "";
            for(var p in o){
                s += "&" + p + "=" + o[p];
            }
            return s.length ? s.substr(1) : "";
        }
        (function(s, o){
            var reg = /[\?|&]+/,
                s = s.split(reg),
                t;
            if(!reg.test(s))
                return;
            for(var i = 0; i < s.length; i++){
                t = s[i].split("=");
                if(!o.hasOwnProperty(t[0])){
                    o[t[0]] = t[1];
                }
            }
        })(url.substr(url.indexOf("?") + 1), data);
        //console.log(parseParams(data), data, url.substr(0, url.indexOf("?")));
        for(var i = 0; i < xhr.length; i++){
            try{
                xmlhttp = xhr[i]();
            }
            catch(e){
                continue;
            }
            break;
        }
        //url = url.split(/[\?|&]/)[0];
        query = (!!~url.indexOf("?") ? (url + (data ? "&" : "") + parseParams(data)) : (url + "?" + parseParams(data)));
        xmlhttp.open(type || "GET", (!type || (type && /GET/i.test(type))) ? query : url.split(/[\?|&]/)[0], options["async"] || true);//true 异步（默认）
        xmlhttp.setRequestHeader("If-Modified-Since", "0");
        if(/post/i.test(options["type"]))
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                options["success"] && options["success"](xmlhttp, query);
            }
        };
        xmlhttp.send(/GET/i.test(type) ? null : parseParams(data));
    };
    fd.parseJSON = fd.parseJSON || (function(){
        return function(data){
            if ( typeof data !== "string" || !data ) {
                return null;
            }
            data = data.replace(/^\s+/,"").replace(/\s+$/,"");
            if ( window.JSON && window.JSON.parse ) {
                return window.JSON.parse( data );
            }
            var rvalidchars=/^[\],:{}\s]*$/,
                rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;          
            if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                .replace( rvalidtokens, "]" )
                .replace( rvalidbraces, "")) ) {
                return (new Function( "return " + data ))();
            }
            return "Invalid JSON: " + data; 
        }
    })();
    fd.isType = function(o){
		return o == null ? String(o) : {
			"[object String]": "string",
			"[object Object]": "object",
			"[object Function]": "function",
			"[object Array]": "array",
			"[object Number]": "number"
		}[Object.prototype.toString.call(o)] || null;
	};
    return function(f){
		callback && callback.call(fd, f);
	}
}).call(this, function(factory){
	return factory(window, this);
})(function(window, _fd, undefined){
	_fd.namespace("fd.widget.SuggestionField");
	fd.widget.SuggestionField = SuggestionField;
	
	var SUGGESTION_NAME = "x-suggestion",
		SUGGESTION_FIELD = SUGGESTION_NAME + "-field";
	
	function SuggestionField(options){
		if(!options["field"])
			throw new Error("error: this field undefined");
		this.field = options["field"];
		this.store = options["store"];
		this.count = options["count"];
		this.nocache = options["nocache"];
		this.mapping = options["mapping"] || "";
		this.init();
	}
	SuggestionField.prototype.init = function(){
		this.index = ~undefined;
		this.field.setAttribute("autocomplete","off");
		_fd.selectAll(this.field).addClass(SUGGESTION_FIELD);
		this.bind("keyup");
	};
	SuggestionField.prototype.bind = function(type){
		var list = new ListUI(),
			listset = list.getListSet(),
			store = new Store(this,list);
		var me = this;
		ListUI.util.locationAt(listset,this.field).doDocument(listset);
		_fd.selectAll(this.field).bind(type, function(e){
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
	function Store(that, list){
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
			if(_fd.isType(data) === "string"){
				var callback = function(cd, attrs){
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
						url = url.replace(/{[^{}]*}/g, key) + "rnd=" + new Date().getTime();
						_fd.ajax(url,function(xhr){
							var res = _fd.parseJSON(xhr.responseText);
							if(that.mapping){
								var map = ListUI.util.mapping(that.mapping, res);
								callback(map.list, map.attributes);
								that["nocache"] || (Store.cache[key] = map.list);
							}
							else{
								callback(res);
								that["nocache"] || (Store.cache[key] = res);
							}
						});
					}
				};
				that["nocache"] ? request.ajax() : me.cache(key, request);
			}
			else if(_fd.isType(data) === "array"){
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
				var reg = new RegExp("^" + key + "", ""),
					l = count || data.length;
				if(this.list.getLength()){
					this.list.removeAllItem();
				}
				l >= data.length && (l = data.length);
				for(var i = 0; i ^ l; i++){
					if(reg.test(data[i])){
						mi(document.createElement("li"), data[i]);
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
		"cache": function(key, o){
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
		if(_fd.isType(item) === "number"){
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
	List.prototype.setItem = function(newItem, oldItem){
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
		//_fd.extend(ListUI.prototype, List.prototype);
		var list = new List();		
		var listset = document.createElement("ul");
		listset.className = SUGGESTION_NAME;

		this.items = list["items"];
		this.getListSet = function(){
			return document.body.appendChild(listset);	
		};
		this.getItem = list["getItem"];
	}
	ListUI.prototype.addItem = function(item){
		this.getListSet().appendChild(item);
		this.items.push(item);
		this.length = this.items.length;
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
			var offset = _fd.selectAll(field).offset();
			_fd.selectAll(el).css({"width": field.clientWidth + "px", "left": offset.left + "px", "top": offset.top + field.offsetHeight + "px"});
			return this;
		},
		doDocument: function(el){
			_fd.selectAll(document).bind("click", function(e){
				var e = e || that.event,
					target = e.target || e.srcElement,
					fn = function(o, c){
						while(o = o.parentNode){
							if(o.className && !!~o.className.indexOf(c))
								return 1;
						}
						return 0;
					};
				if(!fn(target, SUGGESTION_NAME) && !~target.className.indexOf(SUGGESTION_FIELD)){
					el.style.display = "none";	
				}			
			});
		},
		mapping: function(root, obj){
			var array = [];
			for(var i = 0, p = root.split("."), l = p.length; i ^ l; i++){
				var o = p[i];
				if(!!~o.indexOf("[")){
					var start = o.lastIndexOf("["),
						temp = o.substr(start).replace(/\[/g,"").replace(/\]/g, "");
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
});