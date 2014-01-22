(function(fn){
    var fd = (function(){
        var fd = {};
        fd.select = fd.selectAll = function(selector, context){
            return new fd.fn.init(selector, context);   
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
                if(!selector)
                    return this;
                if(selector.nodeType){
                    this[0] = selector;
                    this.length = 1;
                    return this;    
                }
                if(selector == "body" && !context && document.body){
                    this[0] = document.body;
                    this.length = 1;
                    this.context = document;
                    return this;    
                }
                var match,
                    elem;
                if(typeof selector === "string"){
                    match = /^(?:\*?(\.|#)([a-z_\u00C0-\uFFEE\-][\w\u00C0-\uFFEE\-]*)|(\w+)(?:\s*,\s*(\w+)(?:\s*,\s*(\w+))?)?|(\w+)\s+(\w+)(?:\s+(\w+))?)$/i.exec(selector);
                    //id or class
                    if(match[1]){
                        if(match[1] === "."){
                            if(document.getElementsByClassName){
                                selector = (context || document).getElementsByClassName(match[2]);
                                return this.merge(this, selector);
                            }
                            else{
                                var elems = (context || document).getElementsByTagName("*"),
                                    name = match[2].replace(/^\s+|\s+$/g, "").split(/\s+/),
                                    len = name.length,
                                    i = 0,
                                    j = -1,
                                    unquery = {},
                                    newName = [],
                                    nodes = [],
                                    regx,
                                    m;
                                if(len > 1){
                                    while(elem = elems[i++]){
                                        if(elem in unquery){
                                            unquery[elem] = 1;
                                            newName[++j] = elem;
                                        }
                                    }
                                    name = newName;
                                    len = j + 1;
                                }
                                regx = RegExp("(?:^| )(" + name.join("|") + ")(?:$|(?= ))", "g");
                                i = 0;
                                j = -1;
                                while(elem = elems[i++]){
                                    if(elem.className){
                                        m = elem.className.match(regx);
                                        if(m && m.length >= len){
                                            nodes[++j] = elem;
                                        }
                                    }
                                }
                                //alert(nodes)
                                return this.merge(this, nodes);
                            }
                        }
                        //id
                        elem = ((context || document).ownerDocument || document).getElementById(match[2]);
                        if(elem){
                            this[0] = elem;
                            this.length = 1;    
                        }
                        return this;
                    }
                    //tag E,F
                    if(match[3]){
                        var m1 = match[3],
                            m2 = match[4],
                            m3 = match[5],
                            unquery = {},//查询过的
                            arrays = [],
                            nodes1,
                            nodes2,
                            nodes3;
                        unquery[m1] = 1;
                        nodes1 = this.toArray((context || document).getElementsByTagName(m1));
                        if(m2 && !(m2 in unquery)){
                            unquery[m2] = 1;
                            nodes2 = this.toArray((context || document).getElementsByTagName(m2));
                        }
                        if(m3 && !(m3 in unquery)){
                            unquery[m3] = 1;
                            nodes3 = this.toArray((context || document).getElementsByTagName(m3));
                        }
                        return this.merge(this, [].concat(nodes1 || [], nodes2 || [], nodes3 || []));
                    }
                    //tag E F
                    var m1 = match[6],
                        m2 = match[7],
                        m3 = match[8],
                        array = [],
                        unquery = {},
                        nodes1 = (context || document).getElementsByTagName(m1),
                        nodes2,
                        nodes3,
                        x = -1;
                    for(var i = 0, len = nodes1.length; i < len; i++){
                        nodes2 = nodes1[i].getElementsByTagName(m2);
                        for(var j = 0; j < nodes2.length; j++){
                            if(m3){
                                nodes3 = nodes2[j].getElementsByTagName(m3);
                                for(var k = 0; k < nodes3.length; k++){
                                    elem = nodes3[k];
                                    var uid = Math.random();//i + j + k;
                                    if(!(uid in unquery)){
                                        unquery[uid] = 1;
                                        array[++x] = elem;  
                                    }
                                }
                            }
                            else{
                                elem = nodes2[j];
                                var uid = Math.random();
                                if(!(uid in unquery)){
                                    unquery[uid] = 1;
                                    array[++x] = elem;
                                }   
                            }   
                        }
                    }
                    alert(array);
                    return this.merge(this, array);
                }
                return this;
            },
            length: 0,
            each: function(fn,scope){
                var i = 0, len = this.length;
                for(; i ^ len; i++)
                    if(fn.call(scope || this[i], this[i], i, this) === false) return i;
                return this;
            },
            merge: function(first, second){
                var len = 0,
                    i = 0;
                while(second[i]){
                    first[len++] = second[i++]; 
                }
                first.length = len;
                return first;
            },
            toArray: (function(){
                return function(nodes, begin, end){
                    try{
                        return Array.prototype.slice.call(nodes, begin || 0, end || nodes.length);
                    }
                    catch(e){
                        var ret = [];
                        for(var i = 0, l = nodes.length; i < l; i++){
                            ret.push(nodes[i]);
                        }
                        return ret.slice(begin || 0, end || nodes.length);
                    }
                }
            })(),
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
        return (this["fd"] = fd);
    })();
    fd.fn.extend({
        isReady: false,
        readyList: [],
        ready: function(fn){
            var loaded = false,
                readyFunc = function(){
                    if(loaded) return;
                    loaded = true;
                    fn();
                };
            var call = function(){
                if(document.addEventListener){
                    document.addEventListener("DOMContentLoaded", readyFunc);   
                }
                else if(document.attachEvent){
                    document.attachEvent("onreadystatechange",function(){
                        if(document.readyState == "complete") readyFunc();
                    });
                    if(document.documentElement.doScroll && typeof window.frameElement==="undefined"){
                        var ieReadyFunc = function(){
                            if(loaded) return;
                            try{
                                document.documentElement.doScroll("left");
                            }
                            catch(ex){
                                window.setTimeout(ieReadyFunc,0);
                                return;
                            }
                            readyFunc();
                        };
                        ieReadyFunc();
                    }
                }
                else
                    window.onload = readyFunc;
            }
            if(!this.isReady){
                this.isReady = true;
                if(this.readyList){
                    for(var i = 0; i < this.readyList.length; i++){
                        this.readyList[i].apply(document);  
                    }
                    this.readyList = null;
                }   
            }
            if(this.isReady){
                call.apply(document);
            }
            else{
                this.readyList.push(call);
            }
            return this;
        }
    });
    fd.fn.extend({
        bind: function(type, fn, capture){
            var self = this;
            for(var i = 0; i < this.length; i++){
                document.addEventListener ? this[i].addEventListener(type, fn, !!capture) : document.attachEvent ? this[i].attachEvent("on" + type, (function(arg){
                    return function(){
                        return fn.call(self[arg] || window,  window.event);
                    }
                })(i)) : this[i]["on" + type] = fn;
            }
            return this;
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
            return this;
        }
    });
    fd.fn.extend({
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
                    //this[i].setAttribute(p, name[p]);
                    if(p == "opacity"){
                        this[i].style["opacity"] = name[p];
                        this[i].style["filter"] = "alpha(opacity=" + (name[p] * 100) + ")";
                    }
                    else
                        this[i].style[p] = name[p];

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
            
            for(; j < len; j++){
                element = this[j];
                if(element.nodeType === 1){
                    for(; i < cls.length; i++){
                        //console.log(element)
                        if(!this.hasClass(cls[i])){
                            element.className += (element.className.length ? " " : "") + cls[i];
                        }
                    }
                }
            }
            return this;
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
            return this;
        }
    });
    fd.fn.extend({
        timeout: null,
        interval: null,
        queue: [],
        animate: function(prop, ms, easing, callback){
            var fx = this;
            /*if(typeof d === "object"){
                delay = d.delay;
                easing = d.easing;
                d = d.duration; 
            }*/
            this.timeout = setTimeout(function(){
                ms = ms || 1000;
                easing = easing || "<>";
                var interval = 1000 / 60,
                    start = new Date().getTime(),
                    finish = start + ms,
                    duration = ms,
                    cur = 0,//fx.getStyle("left"),
                    keys = [];//要动画的属性
                
                fx.interval = setInterval(function(){
                    var time = new Date().getTime(),
                        pos = time > finish ? 1 : (time - start) / ms,
                        n = time - start,
                        state = n / duration,
                        unit = "px",
                        from = 0,
                        to = 0,
                        i;
                    //console.log(skeys)
                    pos = easing == "<>" ? (-Math.cos(pos * Math.PI) / 2) + 0.5 :
                        easing == ">" ? Math.sin(pos * Math.PI / 2) :
                        easing == "<" ? -Math.cos(pos * Math.PI / 2) + 1 :
                        easing == "-" ? pos :
                        typeof easing == "function" ? easing(state, n, 0, 1, duration) : pos;
                        //a.easing[easing](state, n, 0, 1, duration);
                    //动画设置变量
                    for(var i = 0; i ^ fx.length; i++){
                        for(var p in prop){
                            cur = fd.selectAll(fx[i]).css(p);
                            cur = cur == "auto" ? 0 : parseFloat(cur);
                            //console.log(cur)
                            from = parseFloat(cur, 10);
                            to = prop[p];
                            switch(p){
                                case "opacity":
                                    unit = "";
                                    from /= 100;
                                    to /= 100;
                                break;
                            }
                            //console.log(from > to)
                            /*if(~from > ~to){
                                var temp = from;
                                from = to;
                                to = temp;
                            }*/
                            fx.css(p, fx._at({
                                "from": to,
                                "to": from
                            }, pos) + unit);
                        }
                    }
                    if(fx._during){
                        for(var i = 0; i < fx.length; i++){
                            fx._during.call(fx[i], pos, function(from, to){
                                return fx._at({"from" : from, "to": to}, pos);  
                            });
                        }
                    }
                    if(time > finish){
                        clearInterval(fx.interval);
                        for(var i = 0; i < fx.length; i++){
                            fx._after ? fx._after.apply(fx[i], [fx]) : fx.stop();
                            fx.css(p, to + unit);
                            callback && callback.call(fx[i]);
                        }
                    }
                }, ms > interval ? interval : ms);
                fx.queue.push({"interval": fx.interval, "0": fx[0], "timeout": fx.timeout});
            }, 13);
            
            return this;
        },
        during: function(during){
            this._during = during;
            return this;    
        },
        after: function(after){
            this_after = after;
            return this;    
        },
        stop: function(){
            //clearTimeout(this.timeout);
            //console.log(this.queue);
            if(this.queue.length > 0){
                var prev = this.queue.shift();
                clearInterval(prev["interval"]);
                clearTimeout(prev["timeout"]);
                for(var i = 0 ; i < this.length; i++){
                    prev[i].removeAttribute("style");
                }
            }
            //clearInterval(this.interval);
            //this.styles = {};
            delete this._after;
            delete this._during;
            return this;
        },
        _at: function(o, pos){
            if(typeof o.from == "number"){
                return o.from + (o.to - o.from) * pos;
            }
            else{
                return this._unit(o, pos);
                //return /^([\d\.]+)([a-z%]{0,2})$/.test(o.to) ? this._unit(o, pos) : o.to && (o.to.r || colorTest(o.to)) ? this._color(o, pos) : pos < 1 ? o.from : o.to;
            }
        },
        _unit: function(o, pos){
            var r = /^([\d\.]+)([a-z%]{0,2})$/,
                match = r.exec(o.from.toString()),
                from = parseFloat(match ? match[1] : 0);
            match = /^([\d\.]+)([a-z%]{0,2})$/.exec(o.to);
            return (from + (parseFloat(match[1]) - from) * pos) + match[2];
        }
    });
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
    fd.loadJs = function(url, success, failure){
        var head = fd.selectAll("head")[0],
            script = document.createElement("script"),
            s = !1;
        script.src = url;
        script.onload = script.onreadystatechange = function(){
            if(!s && !this.readyState || this.readyState  == "loaded" || this.readyState  == "complete"){
                s = !0;
                script.onload = script.onreadystatechange = null;
                success && success(this);
                script.parentNode.removeChild(script);
            }
        };
        script.onerror = function(){
            failure && failure();
        };
        head.appendChild(script);
    };
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
        fn && fn.call(window["fd"], f);
    }
}).call(this, function(factory){
    return factory(window, this);
})(function(window, fd, undefined){

});