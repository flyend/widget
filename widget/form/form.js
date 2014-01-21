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
    (typeof module != "undefined" && module.exports)
        ? module.exports = fd
        : (typeof define != "undefined" ? define("fd", [], function(){ return fd; }) : this["fd"] = fd);
    return function(f){
        callback(f);
    }
}).call(this, function(factory){
    if(typeof define == "function" && define.amd){
        define(["fd"], function(fd){
            return factory(this, fd);
        });
    }
    else{
        factory(this, this["fd"]);
    }
})(function(window, fd, undefined){
    
    fd.namespace("fd.widget.SmartForm");
    fd.widget.SmartForm = SmartForm;
    function SmartForm(options){
        this.form = options["form"];
        this.rules = [];
        /*SmartForm.init.call(this, options, function(){

        }, function(){

        });*/
    }
    /**
     * fx组合计算（验证所有）
     * @name DOM element
     * @options listener and validate or other
     */
    SmartForm.prototype.fx = function(name, options){
        var form = this.form,
            element = name,
            validate,//validate collection
            listener;//event listener
        if(Object.prototype.toString.call(options) === "[object Function]"){

        }
        else if(Object.prototype.toString.call(options) === "[object Object]"){
            //验证
            if(options["validate"]){
                this.validate(element, options["validate"]);
            }
            //事件
            if(options["listener"]){
                this.listener(element, options["listener"]);
            }
        }
        return this;
    };
    function Promise(args){
        this.promises = [];
        this.index = 0;
        this.fired = 0;
    }
    Promise.prototype = {
        "then": function(resolved, rejected){
            var promises = this.promises;
            //promises.push(resolved);
            promises[this.index] = resolved;
            if(!this.fired){
                this.fired = 1;
                console.log(promises[0])
                if(promises[0]() === true){
                    console.log(promises)
                    this.fired = 0;
                    return this;
                }
            }
            this.index++;
            return this;
        }
    }
    Promise.when = function(){
        return new Promise(arguments);
    }
    /*function Rule(fn, context){
        var promise = new Promise(),
            defer = promise.defer(promise);
        defer.next = promise;
        fn(defer, context);
        return promise;
    }*/
    /**
     * 逐一验证
     * Promise.when().then(function(){
     *      alert(1);
     *      return 1;//1向下执行，0中断
     *  }).then(function(){
     *      alert(2);
     *      return 0;
     *  }).then(function(){
     *      alert(3);
     *      return 0;
     *  });
     */
    SmartForm.prototype.validate = function(element, options, callback){
        /*return Rule(function(defer, context){
            context.element = element;
            //context.success = 0;
        }, this);*/
        //console.log(options["required"])
        var self = this;
        if(options){
            if(Object.prototype.toString.call(options) === "[object Function]"){
                var define = options.call(element || window);//returns boolean
                this.rules.push(function(){
                    return callback ? callback.call(element || window, define) : function(){ return define; };
                });
            }
            else if(Object.prototype.toString.call(options) === "[object Object]"){
                for(var p in options){
                    if(options.hasOwnProperty(p)){
                        //上下文中的验证规则已经验证通过则不再添加规则器中
                        var pass = SmartForm.validate[p](element ? element.value : "");//验证通过的元素
                        (function(arg){
                            self.rules.push(function(){
                                return options[arg].call(element || window, pass);
                            });
                        })(p);
                    }
                }
            }
            else{
                this.rules.push(function(){ return true});
            }
            //console.log(this.rules[0])
        }
        if(!this.fired){
            this.fired = true;
            if(this.rules.shift()() === true){
                this.fired = false;
                //this.rules.shift();
                //console.log("ok");
                //this.rules = [];//
                return this;
            }
        }
        return this;
    };
    SmartForm.prototype.listener = function(name, options){
        if(options){
            var element = fd.selectAll(name), self = this;
            for(var p in options){
                if(options.hasOwnProperty(p)){
                    element.bind(p.substr(2).toLowerCase(), (function(fn){
                        return function(){
                            self.destory();
                            fn.call(this);
                        }
                    })(options[p]), !1);
                }
            }
        }
        return this;
    };
    SmartForm.prototype.submit = function(element, callback, rejected){
        var self = this;
        fd.selectAll(element).bind("click", function(){
            self.destory();
            callback();
        });
        fd.selectAll(this.form).bind("submit", function(e){
            //当最后一个规则通过时
            //console.log(this.fired)
            if(!rejected){
                if(e.preventDefault)
                    e.preventDefault();
                else{
                    window.event.returnValue = true;
                }
            }
            return false;
        });
        return this;
    };
    SmartForm.prototype.xtype = function(){

    };
    SmartForm.prototype.destory = function(){
        this.rules = [];
        this.fired = false;
    };
    SmartForm.validate = {
        "required": function(value){
            return !!(value.length ^ 0);
        },
        "maxlength": function(value){
            return parseInt(value.length, 10);
        },
        "minlength": function(value){
            return parseInt(value.length, 10);
        },
        "strength": function(value){
            var count = 0;
            (/[A-Z]/.exec(value) || /[a-z]/.exec(value)) && count++;
            /\d/.exec(value) && count++;
            (/[^a-zA-Z0-9\s]/.exec(value)) && count++;//特殊字符
            return count >= 3;
        }
    };
});