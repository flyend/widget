(function(callback){
    var fd = (function(){
        var fd = {};
        fd.selectAll = function(selector, context){
            return new fd.fn.init(selector, context);
        }
        fd.bindAtEventListener = function(a, b){
            var d = Array.prototype.slice.call(arguments).slice(2);
            return function(f){
                return b.apply(a || window, [f || window.event].concat(d));
            }
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
        }
        fd.fn = fd.prototype = {
            init: function(selector, context){
                if(selector.nodeType || selector === window){
                    this[0] = selector;
                    this.length = 1;
                    return this;
                }
                else if(typeof selector === "string"){
                    //selector = selector.replace(/[^|\s*]|[\s*|$]/g, "");
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
                    document.addEventListener ? this[i].addEventListener(type, fn, !1) : document.attachEvent ? this[i].attachEvent("on" + type, (function(arg){
                        return function(){
                            return fn.call(self[arg] || window,  window.event);
                        }
                    })(i)) : this[i]["on" + type] = fn;
                }
            },
            unbind: function(el, type, fn, capture){
                el.removeEventListener ? el.removeEventListener(type, fn, !1) : el.detachEvent ? el.detachEvent("on" + type, fn) : el["on" + type] = null;
            },
            ready: (function(){
                var readyList = [],
                    loaded = false,
                    readyFn = function(){
                        if(loaded)
                            return;
                        loaded = true;
                        for(var i = 0, l = readyList.length; i < l; i++){
                            readyList[i]();
                        }
                        readyList = [];
                    }                            
                return function(f){
                    readyList.push(f);
                    if(document.addEventListener){
                        document.addEventListener("DOMContentLoaded", readyFn, !1);
                    }
                    else if(document.attachEvent){
                        document.attachEvent("readystatechange", function(){
                            /loaded|complete/i.test(document.readyState) && readyFn();
                        });
                        if(document.documentElement.doScroll && typeof window.frameElement === "undefined"){
                            if(loaded)
                                return;
                            try{
                                document.documentElement.doScroll("left");
                            }
                            catch(e){
                                setTimeout(readyFn, 0);
                                return;
                            }
                            readyFn();
                        }
                    }
                    window.onload = readyFn;
                }
                //this.bind(this[0],);
            })(),
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
            }
        }
        fd.fn.init.prototype = fd.prototype;
        return fd;
    })();
    /*(typeof module != "undefined" && module.exports)
        ? module.exports = fd
        : ((typeof define === "function" && define.amd && define.amd.fd) ? define("fd", [], function(fd){ return fd; }) : this["fd"] = fd);
    //console.log(this["fd"])*/
    return function(f){
        callback.call(fd, f);
    }
}).call(this, function(factory){
    if(typeof define == "function" && define.amd && define.amd.fd){
        define(["fd"], function(fd){
            return factory(window, fd);
        });
    }
    else{
        factory(window, this);
    }
})(function(window, _fd, undefined){
    _fd.namespace("fd.widget.ChainedSelector");
    fd.widget.ChainedSelector = ChainedSelector;
    var CHAINSELECTOR = "x-chain",
        isType = function(o){
            return o == null ? String(o) : {
                    "[object Array]": "array",
                    "[object Function]": "function",
                    "[object String]": "string",
                    "[object Object]": "object",
                    "[object Number]": "number"
                }[Object.prototype.toString.call(o)] || null;
        };
    function ChainedSelector(options){
        this.selector = [];
        var self = this;
        var store = new Store();
        
        if(options["field"]){
            this.selector[0] = {
                "context": new List(options["field"]).add(options["text"], options["value"]).bind("change", function(){
                    options["value"] = this.value;
                    options["index"] = this.selectedIndex;
                    options["text"] = this.text;
                    this.ref = self.selector[0];
                    store.load.call(this, options, self);
                }),
                "index": 0,
                "parent": null,
                "child": null
            };
        }
        else{
            this.selector[0] = {
                "context": new List().add(options["text"], options["value"]).bind("change", function(){
                    options["value"] = this.value;
                    options["index"] = this.selectedIndex;
                    options["text"] = this.text;
                    this.ref = self.selector[0];
                    store.load.call(this, options, self);
                }),
                "index": 0,
                "parent": null,
                "child": null
            };
            this.appendTo();
        }
        //render全部加载，chained逐个加载
        ChainedSelector.init.call(this, options, function(){

        });
    }
    ChainedSelector.render = function(data, that, fn){
        var selector = that.selector;
        if(data && data.length){
            //有数据就创建List
            var length = selector.length;
            if(!this.init){
                var list = new List().add().bind("change",function(){
                        this.ref = o;//指针
                        fn && fn.call(this, data);
                    }),
                    o = {"context": list, "parent": null, "child": null, "index": length};
                selector[length - 1]["child"] = list;//设置上一级的child
                o["parent"] = selector[length - 1]["context"];
                selector.push(o);
                that.appendTo(selector[0]["context"]["selector"].parentNode);
                this.init = !0;
            }
            //有数据则重置所有子节点
            var start = this.ref["index"] + 1,//本身和子节点
                lastLength = selector.length;
            if(start <= lastLength){
                for(var i = start; i < lastLength; i++){
                    var t = selector[i]["context"];
                    t.removeAll();
                    t.add();
                    t.selector.disabled = true;
                }
            }
            //this.ref["child"].removeAll();
            //this.ref["child"].add();
            //del prev data
            for(var j = 0, l = data.length; j < l; j++){
                this.ref["child"].add(data[j].value, data[j].id);
                this.ref["child"]["selector"].disabled = false;
            }
        }
        else{
            var lastSelector;
            for(var i = 0; i < selector.length; i++){
                if(selector[i]["context"].selector == this){
                    lastSelector = selector.slice(i + 1);
                }
            }
            for(var i = 0; i < lastSelector.length; i++){
                var t = lastSelector[i]["context"];
                t.removeAll();
                t.add();
                t.selector.disabled = true;
            }
        }
    };
    ChainedSelector.init = function(options, callback){
    	var selector = this.selector,
            data = options["store"],
            item,
            self = this;
        if(isType(data) === "array"){
            for(var j = 0, l = data.length; j < l; j++){
                selector[0]["context"].add(data[j].value, data[j].id);
                callback && callback(data);
            }
        }
        else if(isType(data) === "string"){
            //ajax init first the select,only once
            var url = options["store"].replace(/{value}/g, options.value || "-1").replace(/{index}/g, options.index || "0").replace(/{text}/, options.text || "--selected item--");
            ChainedSelector.ajax({
                "url": url,
                "type": "GET",
                "async": true,
                "data": {},
                "success": function(res){
                    for(var j = 0, length = res.length; j < length; j++){
                        selector[0]["context"].add(res[j].value, res[j].id);
                    }
                    callback && callback(res);
                }
            });
        }
    };
    ChainedSelector.ajax = function(options){
        this.parseData = this.parseData || (function(){
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
        xmlhttp.open(options["type"] || "GET", options["url"], options["async"] || true);//true 异步（默认）
        xmlhttp.setRequestHeader("If-Modified-Since", "0");
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                options["success"] && options["success"](ChainedSelector.parseData(xmlhttp.responseText), xmlhttp);
            }
        };
        xmlhttp.send(options["data"] || null);
    };
    ChainedSelector.prototype.appendTo = function(el){
        var length = this.selector.length;
        (el || document.body).appendChild(length <= 1 ? this.selector[0]["context"].selector : this.selector[length - 1]["context"].selector);
    };
    ChainedSelector.prototype.load = function(options){
        this.store = options["store"];
        return this;
    }
    /**
     * 联动模式，一对一、一对多
     * a chained b
     * a chained b[,c,d...]
     * @a parent chained child
     * @b child
     */
    ChainedSelector.prototype.chained = function(a, b){
        var store = this.store;
        if(store && store.length){
            new List(b).removeAll().add();
            var list = new List(a).add().bind("change", function(){
                var t = new List(b),
                    data = store[this.selectedIndex - 1];
                if(data && data["children"]){
                    data = data["children"];
                    t.add();
                    for(var i = 0, l = data.length; i < l; i++){
                        t.add(data[i].value, data[i].id);
                    }
                }
                else{
                    t.add();
                }
            });
            for(var i = 0, l = store.length; i < l; i++){
                list.add(store[i].value, store[i].id);
            }
        }
        return this;
    };
    ChainedSelector.prototype.selected = function(text, value, index){
        for(var i = 0, l = this.selector.length; i < l; i++){
            this.selector[i].options.add(new Option(text || "--selected item--", value || -1), this.selector[i].options[index | 0]);
        }
    };
    function Store(){

    }
    Store.prototype = {
        "load": function(data, that){
            var caller = arguments.callee,
                self = this,
                key,
                oldData;
            if(data["store"]){
                oldData = data;
                data = data["store"];
                key = "" + (this.value || 0);
            }
            if(isType(data) === "string"){
                var request = {
                    "cache": function(vd){
                        //console.log(vd);
                        ChainedSelector.render.call(self, vd, that, function(){
                            oldData["value"] = this.value;
                            oldData["index"] = this.selectedIndex;
                            oldData["text"] = this.text;
                            caller.call(this, oldData, that);
                        });
                    },
                    "ajax": function(){
                        ChainedSelector.ajax({
                            "url": oldData["store"].replace(/{value}/g, oldData.value || "-1").replace(/{index}/g, oldData.index || "0").replace(/{text}/, oldData.text || "--selected item--"),
                            "type": "GET",
                            "async": true,
                            "data": {},
                            "success": function(res){
                                oldData["nocache"] || (Store.cache[key] = res);
                                ChainedSelector.render.call(self, res, that, function(){
                                    oldData["value"] = this.value;
                                    oldData["index"] = this.selectedIndex;
                                    oldData["text"] = this.text;
                                    caller.call(this, oldData, that);
                                });
                            }
                        });
                    }
                };
                oldData["nocache"] ? request.ajax() : Store.memory(key, request);
            }
            else if(isType(data) === "array"){
                var nextChildren = data[this.selectedIndex - 1];
                    nextChildren = nextChildren && nextChildren["children"] || [];
                ChainedSelector.render.call(this, nextChildren, that, function(dt){
                    caller.call(this, dt, that);
                })
            }
        }
    };
    Store.memory = function(key, o){
        Store.cache || (Store.cache = {});
        if(Store.cache.hasOwnProperty(key)){
            o.cache(Store.cache[key]);
        }
        else{
            o.ajax(Store.cache[key]);
        }
    };
    function List(selector){
        this.selector = selector ? (function(selector){
            while(selector.length){
                selector.options.remove(0);
            }
            return selector;
        })(selector) : document.createElement("select");
        _fd.selectAll(this.selector).addClass(CHAINSELECTOR);
        this.items = [];
        this.length = 0;
    }
    List.prototype = {
        add: function(name, value){
            var item = new Option(name || "--selected item--", value || "-1");
            this.selector.options.add(item);
            this.items.push(item);
            this.length++;
            return this;
        },
        remove: function(item){
            for(var i = 0, len = this.items.length; i ^ len; i++){
                if(this.items[i] === item){
                    this.length--;
                    this.selector.options.remove(i);
                    return this.items.splice(i, 1);
                }
            }
            return null;
        },
        removeAll: function(){
            var temp = this.items;
            while(this.items.pop()){ this.selector.options.remove(0); };
            this.length = 0;
            return this;
        },
        get: function(item){
            if(isType(item) === "number"){
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
        },
        set: function(newItem, oldItem){
            for(var i = 0, len = this.items.length; i ^ len; i++){
                if(this.items[i] == oldItem){
                    var temp = oldItem;
                    this.items[i] = newItem;
                    return temp;
                }
            }
            return null;
        }
    };
    List.prototype.bind = function(type, callback){
        _fd.selectAll(this.selector).bind(type, function(){
            callback && callback.call(this);
        });
        return this;
    };
});