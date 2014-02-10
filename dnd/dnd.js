(function(callback){
    //if(typeof define === "function" && define.amd && define.amd.calculator){
        //define("calculator", [], function(){ return calculator; });
    //}
    var _fd = {};
    _fd.namespace = _fd.ns = function(){
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
    _fd.css = function(el, key){
        if(el.style[key]){  
            return el.style[key];  
        }  
        else if(el.currentStyle){  
            return el.currentStyle[key];//IE  
        }  
        else if(document.defaultView && document.defaultView.getComputedStyle){  
            key = key.replace(/([A-Z])/g, "-$1");  
            key = key.toLowerCase();  
            var s = document.defaultView.getComputedStyle(el, null);  
            if(s) return s.getPropertyValue(key); 
        }  
        else{  
            return null;  
        }
    };
    return function(f){
        callback.call(_fd, f);
    }
}).call(this, function(factory){
    if(typeof define === "function" && define.amd){
        define(["_fd"], function(fd){
            return fd;
        });
    }
    else
        factory(window, this);
})(function(window, _fd, undefined){
    _fd.namespace("fd.util.Draggable");
    fd.util.Draggable = Draggable;
    /**
     * object type check
     * returns string
     */
    var isType = function(o){
        return o == null ? String(o) : {
            "[object Object]": "object",
            "[object Array]": "array",
            "[object String]": "string",
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
                console.log(this)
                status["srcHeight"] = this.offsetTop - (parseInt(_fd.css(this, "marginTop") | 0, 10));
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
                        if(e.stopPropagation())
                            e.stopPropagation();
                        status["target"] = this;
                        status["srcX"] = e.clientX;
                        status["srcY"] = e.clientY;
                        status["srcWidth"] = n["element"].offsetLeft;
                        //console.log(this)
                        status["srcHeight"] = n["element"].offsetTop - (parseInt(_fd.css(n["element"], "marginTop"), 10));
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
    /**
     * Distance
     */
    _fd.namespace("fd.util.Distance");
    fd.util.Distance = Distance;
    function Distance(width, height, x, y){
        this.setDistance(width, height, x, y);
    }
    Distance.prototype.getDistance = function(){
        var a = this.width - this.x,
            b = this.height - this.y;
        return Math.sqrt(a * a + b * b);
    };
    Distance.prototype.setDistance = function(width, height, x, y){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        return this;
    };
    Distance.prototype.isCollision = function(x1, y1, w1, h1, x2, y2, w2, h2){
        return w1 > x2 && h1 > y2 && w2 > x1 && h2 > y1;
    };
});