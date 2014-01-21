(function(window,document){
	var that = window, document = document, $;
	var J = new Object();
	$ = (function(){
		var $ = function(selector,context){
			//if(document.querySelectorAll){
				//return $.toArray(document.querySelectorAll(selector));
				//return $.fn.init((context || document).querySelectorAll(selector));
			//}
			function query(selector,context){
				if(typeof selector == "object" && selector.nodeType || selector == that)
					return [selector];
				var el, elements = [];
				if(/^#([\w-]+)$/.test(selector)){
					el = document.getElementById(RegExp.$1);
					return [el];
				}
				!context && (context = document);
				var expr = selector.match(/^(?:(#[\w\-]+))?\s*(?:(\w+))?(?:\.([\w\-]+))?(?:\[(.+)\])?$/);
				var id = expr[1],
					tag = expr[2],
					cls = expr[3],
					attr = expr[4];
				
				if(id){
					context = document.getElementById(id.substr(1));
				}
				var nodes = (context || document).getElementsByTagName(tag || "*");
				if(tag){
					elements = context.getElementsByTagName(tag);
					//console.log(elements)
					return elements;
				}
				else if(cls){
					if(document.getElementsByClassName){
						elements = (context || document).getElementsByClassName(cls);
						//return elements;
					}
					else{
						var reg = new RegExp("(^|\\s)" + cls + "($|\\s)");
						for(var i=0, l = nodes.length; i<l; i++){
							reg.test(nodes[i].className) && elements.push(nodes[i]);
						}
						//if(query.length==0) return null;	
						//return elements;
					}
					return elements.length ? elements : [];
				}
				return [];
			};
			return $.fn.init(query(selector,context));
		};
		$.fn = $.prototype = {
			init: function(dom){
				if(dom.length >= 1){
					for(var i = 0, len = dom.length; i < len; i++)
						this[i] = dom[i];
				}
				else{
					this[0] = dom;
				}
				this.length = dom.length;
				return this;
			},
			find: function(selector){
				//如果不指定get进行二次find，总是找到最后一个
				for(var i = 0, l = this.length; i < l; i++){
					var result = $(selector,this[i]);
				}
				return result;
			},
			get: function(index){
				index < 0 && (index = 0);
				var len = this.length - 1;
				if(index > len) index = len;
				return $(this[index]);
			},
			each: function(fn,scope){
				J.util.each(this,fn,scope);
			},
			css: function(key,value){
				return J.css.css(this,key,value);
			},
			addClass: function(className){
				return J.css.addClass(this,className);
			},
			removeClass: function(className){
				return J.css.removeClass(this,className);
			},
			toggleClass: function(className){
				
			},
			hasClass: function(className){
				if(this.length == 0) return false;
				return J.css.hasClass(this[0],className);
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
			html: function(val){
				
			},
			bind: function(type,fn){
				$.each(this,function(){
					J.events.bind(this,type,fn);
				});
			},
			unbind: function(type,fn){
				$.each(this,function(){
					J.events.unbind(this,type,fn);
				});	
			},
			ready : function(fn){
				J.events.ready(fn);	
			}
		};
		return $;
	})();
	/*util*/
	(function(obj){
		obj.util={
			isArray: function(value){ return Object.prototype.toString.call(value) === "[object Array]"; },
			isObject: function(value){ return Object.prototype.toString.call(value) === "[object Object]"; },
			isFunction: function(value){ return toString.call(value) === "[object Function]"; },
			makeArray: function(collection){
				if(util.isArray(collection))
					return collection;
				var arr;
				arr=slice.call(collection);
				if(!util.isArray(arr) || !arr.length){
					arr=[];
					len=collection.length;
					while(len--){
						arr[len]=collection[len];	
					}	
				}
				return arr;
			},
			inArray: function(arr,value){
				return J.util.array.indexOf(arr,value);
			},
			array: {
				remove: function(arr,i){
					n >= 0 && arr.splice(i,1);
					return arr;
				},
				insert: function(arr,i,value){
					
				},
				indexOf: function(arr,value){
					for(var i=0,l=arr.length; i<l; i++)
						if(arr[i] == value)
							return i;
					return -1;
				}	
			},
			each: function(obj,fn,scope){
				var i = 0, len = obj.length;
				for(; i ^ len; i++)
					if(fn.call(scope || obj[i], obj[i], i, obj) === false) return i;
				return obj;
			},
			extend: function(target){
				for(var i = 1,l = arguments.length; i < l; i++){
					var src = arguments[i];
					if(src){
						for(var p in src){
							target[p] = src[p];
						}	
					}
				}
				//console.log(target)
				return target;
			}
		};	
	})(J);
	/*css*/
	(function(obj){
		var style = new CSSUtil();
		obj.css = {
			css: function(object,name,val){ return style.css(object,name,val);},
			height: function(val){ },
			width: function(val){},
			offset: function(){},
			hasClass: function(el,className){ return style.hasClass(el,className);},
			addClass: function(el,className){ return style.addClass(el,className);},
			removeClass: function(el,className){ return style.removeClass(el,className);},
			toggleClass: function(className){}
		};
		function CSSUtil(){
			this.css = function(object,key,value){
				if(typeof key === "string" && value === undefined){
					var obj = object[0]
					if(obj.style[key]){  
						return obj.style[key];  
					}  
					else if(obj.currentStyle){  
						return obj.currentStyle[key];//IE  
					}  
					else if(document.defaultView && document.defaultView.getComputedStyle){  
						key = key.replace(/([A-Z])/g,"-$1");  
						key = key.toLowerCase();//驼峰命名法  
						var s = document.defaultView.getComputedStyle(obj,null);  
						if(s) return s.getPropertyValue(key);  
					}  
					else{  
						return null;  
					}
				}
				if(typeof key != "object"){
					var temp = {};
					temp[key] = value;
					key = temp;									
				}
				return $.each(object,function(){
					for(var i in key)
						this.style[i] = key[i];
				});
			};
			this.hasClass = function(el,className){
				return el && J.util.inArray(el.className.split(/\s+/),className) > -1;
			};
			this.addClass = function(el,className){
				var self = this;
				$.each((className || "").split(/\s+/),function(k,y){
					$.each(el,function(){
						if(this.nodeType == 1 && !self.hasClass(this,className)){
							this.className += (this.className.length ? " " : "") + className;	}
					});
				});
				return el;//C object
			};
			this.removeClass = function(el,className){
				className = /\s+/.test(className) ? className.split(/\s+/) : [className];
				if(className !== undefined){
					$.each(className,function(k,i){
						$.each(el,function(){
							this.className = this.className.replace(new RegExp("(^|\\s+)" + className[i] + "(\\s+|$)"), "");//bug
						});
					});								
				}
				return el;
			};
		}
	})(J);
	/*attributes*/
	(function(obj){
		obj.attr = {
			attr: function(key,val){},
			removeAttr: function(key){}	
		};
	})(J);
	/*html*/
	(function(obj){
		obj.html = {
			html: function(el,val){
				if(val && typeof val === "string"){
						
				}	
			},
			text: function(val){},
			val: function(val){}	
		};
	})(J);
	/*event*/
	(function(obj){
		//var events = new EventUtil();
		obj.events = {
			bind: function(el,type,fn,data){ EventUtil.addEvent(el,type,fn,data);},
			unbind: function(el,type,data){ EventUtil.removeEvent(el,type,data); },
			trigger: function(type,data){},
			mousedwon: function(fn){},
			mouseup: function(fn){},
			mousemove: function(fn){},
			mouseover: function(fn){},
			mouseout: function(fn){},
			keydown: function(fn){},
			keypress: function(fn){},
			keyup: function(fn){},
			blur: function(fn){},
			unblur: function(){},
			focus: function(){},
			select: function(fn){},
			change: function(){},
			submit: function(){},
			click: function(fn){},
			dblclick: function(){},
			hover: function(fnin,fnout){},
			toggle: function(fnin,fnout){},
			load: function(fn){},
			unload: function(fn){},
			resize: function(fn){},
			scroll: function(fn){},
			ready: function(fn){ EventUtil.ready(fn); }
		};
		var EventUtil = {
			addEvent: (function(){
				if(document.addEventListener){
					return function(el,type,fn){
						if(el.length){
							for(var i=0; i<el.length; i++){
								EventUtil.addEvent(el[i],type,fn);
							}
						}
						else{
							el.addEventListener(type,fn,false);	
						}
					}
				}
				else{
					return function(el,type,fn){
						/*if(el.length){
							for(var i=0; i<el.length; i++){
								EventUtil.addEvent(el[i],type,fn);	
							}
						}
						else{
							var ref="_" + type;
							!el[ref] && (el[ref]=[]);
							for(var p in el[ref])
								if(el[ref][p] == fn)
									return;
							el[ref].push(fn);
							el.attachEvent("on"+type,function(){
								for(var p in el[ref])
									return el[ref][p].call(el || that,that.event);	
							});
						}*/
						if(el.length){
							for(var i=0; i<el.length; i++){
								EventUtil.addEvent(el[i],type,fn);	
							}
						}
						else{
							el.attachEvent("on"+type,function(){
								return fn.call(el,window.event);	
							});
						}
					}	
				}
			})(),
			removeEvent: (function(){
				if(document.removeEventListener){
					return function(el,type,fn){
						if(el.length){
							for(var i=0, len=el.length; i<len; i++)
								EventUtil.removeEvent(el[i],type,fn);	
						}
						else
							el.removeEventListener(type,fn,0);
					}
				}
				else{
					return function(el,type,fn){
						if(el.length){
							for(var i=0, len=el.length; i<len; i++){
								EventUtil.removeEvent(el[i],type,fn);	
							}
						}
						else{
							if(el.detachEvent){
								if(el["_"+type]){
									for(var p in el["_"+type]){
										if(el["_"+type][p] == fn){
											el["_"+type].splice(p,1);
											break;	
										}	
									}	
								}
							}
							else{
								el["on"+type]=null;	
							}
						}
					}	
				}
			})()
		}
		EventUtil.ready = function(fn){
			var loaded = false,
				readyFunc = function(){
					if(loaded) return;
					loaded = true;
					fn();
				};
			if(document.addEventListener){
				this.addEvent(document,"DOMContentLoaded",readyFunc);
			}
			else if(document.attachEvent){
				this.addEvent(document,"readystatechange",function(){
					if(document.readyState == "complete") readyFunc();
				},!1);
				if(document.documentElement.doScroll && typeof that.frameElement==="undefined"){
					var ieReadyFunc = function(){
						if(loaded) return;
						try{
							document.documentElement.doScroll("left");
						}
						catch(ex){
							that.setTimeout(ieReadyFunc,0);
							return;
						}
						readyFunc();
					};
					ieReadyFunc();
				}
			}
			this.addEvent(that,"load",readyFunc);
		};
	})(J);
	$.each = function(obj,fn,scope){
		J.util.each(obj,fn,scope);	
	};
	$.ajax = function(url,fn,type){
		var xmlhttp;
		var xhr = [
				function(){return new XMLHttpRequest()},
				function(){return new ActiveXObject("Msxml2.XMLHTTP")},
				function(){return new ActiveXObject("Msxml3.XMLHTTP")},
				function(){return new ActiveXObject("Microsoft.XMLHTTP")}
			];
		for(var i = 0; i < xhr.length; i++){
			try{
				xmlhttp = xhr[i]();
			}
			catch(e){
				continue;
			}
			break;
		}
		xmlhttp.open(type ? "POST" : "GET",url,1);//true 异步（默认）
		xmlhttp.setRequestHeader("If-Modified-Since","0");
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
		xmlhttp.onreadystatechange=function(){
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            	fn && fn(xmlhttp.responseText, xmlhttp);
			}
		};
		xmlhttp.send(type);	
	};
	$.parseJSON = function(data){
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
	};
	$.browser = {
		"ie": !!window.ActiveXObject && /msie (\d)/i.test(navigator.userAgent) ? RegExp['$1'] : false
	};
	$.extend = function(subClass,superClass){
		var F = function(){};
		F.prototype = superClass.prototype;
		subClass.prototype = new F();
		subClass.prototype.constructor = subClass;
		subClass.superclass = superClass.prototype;
		if(superClass.prototype.constructor == Object.prototype.constructor)
			superClass.prototype.constructor = superClass;	
	};
	$.namespace = function(){
		//if(!ns || !ns.length)
			//return null;
		/*var o = ns.split("."),
			currentNS = $;
		for(var i = (o[0] == "_$") ? 1 : 0; i ^ o.length; ++i){
			currentNS[o[i]] = currentNS[o[i]] || {};
			//currentNS[o[i]] = fn;
			currentNS = currentNS[o[i]];
		}
		return currentNS;*/
		var o, d;
		$.each(arguments,function(array){
			d = array.split(".");
			o = window[d[0]] =	window[d[0]] || {};
			$.each(d.slice(1),function(array2){
				o = o[array2] = o[array2] || {};
			});
		});
		return o;
	};
	$.cancelEvent = function(e){
		var e = e || window.event;
		if(e.stopPropagation){
			e.stopPropagation();
		}
		if(e.preventDefault){
			e.preventDefault();	
		}
		e.cancelBubble = true;
		e.returnValue = false;
		return false;
	};
	$.loadJs = function(url,callback){
		var head = _$("head")[0],
			script = d.createElement("script"),
			s = !1;
		script.src = url;
		script.onload = script.onreadystatechange = function(){
			if(!s && !this.readyState || this.readyState  == "loaded" || this.readyState  == "complete"){
				s = !0;
				script.onload = script.onreadystatechange = null;
				callback && callback(this);
				//script.parentNode.removeChild(script);
			}
		};
		head.appendChild(script);
	};
	$.isObject = function(obj){ return Object.prototype.toString.call(obj) === "[object Object]";};
	$.isArray = function(obj){ return Object.prototype.toString.call(obj) ===	"[object Array]";};
	$.isString = function(obj){ return Object.prototype.toString.call(obj) === "[object String]";};
	$.isNumber = function(obj){ return Object.prototype.toString.call(obj) === "[object Number]";};
	$.isFunction = function(obj){ return Object.prototype.toString.call(obj) === "[object Function]";};
	window["_$"] = $;
})(this,document);