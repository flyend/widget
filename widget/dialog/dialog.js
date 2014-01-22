(function(callback){
    var fd = (function(){
        var fd = {};
        fd.selectAll = function(selector, context){
            return new fd.fn.init(selector, context);
        };
        fd.select = function(selector){
            return new fd.fn.init(selector, context)[0] || null;
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
            xmlhttp.open(type || "GET", /GET/i.test(type) ? query : url.split(/[\?|&]/)[0], options["async"] || true);//true 异步（默认）
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
        fd.parseData = fd.parseData || (function(){
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
            },
            bind: function(type, fn, capture){
                //fd.isMobile && (type == "click" && !capture) && (type = "touchend");
                var self = this;
                for(var i = 0; i < this.length; i++){
                    document.addEventListener ? this[i].addEventListener(type, fn, !!capture) : document.attachEvent ? this[i].attachEvent("on" + type, (function(arg){
                        return function(){
                            return fn.call(self[arg] || window,  window.event);
                        }
                    })(i)) : this[i]["on" + type] = fn;
                }
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
            }
        }
        fd.fn.init.prototype = fd.prototype;
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
                            fd.extend(target[p], prop[p]);  
                        }
                        else if(prop[p]){
                            target[p] = prop[p];
                            //prop[p].prototype.constructor = prop[p];
                        }
                    }
                }
            }
            return target;
        };
        return fd;
    })();
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
                    this[i].setAttribute(p, name[p]);
                    this[i].style[p] = name[p]; 
                }
            }
            return this;
        }
    });
    return function(f){
        callback && callback.call(fd, f);
    }
}).call(this, function(factory){
    return factory(window, this)
})(function(window, _fd, undefined){
    _fd.namespace("fd.widget.Dialog");
    var DIALOG_NAME = "x-dialog",
        DIALOG_TITLE = DIALOG_NAME + "-title",
        DIALOG_CONTENT = DIALOG_NAME + "-content",
        DIALOG_FOOTER = DIALOG_NAME + "-footer",
        DIALOG_CLOSE = DIALOG_NAME + "-close",
        DIALOG_MINIMUM = DIALOG_NAME + "-minimum",
        DIALOG_MAXIMUM = DIALOG_NAME + "-maximum",
        DIALOG_SETTING = DIALOG_NAME + "-setting",
        DIALOG_RESIZE_L = DIALOG_NAME + "-resize-l",
        DIALOG_RESIZE_R = DIALOG_NAME + "-resize-r",
        DIALOG_RESIZE_T = DIALOG_NAME + "-resize-t",
        DIALOG_RESIZE_B = DIALOG_NAME + "-resize-b",
        DIALOG_RESIZE_LT = DIALOG_NAME + "-resize-lt",
        DIALOG_RESIZE_LB = DIALOG_NAME + "-resize-lb",
        DIALOG_RESIZE_RT = DIALOG_NAME + "-resize-rt",
        DIALOG_RESIZE_RB = DIALOG_NAME + "-resize-rb",
        DIALOG_MESSAGE = DIALOG_NAME + "-message",
        DIALOG_MESSAGE_WARNING = DIALOG_MESSAGE + "-warning",
        DIALOG_MESSAGE_INFORMATION = DIALOG_MESSAGE + "-information",
        DIALOG_MESSAGE_ERROR = DIALOG_MESSAGE + "-error",
        DIALOG_SIMPLE = DIALOG_NAME + "-simple",
        DIALOG_SMART = DIALOG_NAME + "-smart",
        DIALOG_NOTICE = DIALOG_NAME + "-notice",
        DIALOG_CLONE = DIALOG_NAME + "-clone-content",
        DIALOG_DRAGGING = DIALOG_NAME + "-dragging",
        DIALOG_HIDDEN = DIALOG_NAME + "-hide",
        DIALOG_FLASHING = DIALOG_NAME + "-flashing",
        DIALOG_MESSAGE_MASK = DIALOG_MESSAGE + "-mask";
    var isType = function(o){
        return o == null ? String(o) : {
            "[object String]": "string",
            "[object Object]": "object",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object NodeList]": "nodes"
        }[Object.prototype.toString.call(o)] || null;
    };
    /* node list to array*/
    var toArray = (function(){
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
    })();
    fd.widget.Dialog = Dialog;
    function Dialog(){
        this.dialog = document.createElement("div");
        this.dialog.className = DIALOG_NAME;
        //this.dialog.constructor = this;
        this.id = function(id){
            this.dialog.setAttribute("id",id);
            return this;
        };
        this.getContext = function(){
            return this.dialog;
        };
        this.toString = function(){
            return "[object Dialog]";   
        }
        this.draggable = undefined;
        this.resizable = undefined;
        this.title = undefined;
        return this;
    }
    Dialog.prototype.appendTo = function(el){
        (el || document.body).appendChild(this.dialog || this.getContext());
        this.parent = el || document.body;
        return this;
    };
    Dialog.prototype.add = function(content){
        var dialog = this.dialog;
        dialog.appendChild(content);
        return this;
    };
    Dialog.prototype.remove = function(content){
        var dialog = this.dialog;
        dialog.removeChild(content);
        return this;
    };
    Dialog.prototype.setWidth = function(width){
        var dialog = this.dialog;
        dialog.style.width = width;
        return this;
    };
    Dialog.prototype.getWidth = function(){
        var dialog = this.dialog;
        return dialog.offsetWidth;
    };
    Dialog.prototype.setHeight = function(height){
        var dialog = this.dialog;
        dialog.style.height = height;
        return this;
    };
    Dialog.prototype.getHeight = function(){
        var dialog = this.dialog;
        return dialog.offsetHeight;
    };
    Dialog.prototype.setSize = function(width,height){
        var dialog = this.dialog;
        dialog.style.width = width;
        dialog.style.height = height;
        return this;
    };
    Dialog.prototype.setLocation = function(x,y){
        var dialog = this.dialog;
        x && (dialog.style.left = x);
        y && (dialog.style.top = y);
    };
    Dialog.prototype.getLocation = function(){
        var dialog = this.dialog,
            offset = _fd.selectAll(dialog).offset();
        return{
            "x": offset.left,
            "y": offset.top 
        };
    };
    Dialog.prototype.setTitle = function(title){
        var dialog = this.dialog,
            oldTitle = this.options["title"];
        this.options["title"] = title;
        //_fd(dialog).find("." + DIALOG_).innerHTML = title;
    };
    Dialog.prototype.isResizable = function(){
        return this.resizable;  
    };
    Dialog.prototype.setResizable = function(enable){
        this.resizable = enable;
        if(enable){
            var dialog = this.dialog,
                me = this;
        }
    };
    Dialog.prototype.isDraggable = function(){
        return this.draggable;  
    };
    Dialog.animate = function(){
        var dialog = this.dialog,
            timer,
            y = this.y,
            curY = y - 50;
        //dialog.style.display = "none";
        timer = setInterval(function(){
            curY += 2;
            dialog.style.top = curY + "px";
            //dialog.style.display = "block";
            if(curY >= y){
                clearInterval(timer);
                timer = null;
            }
        },13);
    };
    /*
    * Draggable
    */
    _fd.namespace("fd.util.Draggable");
    fd.util.Draggable = Draggable;
    /**
     * @elements drag this node array
     * @options 
     */
    function Draggable(elements, options){
        this.nodes = [];
        this.handler = [];

        if(isType(elements) === "array"){
            var element;
            for(var i = 0, l = elements.length; i < l; i++){
                element = elements[i];
                if((element["target"] && element["target"].nodeType == 1) && (element["element"] && element["element"].nodeType == 1)){
                    this.nodes.push({"element": element["element"], "target": element["target"]});
                }
                else{
                    this.nodes.push({"element": element, "target": element});
                }
            }
            //this.nodes = this.nodes.concat(elements);
        }
        else if(isType(elements) === "object"){
            if(elements.length && elements.item){
                for(var i = 0, n = toArray(elements), l = n.length; i < l; i++){
                    this.nodes.push({"element": n[i], "target": n[i]});
                }
            }
            else
                this.nodes.push({"element": elements["element"], "target": elements["target"]});
        }
        else if(isType(elements) === "nodes"){           
            for(var i = 0, n = toArray(elements), l = n.length; i < l; i++){
                this.nodes.push({"element": n[i], "target": n[i]});
            }
        }
        //alert(Object.prototype.toString.call(elements))
        if(options){
            if(options["onStart"]){
                this.onStart(options["onStart"]);
                this.isStarting = options["onStart"];//disable on start
            }
        }
        Draggable.init.call(this, elements, options, function(){

        });
    }
    Draggable.init = function(elements, options, fn){
        if(this.isStarting)
            return this;
        var nodes = this.nodes,
            self = this,
            status = {
                "target": null,
                "srcX": 0,
                "srcY": 0,
                "newX": 0,
                "newY": 0
            };
        this.handler.push(function(callback){
            var bind = function(e){
                var e = e || window.event;
                status["target"] = this;
                status["srcX"] = e.clientX;
                status["srcY"] = e.clientY;
                status["srcWidth"] = this.offsetLeft;
                //console.log(this)
                status["srcHeight"] = this.offsetTop - 0;//(parseInt(_fd.selectAll(this).css("marginTop"), 10));
                this.status = status;
                //self.onDrag(this).onDrop(this);
                self.handler[1] && self.handler[1].call(this);
                self.handler[2] && self.handler[2].call(this);
                callback && callback.call(this);
            };
            var node;
            for(var i = 0, l = nodes.length; i < l; i++){
                node = nodes[i];
                (function(n){
                    n["target"].onmousedown = function(e){
                        var e = e || window.event;
                        if(e.stopPropagation)
                            e.stopPropagation();
                        status["target"] = this;
                        status["srcX"] = e.clientX;
                        status["srcY"] = e.clientY;
                        status["srcWidth"] = n["element"].offsetLeft;
                        status["srcHeight"] = n["element"].offsetTop - (parseInt(_fd.selectAll(n["element"]).css("marginTop") | 0, 10));
                        n["element"].status = status;
                        n["element"]["target"] = this;
                        //self.onDrag(this).onDrop(this);
                        self.handler[1] && self.handler[1].call(n["element"], this);
                        self.handler[2] && self.handler[2].call(n["element"], this);
                        callback && callback.call(n["element"], this);
                        return false;
                    };
                })(node);                
            }
            fn && fn();
        });
    };
    Draggable.prototype.onStart = function(callback){
        this.handler[0](callback);
        return this;
    };
    Draggable.prototype.onDrag = function(callback){
        this.handler.push(function(target){
            var el = this;
            document.onmousemove = function(e){
                if(el.setCapture){
                    el.setCapture();
                }
                document.body.onselectstart = function(){return true; };
                var e = e || window.event,
                    x = e.clientX - el.status["srcX"] + el.status["srcWidth"],
                    y = e.clientY - el.status["srcY"] + el.status["srcHeight"];
                el.style.left = x + "px";
                el.style.top = y + "px";
                callback && callback.call(el, e || window.event, target);
                return false;
            };
        });
        return this;
    };
    Draggable.prototype.onDrop = function(callback){
        this.handler.push(function(target){
            var el = this;
            document.onmouseup = function(e){
                if(e.stopPropagation())
                    e.stopPropagation();
                if(el.releaseCapture){
                    el.releaseCapture();
                }
                document.body.onselectstart = function(){return false; };
                document.onmousemove = null;
                document.onmouseup = null;
                callback && callback.call(el, e || window.event, target);
            };
        });
        return this;
    };
    Draggable.prototype.destory = function(){
        //this.handler = [];
        //this.nodes = [];
    };
    /*
    * Dialog UI
    */
    function DialogUI(what,options){
        this.header = (function(){
            var element = document.createElement("div");
            element.className = DIALOG_TITLE;
            var span = document.createElement("span");
            return {
                "element": element,
                "title": function(text,className){
                    var h3 = document.createElement("h3");
                    className && (h3.className = className);
                    h3.innerHTML = text;
                    return h3;
                },
                "addButton": function(title,className){
                    var link = document.createElement("a");
                    link.href = "javascript:void(0);";
                    link.className = className;
                    link.title = title;
                    span.appendChild(link);
                    return link;
                },
                "append": function(el){
                    element.appendChild(el);
                    element.appendChild(span);
                    return element; 
                }
            };
        })();
        this.body = (function(){
            var element = document.createElement("div");
            element.className = DIALOG_CONTENT;
            return{
                "element": element,
                "append": function(el){
                    element.appendChild(el);
                    return element;
                }
            };
        })();
        this.resize = function(el){
            return{
                "append": function(opt){
                    var elements = [];
                    for(var i in opt){
                        var element = document.createElement("div");
                        element.className = opt[i];
                        el.appendChild(element);
                        elements.push(element);
                    }
                    return elements;
                }
            };
        };
    }
    /*
    * SimpleDialog
    */
    _fd.namespace("fd.widget.SimpleDialog");
    fd.widget.SimpleDialog = SimpleDialog;
    function SimpleDialog(options){
        _fd.extend(SimpleDialog.prototype, new fd.widget.Dialog());
        _fd.selectAll(this.dialog).addClass(DIALOG_SIMPLE);
        this.toString = function(){
            return "[object SimpleDialog]";
        };
        this.draggable = options["draggable"];
        this.resizable = options["resizable"];
        this.width = options["width"];
        this.height = options["height"];
        this.x = options["location"] && options["location"]["x"] | 0;
        this.y = options["location"] && options["location"]["y"] | 0;
        this.init(options);
        this.appendTo();
    }
    //_fd.extend(SimpleDialog, fd.widget.Dialog);
    SimpleDialog.prototype.init = function(opt){
        var dialog = this.dialog,
            title = opt["title"],
            dlgUI = new DialogUI(this,opt),
            me = this;
        if(title){
            var closable = opt["closable"],
                minimum = opt["minimum"],
                maximum = opt["maximum"];
            this.header = dlgUI.header.append(dlgUI.header.title(title));
            function bind(elem,type,fn){
                _fd.selectAll(elem).bind(type,function(){
                    fn(me.header,this);
                });
            }
            function mom(target){
                if(!target.max){
                    me.setMaximum();
                    target.max = 1;
                }
                else{
                    me.setReduction();
                    target.max = 0; 
                }
            }
            if(opt["closable"]){
                bind(dlgUI.header.addButton(opt["closable"]["title"],DIALOG_CLOSE),"click",function(a,b){
                    _fd.selectAll(dialog).addClass(DIALOG_HIDDEN);
                    closable["listener"] && closable["listener"](dialog,b); 
                });
            }
            if(opt["maximum"]){
                bind(dlgUI.header.addButton(opt["maximum"]["title"],DIALOG_MAXIMUM),"click",function(a,b){
                    mom(a);
                    maximum["listener"] && maximum["listener"](dialog,b);   
                });
                if(this.resizable){
                    bind(this.header,"dblclick",function(a,b){
                        mom(a);
                    });
                }
            }
            if(opt["minimum"]){
                bind(dlgUI.header.addButton(opt["minimum"]["title"],DIALOG_MINIMUM),"click",function(a,b){
                    _fd.selectAll(dialog).addClass(DIALOG_HIDDEN);
                    minimum["listener"] && minimum["listener"](dialog,b);   
                });
            }
            dialog.appendChild(this.header);
        }
        if(opt["content"]){
            var content = opt["content"];
            if(isType(content) === "string"){
                var ifrm = document.createElement("iframe");
                ifrm.src = content;
                ifrm.setAttribute("frameborder","0");
                ifrm.allowtransparency = "true";
                ifrm.setAttribute("allowtransparency","true");
                //ifrm.scrolling = "yes"
                if(/msie\s*[7|6]/i.test(navigator.userAgent)){
                    ifrm.style.height = dialog.clientHeight - 25 + "px";
                }
                dlgUI.body.element.appendChild(ifrm);
                dialog.appendChild(dlgUI.body.element);
                this.body = dlgUI.body.element;
                if(opt["draggable"]){
                    var cloneElem = document.createElement("div");
                    cloneElem.className = DIALOG_CLONE;
                    dialog.appendChild(cloneElem);
                }
            }
            else if(isType(content) === "object" || content.nodeType === 1){
                this.body = dlgUI.body.element;
                dialog.appendChild(dlgUI.body.append(opt["content"]));
            }           
        }
        this.setDefault(opt);
        this.resizer = [this.header];
        if(this.resizable && title){
            this.resizer = this.resizer.concat(dlgUI.resize(dialog).append({"l": DIALOG_RESIZE_L, "r": DIALOG_RESIZE_R, "b": DIALOG_RESIZE_B, "t": DIALOG_RESIZE_T, "lt": DIALOG_RESIZE_LT, "lb": DIALOG_RESIZE_LB, "rt": DIALOG_RESIZE_RT, "rb": DIALOG_RESIZE_RB}));
            this.setResizable(this.resizable);
        }
        this.setDraggable(this.draggable);
    };
    SimpleDialog.prototype.setDefault = function(opt){
        var dialog = this.dialog;
        opt["width"] && (this.setWidth(opt["width"] + "px")) || (this.setWidth(100 + "px"));
        opt["height"] && (this.setHeight(opt["height"] + "px")) || (this.setHeight(100 + "px"));
        opt["location"] ? (this.setLocation((opt["location"]["x"] | 0) + "px", (opt["location"]["y"] | 0) + "px")) : this.setLocation("8px", "8px");
    };
    SimpleDialog.prototype.setMaximum = function(){
        this.setLocation("-2px", "-2px");
        this.setWidth("100%");
        this.setHeight("100%");
        this.draggable = false;
        //_fd(document.body).addClass("x-maximun");
    };
    SimpleDialog.prototype.setReduction = function(){
        this.setLocation(this.x + "px",this.y + "px");
        this.setWidth(this.width + "px");
        this.setHeight(this.height + "px");
        this.draggable = true;
        //_fd(document.body).removeClass("x-maximun");
    };
    SimpleDialog.prototype.setDraggable = function(enable){
        this.draggable = enable;
        var dialog = this.dialog,
            me = this;
        if(enable && this.header){
            var location = {},
                body = document.body,
                html = document.documentElement,
                dragger = this.resizer,
                rs = {};
            //dragger.unshift(this.header);
            rs[DIALOG_TITLE] = {
                "begin": function(target,e){
                    location.x = e.clientX;
                    location.width = dialog.offsetLeft;
                    location.y = e.clientY;
                    location.height = dialog.offsetTop;//left top
                },
                "moved": function(e){
                    var e = e || that.event,
                        left = e.clientX - location.x + location.width,
                        top = e.clientY - location.y + location.height,
                        maxLeft = html.clientWidth - dialog.offsetWidth - 10,
                        maxTop = html.clientHeight - dialog.offsetHeight - 10;
                    
                    var areaX = html.clientWidth - 10, areaY = e.pageY ? e.pageY : top;
                    if(areaY <= 5) top = 5;
                    if(e.pageX >= areaX)
                        return;
                    top >= maxTop && (top = maxTop);
                    left >= maxLeft && (left = maxLeft);
                    dialog.style.left = left + "px";
                    dialog.style.top = top + "px";
                    me.x = left;
                    me.y = top;
                }
            };
            rs[DIALOG_RESIZE_L] = {
                "begin": function(target,e){
                    location.x = dialog.offsetLeft;
                    location.width = dialog.offsetWidth;
                },
                "moved": function(e){
                    var e = e || event,
                        left = e.clientX,
                        x = location.x - left,
                        width = location.width + x;
                    dialog.style.width = width + "px";
                    dialog.style.left = left - 2 + "px";
                    me.x = left;
                    me.width = width;   
                }   
            };
            rs[DIALOG_RESIZE_R] = {
                "begin": function(target,e){
                    location.x = e.clientX;
                    location.width = target.offsetLeft;
                },
                "moved": function(e){
                    var e = e || event,
                        w = e.clientX - location.x + location.width,
                        maxWidth = html.clientWidth-dialog.offsetLeft;
                    w <= 200 && (w=200);
                    w >= maxWidth-10 && (w = maxWidth-10);
                    dialog.style.width = w + 2 +"px";
                    me.width = w;
                }   
            };
            rs[DIALOG_RESIZE_T] = {
                "begin": function(target,e){
                    location.y = e.clientY;
                    location.height = dialog.clientHeight;
                },
                "moved": function(e){
                    var e = e || event,
                        t = e.clientY,
                        y = location.y - t,
                        h = location.height + y;
                    if(/msie\s*[7|6]/i.test(navigator.userAgent)){
                        var temp = dialog.getElementsByTagName("iframe")[0];
                        temp.style.height = dialog.clientHeight - 25 + "px";
                    }
                    dialog.style.height = h + "px";
                    dialog.style.top = t + "px";
                    me.height = h;
                    me.y = t;
                }   
            };
            rs[DIALOG_RESIZE_B] = {
                "begin": function(target,e){
                    location.y = e.clientY;
                    location.height = dialog.clientHeight;
                },
                "moved": function(e){
                    var e = e || event,
                        h = e.clientY - location.y + location.height,
                        maxHeight = html.clientHeight - dialog.offsetTop;
                    h <= 200 && (h = 200);
                    h >= maxHeight-10 && (h = maxHeight - 10);
                    if(/msie\s*[7|6]/i.test(navigator.userAgent)){
                        var temp = dialog.getElementsByTagName("iframe")[0];
                        temp.style.height = dialog.clientHeight - 25 + "px";
                    }
                    dialog.style.height = h + "px";
                    me.height = h;
                }   
            };
            rs[DIALOG_RESIZE_LT] = {
                "begin": function(target,e){
                    location.x = e.clientX;
                    location.width = dialog.clientWidth;
                    location.y = e.clientY;
                    location.height = dialog.clientHeight;
                },
                "moved": function(e){
                    rs[DIALOG_RESIZE_L]["moved"](e);
                    rs[DIALOG_RESIZE_T]["moved"](e);
                }   
            };
            rs[DIALOG_RESIZE_RT] = {
                "begin": function(target,e){
                    location.x = e.clientX;
                    location.width = target.offsetLeft;
                    location.y = e.clientY;
                    location.height = dialog.clientHeight;
                },
                "moved": function(e){
                    rs[DIALOG_RESIZE_R]["moved"](e);
                    rs[DIALOG_RESIZE_T]["moved"](e);
                }
            };
            rs[DIALOG_RESIZE_LB] = {
                "begin": function(target,e){
                    location.x = e.clientX;
                    location.width = dialog.clientWidth;
                    location.y = e.clientY;
                    location.height = target.offsetTop;
                },
                "moved": function(e){
                    rs[DIALOG_RESIZE_L]["moved"](e);
                    rs[DIALOG_RESIZE_B]["moved"](e);
                }   
            };
            rs[DIALOG_RESIZE_RB] = {
                "begin": function(target,e){
                    location.x = e.clientX;
                    location.width = target.offsetLeft;
                    location.y = e.clientY;
                    location.height = target.offsetTop;
                },
                "moved": function(e){
                    rs[DIALOG_RESIZE_R]["moved"](e);
                    rs[DIALOG_RESIZE_B]["moved"](e);
                }   
            };
            function dnd(target,moved){
                if(this.draggable){
                    this.dialog.registerListener(moved,function(){
                        _fd.selectAll(body).addClass(DIALOG_DRAGGING);
                        body.onselectstart = function(){return true; };
                        if(target.setCapture){
                            target.setCapture();//ie移出document监听不到，如果不release会有内存泄露问题
                        }
                    });
                    this.dialog.removeListener(moved,function(){
                        if(target.releaseCapture){
                            target.releaseCapture();
                        }
                        _fd.selectAll(body).removeClass(DIALOG_DRAGGING);
                        body.onselectstart = function(){return false; };
                    });
                }
            }
            var handler = [];
            while(handler.length ^ dragger.length){
                handler.push({"target": dragger[handler.length], "element": this.dialog});
            }
            new fd.util.Draggable(handler).onStart(function(){
            }).onDrag(function(){

            }).onDrop(function(){

            });
            /*for(var i = 0; dragger.length ^ i; i++){
                (function(arg){
                    var temp = dialog;
                    dragger[arg].onmousedown = function(e){
                        e.preventDefault();
                        Draggable.call(temp,e);
                        var key = this.className.split(" ")[0],
                            call = rs[key];
                        //console.log(call["begin"])
                        if(call){
                            call["begin"](this,e);
                            dnd.call(me,this,call["moved"]);
                        }
                    };
                })(i);
            }*/
        }
    };
    SimpleDialog.prototype.setResizable = function(enable){
        this.resizable = enable;
        if(enable){
            var dialog = this.dialog,
                me = this;
        }
    };
    /*
    * MessageDialog
    */
    _fd.namespace("fd.widget.MessageDialog");
    fd.widget.MessageDialog = MessageDialog;
    var MESSAGE_DIALOG_NAME = DIALOG_NAME + "-message";
    function MessageDialog(options){
        fd.widget.Dialog.call(this);
        this.dialog.className = MESSAGE_DIALOG_NAME;
        this.toString = function(){
            return "[object MessageDialog]";
        };
        this.appendTo(document.body);//默认，可覆盖
        this.width = options["width"];
        this.height = options["height"];
        this.x = options["location"] && options["location"]["x"] | 0;
        this.y = options["location"] && options["location"]["y"] | 0;
        this.init(options);
        this.setDefault(options);
        //console.log(options)
    }
    _fd.extend(MessageDialog, fd.widget.Dialog);
    MessageDialog.prototype.setDefault = function(opt){
        var dialog = this.dialog;
        if(opt["width"]){
            this.setWidth(this.width + "px");
        }
        if(opt["height"]){
            this.setHeight(this.height + "px");
        }
        if(opt["location"]){
            this.setLocation((this.x | 0) + "px", (this.y) + "px");
        }
        else{
            var html = document.documentElement,
                body = document.body,
                w = html.clientWidth,
                h = html.clientHeight,
                c = function(a,b){return ((a - b) >> 1); },
                me = this;
            this.y = c(h,this.height);
            this.setLocation(c(w,this.width) + "px",(this.y) + "px");
            _fd.selectAll(window).bind("resize",function(){
                w = html.clientWidth;
                h = html.clientHeight;
                me.y = c(h,me.height);
                me.setLocation(c(w,me.width) + "px",me.y + "px");
            });
        }
        if(typeof opt["animate"] === "undefined" || opt["animate"] == true){
            Dialog.animate.call(this);
        }
    };
    MessageDialog.prototype.init = function(opt){
        var dialog = this.dialog,
            dlgUI = new DialogUI(this,opt),
            info = document.createElement("h2"),
            me = this;
        function closed(d,o){
            d.parentNode.removeChild(d);//被重载
            if(o){
                o.parentNode.removeChild(o);    
            }
        }
        this.body = dlgUI.body.element;
        this.footer = (function(){
            var df = document.createElement("div");
            df.className = DIALOG_FOOTER;
            return df;
        })();
        info.innerHTML = opt["message"];
        dlgUI.body.append(info);
        dlgUI.body.append(this.footer);
        
        switch(opt["mode"]){
            case "warning":
                _fd.selectAll(dialog).addClass(DIALOG_MESSAGE_WARNING);
                this.header = dlgUI.header.append(dlgUI.header.title("警告"));
                dialog.appendChild(this.header);
            break;
            case "error":
            
            break;
            case "information":
                _fd.selectAll(dialog).addClass(DIALOG_MESSAGE_INFORMATION);
                this.header = dlgUI.header.append(dlgUI.header.title("信息"));
                dialog.appendChild(this.header);
            break;
        }
        dialog.appendChild(this.body);
        
        this.setClosable(dlgUI.header.addButton("关闭",DIALOG_CLOSE),function(){
            closed(dialog,me.overlay);
        });
        this.addButton(MessageDialog.OK,function(){
            closed(dialog,me.overlay);
        });//.addButton(MessageDialog.CANCEL);
        if(typeof opt["overlay"] == "undefined" || opt["overlay"] == true){
            this.overlay = document.createElement("div");
            this.overlay.className = DIALOG_MESSAGE_MASK;
            this.overlay.style.width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) + "px";
            this.overlay.style.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) + "px";
            this.overlay.onclick = function(){
                var i = 0;
                var timer = setInterval(function(){
                    if(i % 2){
                        _fd.selectAll(dialog).addClass(DIALOG_FLASHING);    
                    }
                    else
                        _fd.selectAll(dialog).removeClass(DIALOG_FLASHING);
                    if(++i > 4)
                        clearInterval(timer);
                },100);
            };
            document.body.appendChild(this.overlay);
            this.dialog.style.zIndex = (+_fd.selectAll(this.overlay).css("zIndex") || 9999) + 1;
        }
    };
    MessageDialog.prototype.addButton = function(el,callback){
        var dialog = this.dialog,
            me = this;
        if(isType(el) === "string"){
            var button = document.createElement("button");
            button.appendChild(document.createTextNode(el));
            _fd.selectAll(button).bind("click",function(){
                callback && callback.call(this,dialog,me.overlay);
            });
            this.footer.appendChild(button);
        }
        else{
            _fd.selectAll(el).bind("click",function(){
                //dialog.parentNode.removeChild(dialog);
                callback && callback.call(this,dialog,me.overlay);
            });
            this.footer.appendChild(el);
        }
        return this;
    };
    MessageDialog.prototype.setClosable = function(el,callback){
        _fd.selectAll(el).bind("click",function(){
            callback && callback(this);
        });
    };
    MessageDialog.OK = (function(){
        var button = document.createElement("button");
        button.appendChild(document.createTextNode("确定"));
        return button;
    })();
    MessageDialog.CANCEL = (function(){
        var button = document.createElement("button");
        button.appendChild(document.createTextNode("取消"));
        return button;
    })();
    MessageDialog.YES = (function(){
        var button = document.createElement("button");
        button.appendChild(document.createTextNode("是"));
        return button;
    })();
    MessageDialog.NO = (function(){
        var button = document.createElement("button");
        button.appendChild(document.createTextNode("否"));
        return button;
    })();
    /*
    * MessageDialog
    */
    _fd.namespace("fd.widget.SmartDialog");
    fd.widget.SmartDialog = SmartDialog;
    function SmartDialog(options){
        
        _fd.extend(SmartDialog.prototype, new fd.widget.Dialog());
        this.dialog.className = DIALOG_SMART;
        this.toString = function(){
            return "[object SmartDialog]";
        };
        if(typeof(options["overlay"]) === "undefined" && options["overlay"] !== false || options["overlay"]){
            var overlay = document.createElement("div");
            overlay.className = DIALOG_MESSAGE_MASK;
            this.getOverlay = function(){
                return overlay;
            };
        }
        this.width = options["width"];
        this.height = options["height"];
        this.x = options["location"] && options["location"]["x"] || 0;
        this.y = options["location"] && options["location"]["y"] || 0;
        this.setWidth(this.width + "px");
        this.setHeight(this.height + "px");
        
        SmartDialog.init.call(this, options, function(){
            this.appendTo();//添加进DOM后才能设置
            if(options["location"]){
                this.setLocation(this.x + "px", this.y + "px");
            }
            else{
                this.atCenter();
            }
            if(typeof options["animate"] === "undefined" || options["animate"] == true){
                Dialog.animate.call(this);
            }
            if(options["draggable"]){
                new fd.util.Draggable([
                    {"target": this.header, "element": this.dialog}
                ]).onStart().onDrag(function(){

                }).onDrop();
            }
        });       
    }
    //_fd.extend(fd.widget.SmartDialog, fd.widget.Dialog);
    SmartDialog.init = function(options, callback){
        var dialog = this.dialog,
            dlgUI = new DialogUI(this, options),
            me = this,
            overlay;
        this.title = dlgUI.header.title(options["title"] || "系统提示");
        this.body = dlgUI.body.append(options["content"]);
        this.header = dlgUI.header.append(this.title);
        this.footer = (function(){
            var df = document.createElement("div");
            df.className = DIALOG_FOOTER;
            return df;
        })();
        dialog.appendChild(this.header);
        dialog.appendChild(this.body);        
        this.setClosable(dlgUI.header.addButton("关闭", DIALOG_CLOSE), function(){
            (options["closable"] === false || typeof(options["closable"]) !== "undefined") ? me.hide() : me.close();
        });
        if(this.getOverlay){
            overlay = this.getOverlay();
            overlay.style.width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) + "px";
            overlay.style.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) + "px";
            _fd.selectAll(overlay).bind("click", function(){
                var i = 0, timer;
                timer = setInterval(function(){
                    if(i % 2){
                        _fd.selectAll(dialog).addClass(DIALOG_FLASHING);    
                    }
                    else
                        _fd.selectAll(dialog).removeClass(DIALOG_FLASHING);
                    if(++i > 4)
                        clearInterval(timer);
                },100);
            });
            document.body.appendChild(overlay);
            dialog.style.zIndex = (+_fd.selectAll(overlay).css("zIndex") || 9999) + 1;
        }
        callback && callback.call(this);       
    };
    SmartDialog.prototype.setClosable = function(el,callback){
        var dialog = this.dialog;
        _fd.selectAll(el).bind("click",function(){
            callback && callback(this, dialog);
        });
    };
    SmartDialog.prototype.setTitle = function(title){
        this.title.innerText ? this.title.textContent ? this.title.textContent = title : this.title.innerText = title : this.title.innerHTML = title;
    };
    SmartDialog.prototype.getTitle = function(){
        return this.title;
    };
    SmartDialog.prototype.setWidth = function(width){
        var dialog = this.dialog;
        dialog.style.width = width;
        this.width = width;
    };
    SmartDialog.prototype.getWidth = function(){
        return this.width;
    };
    SmartDialog.prototype.setHeight = function(height){
        var dialog = this.dialog;
        dialog.style.height = height;
        this.height = height;
    };
    SmartDialog.prototype.getHeight = function(){
        return this.height; 
    };
    SmartDialog.prototype.show = function(){
        var dialog = this.dialog,
            overlay = this.getOverlay();
        if(overlay){
            overlay.style.display = "block";
        }
        _fd.selectAll(dialog).removeClass(DIALOG_HIDDEN);
        return !0;
    };
    SmartDialog.prototype.hide = function(){
        var dialog = this.dialog,
            overlay = this.getOverlay();
        if(overlay){
            overlay.style.display = "none";
        }
        _fd.selectAll(dialog).addClass(DIALOG_HIDDEN);
        return !1;  
    };
    SmartDialog.prototype.close = function(){
        var dialog = this.dialog,
            overlay = this.getOverlay();
        dialog.parentNode.removeChild(dialog);
        if(overlay && overlay.parentNode){
            overlay.parentNode.removeChild(overlay);
        }
        dialog = null;  
    };
    SmartDialog.prototype.atCenter = function(){
        var dialog = this.dialog,
            html = document.documentElement,
            body = document.body,
            w = html.clientWidth,
            h = html.clientHeight,
            c = function(a, b){return ((a - b) >> 1); },
            me = this;
        this.width = dialog.offsetWidth;
        this.height = dialog.offsetHeight;
        this.y = c(h, this.height);
        this.setLocation(c(w, this.width) + "px", this.y + "px");
        _fd.selectAll(window).bind("resize", function(){
            w = html.clientWidth;
            h = html.clientHeight;
            me.y = c(h, me.height);
            me.setLocation(c(w, me.width) + "px", me.y + "px");
        });
        return this;
    };
    SmartDialog.prototype.addButton = function(text,callback){
        var dialog = this.dialog,
            me = this,
            mb = function(title,fn){
                var button = document.createElement("button");
                button.appendChild(document.createTextNode(title));
                _fd.selectAll(button).bind("click",function(){
                    fn && fn.call(this, dialog, me);
                });
                return button;
            };
        if(!dialog.isFooter){
            this.body.appendChild(this.footer);
            dialog.isFooter = !undefined;   
        }
        if(isType(text) === "function"){
            this.footer.appendChild(mb("确定",text));
        }
        else if(isType(text) === "string"){
            this.footer.appendChild(mb(text,callback));
        }
        else if(isType(text) === "object"){
            var button = mb(text["text"] || "OK",callback);
            text["id"] && (button.id = text["id"]);
            text["className"] && (button.className = text["className"]);
            this.footer.appendChild(button);
        }
        return this;
    };
    /*
    * NoticeDialog
    */
    _fd.namespace("fd.widget.NoticeDialog");
    fd.widget.NoticeDialog = NoticeDialog;
    function NoticeDialog(opt){
        fd.widget.Dialog.call(this);
        this.dialog.className = DIALOG_NOTICE;
        this.toString = function(){
            return "[object NoticeDialog]";
        };
        this.appendTo(document.body);
        this.init(opt);
    }
    _fd.extend(fd.widget.NoticeDialog, fd.widget.Dialog);
    NoticeDialog.prototype.init = function(opt){
        var dialog = this.dialog,
            dlgUI = new DialogUI(this,opt),
            me = this;
        this.title = dlgUI.header.title(opt["title"] || "通知");
        this.body = dlgUI.body.append(opt["content"]);
        this.header = dlgUI.header.append(this.title);
        this.setClosable(dlgUI.header.addButton("关闭",DIALOG_CLOSE),function(){
            dialog.parentNode.removeChild(dialog);
        });
        dialog.appendChild(this.header);
        dialog.appendChild(this.body);
        if(!opt["location"]){
            this.y = -dialog.offsetHeight;
            dialog.style.right = "0px";
            dialog.style.bottom = this.y + "px";
        }
        else{
            var html = document.documentElement,
                width = html.clientWidth,
                c = function(a,b){return ((a - b) >> 1); };
            var f = {
                "RB": function(){
                    dialog.style.right = "0px";
                    dialog.style.bottom = "0px";
                },
                "LB": function(){
                    dialog.style.left = "0px";
                    dialog.style.bottom = "0px";
                },
                "CB": function(){
                    dialog.style.left = c(width,me.getWidth()) + "px";
                    dialog.style.bottom = "0px";
                },
                "RT": function(){
                    dialog.style.right = "0px";
                    dialog.style.top = "0px";
                },
                "LT": function(){
                    dialog.style.left = "0px";
                    dialog.style.top = "0px";
                },
                "LC": function(){
                    dialog.style.top = "0px";
                    dialog.style.left = c(width,me.getWidth()) + "px";
                },
            }
            f[opt["location"]]();
            _fd.selectAll(window).bind("resize",function(){
                width = html.clientWidth, height = html.clientHeight;
                f[opt["location"]]();
            });
        }
        if(typeof opt["animate"] === "undefined" || opt["animate"] == true){
            /*var timer = setInterval(function(){
                me.y += 5;
                dialog.style.bottom = me.y + "px";
                if(me.y >= 0){
                    dialog.style.bottom = "0px";
                    me.y = 0;
                    clearInterval(timer);   
                }
            },13);*/
        }
    };
    NoticeDialog.prototype.setClosable = function(el,callback){
        var dialog = this.dialog;
        _fd.selectAll(el).bind("click",function(){
            callback && callback(this,dialog);
        });
    };
    NoticeDialog.prototype.setLocation = function(){
            
    };
});