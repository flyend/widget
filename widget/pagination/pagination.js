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
        fd.fn = fd.prototype = {
            init: function(selector, context){
                //if(!selector) return this;
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
        return fd;
    })();
    return function(f){
        callback.call(fd, f);
    }
}).call(this, function(factory){
    factory(window, this);
})(function(window, _fd, undefined){
    _fd.namespace("fd.widget.Pagination");
    fd.widget.Pagination = Pagination;

    var PAGINATION = "x-pagination",
        PAGINATION_FIRST = PAGINATION + "-first",
        PAGINATION_LAST = PAGINATION + "-last",
        PAGINATION_PREV = PAGINATION + "-prev",
        PAGINATION_NEXT = PAGINATION + "-next",
        PAGINATION_CURRENT = PAGINATION + "-current",
        PAGINATION_DISABLE = PAGINATION + "-disable";

    //object type
    var isType = function(o){
        return o == null ? String(o) : {
            "[object String]": "string",
            "[object Object]": "object",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Number]": "number"
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

    function Pagination(options){
        if(!options["length"])
            throw Error("length undefined");
        var pageList = [];
        this.getPageList = function(){
            return pageList;
        };
        this.length = options["length"];
        this.links = [];
        Pagination.init.call(this, options, function(){

        });
    }
    Pagination.init = function(options, callback){
        Pagination.nav.call(this).addFirst("first").addLast("last").addNext("next").addPrev("prev");
        callback && callback.call(this);
    };
    Pagination.link = function(text, className, tpl){
        var link = document.createElement("a");
        link.className = className;
        link.href = "javascript:void(0);";
        link.appendChild(document.createTextNode(text));
        if(tpl){
            link.innerHTML = tpl;
        }
        return link;
    };
    Pagination.prototype.appendTo = function(el){
        (el || document.body).appendChild(this.links[this.links.length - 1]);
        return this;
    };
    Pagination.prototype.getLength = function(){
        return this.length;
    };
    Pagination.prototype.setLength = function(length){
        this.length = length;
    };
    Pagination.prototype.getRange = function(){
        return this.range;
    };
    Pagination.prototype.setRange = function(range){
        var from = range[0],
            to = range[1],
            length = this.getLength();
        if(to > length)
            to = length;
        range[1] = to;
        this.range = range;
        return this;
    };
    Pagination.prototype.getCurrent = function(){
        return this.current;
    };
    Pagination.prototype.setCurrent = function(options){
        this.current = options;
    };
    Pagination.prototype.getPage = function(){
        return this.page;
    };
    Pagination.prototype.setPage = function(page){
        this.page = page;
    }
    Pagination.prototype.bind = function(el, callback){
        _fd.selectAll(el).bind("click", function(e){
            if(e.stopPropagation)
                e.stopPropagation();
            callback && callback.call(this);
            return false;
        });
    };
    Pagination.nav = function(){
        var me = this;
        return{
            "addFirst": function(text){
                me.first = Pagination.link(text, PAGINATION_FIRST);
                _fd.selectAll(me.first).addClass(PAGINATION_DISABLE);
                return this;
            },
            "addLast": function(text){
                me.last = Pagination.link(text, PAGINATION_LAST);
                return this;
            },
            "addNext": function(text){
                me.next = Pagination.link(text, PAGINATION_NEXT);
                return this;
            },
            "addPrev": function(text){
                me.prev = Pagination.link(text, PAGINATION_PREV);
                _fd.selectAll(me.prev).addClass(PAGINATION_DISABLE);
                return this;
            }
        };
    };
    Pagination.prototype.onFirst = function(el, callback){
        var el,
            fn = callback;
        if(!callback && isType(el) === "function"){
            fn = el;
            el = this.first;
            this.links.push(el);
            this.appendTo();
        }
        else if(el.nodeType === 1 && callback){
            el = el;
            this.links.push(el);
        }
        this.bind(el, function(){
            fn && fn.call(this);
        });
        this.first = el;    
        return this;
    };
    Pagination.prototype.onLast = function(el, callback){
        var el,
            fn = callback;
        if(!callback && isType(el) === "function"){
            fn = el;
            el = this.last;
            this.links.push(el);
            this.appendTo();
        }
        else if(el.nodeType === 1 && callback){
            el = el;
            this.links.push(el);
        }
        this.bind(el, function(){
            fn && fn.call(this);
        });
        this.last = el;       
        return this;
    };
    Pagination.prototype.onPrev = function(el, callback){
        var el,
            fn = callback,
            me = this;
        if(!callback && isType(el) === "function"){
            fn = el;
            el = this.prev;//Pagination.link("prev", PAGINATION_PREV);
            this.links.push(el);
            this.appendTo();
        }
        else if(el && el.nodeType === 1 && callback){
            el = el;
            this.links.push(el);
        }
        if(!el){
            el = this.prev;//Pagination.link("prev", PAGINATION_PREV);
            this.links.push(el);
            this.appendTo();
        }
        this.bind(el, function(){
            var current = me.getCurrent(),
                index = current["index"];
            index--;
            Pagination.cal.call(me, index);
            fn && fn.call(this);
        });
        this.prev = el;    
        return this;
    };
    Pagination.prototype.onNext = function(el, callback){
        var el,
            fn = callback,
            me = this,
            page = this.getPage();
        if(!callback && isType(el) === "function"){
            fn = el;
            el = this.next;
            this.links.push(el);
            this.appendTo();
        }
        else if(el && el.nodeType === 1 && callback){
            el = el;            
            this.links.push(el);
        }
        if(!el){
            el = this.next;
            this.links.push(el);
            this.appendTo();
        }
        var index = 0;
        this.bind(el, function(){
            //var current = me.getCurrent(),
              //  index = parseInt(current["index"], 10);
            //Pagination.cal.call(me, ++index);
            page.to(++index);
            fn && fn.call(this);
            return false;
        });
        this.next = el;     
        return this;
    };
    Pagination.prototype.fromTo = function(el, range, callback){
        var pageList = this.getPageList(),
            length = this.getLength(),
            fn = callback || isType(range) === "function" ? range : function(){},
            range = !el || range,
            me = this,
            page = 1,
            elements;
        var p = new Page(36);
        if(isType(el) === "array" && isType(el[0]) === "number"){
            //console.log(range)
            range = el;
            this.setRange(range);
            for(var i = range[0]; i <= range[1]; i++){
                elements = Pagination.link(i, PAGINATION + "-" + i);
                elements["text"] = i;
                this.links.push(elements);
                pageList.push(elements);
                this.bind(elements, function(){
                    //Pagination.cal.call(me, +this["text"]);
                    //Page.getInstance.call(me).go(+this["text"], 36);
                    p.to(+this["text"]);
                    fn && fn.call(this);
                });
                this.appendTo();
            }
        }
        else{
            elements = toArray(el);//.slice(range[0], range[1] + 1);
            this.setRange(range);
            for(var i = 0; i < elements.length; i++){
                this.links.push(elements[i]);
                elements[i]["text"] = i;
                this.bind(elements[i], function(){
                    Page.getInstance(+this["text"], 36);
                    fn && fn.call(this);
                });
                pageList.push(elements[i]);
            }        
        }
        page = range[0];
        
        _fd.selectAll(pageList[0]).addClass(PAGINATION_CURRENT);
        if(page <= 1){
            page = 1;
            this.first && _fd.selectAll(this.first).addClass(PAGINATION_DISABLE);
            this.prev && _fd.selectAll(this.prev).addClass(PAGINATION_DISABLE);
        }
        else{
            this.first && _fd.selectAll(this.first).removeClass(PAGINATION_DISABLE);
            this.prev && _fd.selectAll(this.prev).removeClass(PAGINATION_DISABLE);
        }
        /*if(range[1] >= length){
            this.last && _fd.selectAll(this.last).addClass(PAGINATION_DISABLE);
            this.next && _fd.selectAll(this.next).addClass(PAGINATION_DISABLE);
        }
        else{
            this.last && _fd.selectAll(this.last).removeClass(PAGINATION_DISABLE);
            this.next && _fd.selectAll(this.next).removeClass(PAGINATION_DISABLE);   
        }*/
        //this.setPage(page);
        this.setPage(new Page(36, true).links(pageList));
        this.setCurrent({
            "page": "" + page,
            "link": pageList[0],
            "index": 1
        });
        return this;
    };
    /*
     * new Page(36, true).to(2);
     */
    function Page(length, alwaysBoth){
        this.getLength = function(){
            return length;
        };
        this.getFactory = function(){
            //return factory;
        };
    }
    Page.prototype.links = function(links){
        var links = links;
        this.getLinks = function(){
            return links;
        };
        return this;
    };
    Page.prototype.to = function(index){
        var length = this.getLength(),
            links = this.getLinks(),
            link = [];
        //console.log(links)
        var start, end, j = 0;
        function setCurrent(){
            if(index == i){
                //_fd.selectAll(links[i]).addClass(PAGINATION_CURRENT);
                link[link.length] = "<a href=\"#\" class=\"on\">" + i + "</a>";
            }
            else{
                link[link.length] = "<a href=\"#\">" + i + "</a>";
                //_fd.selectAll(links[i]).removeClass(PAGINATION_CURRENT);
            }
            links[i].innerHTML = links[i].innerHTML.replace(/\d+/g, i + 1);
        }
        if(index == 1){
            //link[link.length] = "<a href=\"#\" class=\"prev unclick\">prev</a>";
        }
        else{
            //link[link.length] = "<a href=\"#\" class=\"prev\">prev</a>";
        }
        if(length <= 10){
            for(var i = 0; i <= length; i++){
                setCurrent();
            }
        }
        else{
            if(index <= 4){
                start = 1;
                end = 5;
                for(var i = 1; i <= 5; i++){
                    setCurrent();
                }
                //link[link.length] = "...<a href=\"#\">" + length + "</a>";
            }
            else if(index >= length - 3){
                //link[link.length] = "...<a href=\"#\">" + length + "</a>";
                for(var i = length - 4; i <= length; i++){
                    setCurrent();
                }
            }
            else{
                //当前页在中间
                //link[link.length] = "<a href=\"#\">1</a>...";
                for(var i = index - 2; i <= index; i++){
                    setCurrent();
                }
                //link[link.length] = "...<a href=\"#\">" + length + "</a>";
            }
        }
        if(index == length){
            //link[link.length] = "<a href=\"#\" class='on'>next</a>";
        }
        else{
           // link[link.length] = "<a href=\"#\">next</a>";
        }
        links = link;
        document.body.innerHTML = link.join("")
        /*for(var i = start; i <= end; i++, j++){
            _fd.selectAll(links[j]).removeClass(PAGINATION_CURRENT);
            links[j].innerHTML = links[j].innerHTML.replace(/\d+/g, i);
        }*/
        //_fd.selectAll(links[index]).addClass(PAGINATION_CURRENT);
    };
    /*Pagination.cal = function(index){
        var current = this.getCurrent(),
            length = this.getLength(),
            pageList = this.getPageList(),
            range = this.getRange() || [1, 10],
            page = index;
        if(current){
            if(page <= 1){
                index = page = 1;
                this.first && _fd.selectAll(this.first).addClass(PAGINATION_DISABLE);
                this.prev && _fd.selectAll(this.prev).addClass(PAGINATION_DISABLE);
            }
            else{
                this.first && _fd.selectAll(this.first).removeClass(PAGINATION_DISABLE);
                this.prev && _fd.selectAll(this.prev).removeClass(PAGINATION_DISABLE);
            }
            if(page >= length){
                index = page = length;
                this.last && _fd.selectAll(this.last).addClass(PAGINATION_DISABLE);
                this.next && _fd.selectAll(this.next).addClass(PAGINATION_DISABLE);
            }
            else{
                this.last && _fd.selectAll(this.last).removeClass(PAGINATION_DISABLE);
                this.next && _fd.selectAll(this.next).removeClass(PAGINATION_DISABLE);   
            }
            var g = index;
            
            var start = 1, //range[0],
                end = 10,//range[1],
                middle = range[1] >> 1;
            //console.log(range, index, middle, page)
            if(length <= 10){

            }
            else{
                if(page <= 4){

                }
                else if(page >= length - 3){

                }
                else{

                }
            }
            if(page == length){

            }
            else{

            }
            if(page <= 4){
                end = range[1];//page + 2;
            }
            else if(page > 5){
                g = 5;
                if(page + 5 > length){
                    g = g + (5 - (length - page));
                    end = length;
                    start = end - 9;
                }
                else{
                    start = page - 4;
                    end = page + 5;
                }
            }
            var r = this.setRange([start, end]).getRange(), j = 0;
            for(var i = r[0]; i <= r[1]; i++, j++){
                if(pageList[j]){
                    _fd.selectAll(pageList[j]).removeClass(PAGINATION_CURRENT);
                    pageList[j].innerHTML = pageList[j].innerHTML.replace(/\d+/g, i);
                }
            }
            g -= 1;
            this.setCurrent({
                "page": page,
                "link": pageList[g],
                "index": index
            });
            this.setPage(page);
            _fd.selectAll(pageList[g]).addClass(PAGINATION_CURRENT);
        }
    };*/
});