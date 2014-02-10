/*!
* TabPanel Javascript Widget
* Author: flyend
* Contact: flyend@126.com(e-mail), 269644230(qq)
* Date: Tue Dec 10 2013
*/
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
            query = (!!~url.indexOf("?") ? (url + (data ? "&" : "") + parseParams(data)) : (parseParams(data) ? url + "?" + parseParams(data) : url));
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
    return function(f){
        callback && callback.call(fd, f);
    }
}).call(this, function(factory){
    return factory(window, this)
})(function(window, _fd, undefined){
    /**
     *
     */
    function Table(table){
        var rowList = {
            "header": [],
            "body": [],
            "footer": []
        };
        this.table = table;
        this.getRowList = function(){
            return rowList;
        };
        this.setContent = function(content){
            this.content = content;
        }
        this.setTableHeader(table.getElementsByTagName("thead")[0] || table.appendChild(document.createElement("thead")));
        this.setTableBody(table.getElementsByTagName("tbody")[0] || table.appendChild(document.createElement("tbody")));
        this.setTableFooter(table.getElementsByTagName("tfoot")[0] || table.appendChild(document.createElement("tfoot")));
    }
    Table.prototype = {
        "getTableHeader": function(){
            this.setContent(this.header);
            return this;
        },
        "setTableHeader": function(header){
            this.header = header;
        },
        "getTableBody": function(){
            this.setContent(this.body);
            return this;
        },
        "setTableBody": function(body){
            var rowList = this.getRowList()["body"],
                rows = body.getElementsByTagName("tr"),
                cells,
                td = {};
            for(var i = 0, length = rows.length; i < length; i++){
                td = {"row": rows[i]};
                rowList.push(td);
                cells = rows[i].getElementsByTagName("td");
                for(var j = 0; j < cells.length; j++){
                    td[j] = cells[j];
                }
            }
            this.body = body;
        },
        "getTableFooter": function(){
            return this.footer;
        },
        "setTableFooter": function(footer){
            this.footer = footer;
        }
    };
    Table.prototype.addRow = function(data, tpl, callback){
        var content = this.content,//getHeader or getBody returns this content,
            type = content.tagName === "THEAD" ? "header" : content.tagName === "TFOOT" ? "footer" : "body",
            rowList = this.getRowList()[type],
            //body = this.getTableBody(),
            row,
            obj;
        if(data){
            row = document.createElement("tr");
            obj = {
                "row": row,
                "length": 0
            };
            content.appendChild(row);
            rowList.push(obj);
            //console.log(content, rowList)
            var currentRow = rowList[rowList.length - 1];
            var j = 0, r, tt, prop;
            if(isType(data) === "array"){
                j = 0;
                for(var i = 0, length = data.length; i < length; i++){
                    r = new RegExp("\\{" + i + "\\}", "g");
                    if(tpl && r.test(tpl)){
                        tt = tpl.replace(/(<\/t[d|h]>)[^$]/g, "$1@<").split(/<\/t[d|h]>@/)[j];
                        if(tt){
                            this.addCell(data[i], function(text){
                                console.log(this, tt, text, r)
                                return tt.replace(r, text).replace(/<([\s\/])*t[d|h]([^>]*)>?/g, "");
                            });
                            j++;
                        }
                    }
                    else
                        this.addCell(data[i]);
                }
            }
            else if(isType(data) === "object"){
                j = 0;
                for(var i in data){
                    r = new RegExp("\\{" + i + "\\}", "g");
                    if(tpl && r.test(tpl)){
                        //tt = tpl.split(/[^\s*]<t[d|h]>/)[j];//操作td损失了其设置
                        tt = tpl.replace(/(<\/t[d|h]>)[^$]/g, "$1@<").split(/<\/t[d|h]>@/)[j];
                        if(tt){                            
                            prop = tt.match(/[<\s]*td([^>]*)>?/);
                            if(prop){
                                prop = prop.pop();
                            }
                            //console.log(tt, prop)
                            this.addCell(data[i],
                                tt.replace(/<([\s\/])*t[d|h]([^>]*)>?/g, ""),
                                prop && prop.length ? function(){
                                    setProp(this, prop);
                                } : undefined);
                            j++;
                        }
                    }
                    else
                        this.addCell(data[i]);    
                }
            }
        }
        return this;
    };
    Table.prototype.addCell = function(data, tpl, callback){
        var type = this.content.tagName === "THEAD" ? "header" : this.content.tagName === "TFOOT" ? "footer" : "body",
            rowList = this.getRowList()[type],
            currentRow = rowList[rowList.length - 1];
        if(!data){
            return this;
        }
        var cell = document.createElement(type == "body" ? "td" : "th");
        cell.innerHTML = data;//cell.appendChild(document.createTextNode(data));
        if(!callback || tpl){
            if(isType(tpl) === "string"){
                cell.innerHTML = tpl.replace(/{(\w+)}/g, function($1, $2){
                    return data;
                });
            }
            else if(isType(tpl) === "function"){
                cell.innerHTML = tpl.call(cell, data) || data;
            }
        }
        currentRow["row"].appendChild(cell);
        currentRow[currentRow["length"]++] = cell;
        callback && callback.call(cell, currentRow);
        return this;
    };
    Table.prototype.addHeader = function(data, callback){
        var header = this.getTableHeader(),
            t = "",
            title = {};
        for(var i in data){
            title[i] = data[i]["text"];
            t += "<th>" + data[i]["tpl"] + "</th>";
        }
        this.getTableHeader().addRow(title, t, callback);
        this.setContent(this.body);//重置
        return this;
    };
    Table.prototype.removeAllRow = function(){
        var rowList = this.getRowList()["body"],
            body = this.body;
        while(rowList.length && body.childNodes.length){
            body.removeChild(rowList.pop()["row"]);
        }
    };

    _fd.namespace("fd.widget.SmartTable");
    fd.widget.SmartTable = SmartTable;
    var TABLE_NAME = "x-table";
    //object type
    var isType = function(o){
        return o == null ? String(o) : {
            "[object String]": "string",
            "[object Object]": "object",
            "[object Function]": "function",
            "[object Array]": "array"
        }[Object.prototype.toString.call(o)] || null;
    };
    //map string to object
    var mapTo = function(s, o){
        for(var i = 0, m = s.split("."), l = m.length; i ^ l; i++)
            o = o[m[i]];
        return o;
    };
    //set attribute
    var setProp = function(o, s){
        var s = s.replace(/[^|\s*]|[\s*|$]/, "").split(/\s+/),//.split(/[\'\"]*\s+/),
            i = 0,
            l = s.length,
            prop,
            name,
            value;
        for(; i < l; i++){
            prop = s[i].split("=");
            name = prop[0];
            value = prop[1].replace(/[\'\"]/g, "");
            if(value){
                o.setAttribute(name, value);
            }
        }
    };
    /*
     * new SmartTable()
     */
    function SmartTable(options){
        var table = options["table"] || document.createElement("table");
        _fd.selectAll(table).addClass(TABLE_NAME);
        //_fd.extend(this, new Table(table));
        _fd.extend(SmartTable.prototype, new Table(table));//用静态方式继承
        this.done = [];
        this.handler = [options];//初始化第一个处理
        this.toString = function(){
            return "[object SmartTable]";
        };
        this.getContext = function(){
            return table;
        };
        this.getColumn = function(){
            return options["column"] || 10;
        }
        SmartTable.init.call(this, options, function(){
            if(options["title"]){
                if(!options["table"]){
                    this.addHeader(options["title"], function(){ });
                }            
            }
            if(options["tpl"]){
                this.setTemplate(options["tpl"]);
            }
            if(!options["table"])
                this.appendTo();
        });
    }
    SmartTable.init = function(options, callback){
        var context = this.getContext(),
            body = this.getTableBody(),
            store = options["store"],
            titles = options["title"],
            column = this.getColumn(),
            request = {
                "url": "",
                "query": "",
                "data": null,
                "done": false,
                "column": column,
                "mapping": options["mapping"] || ""
            },
            me = this;
        //ajax request
        if(isType(store) === "string"){
            var query = options["query"];
            if(query){
                !("column" in query) && (query["column"] = column);
                request["query"] = query;
            }
            request["url"] = store;
            SmartTable.ajax({
                "url": store,
                "type": "GET",
                "async": true,
                "data": query,
                "success": function(res, query){
                    var done = me.done.shift(),
                        res = options["mapping"] ? mapTo(options["mapping"], res) : res;
                    res = res.slice(0, options["column"] || 10);
                    request["data"] = res;
                    request["done"] = true;
                    request["query"] = query;
                    res = Store.getInstance().collection(res, titles);
                    res = res.length ? res : request["data"];
                    SmartTable.load.call(me, res);
                    //console.log(me.done)
                    done && done.call(me, res);
                }
            });
        }
        else if(isType(store) === "array"){
            if((options["query"] && options["query"]["page"])){
                store = (options["query"] && options["query"]["page"]);//形参不覆盖实参
            }
            else
                store = store.slice(0, options["column"] || 10);
            request["data"] = store;
            request["done"] = true;
            store = Store.getInstance().collection(store, titles);
            SmartTable.load.call(this, store);
        }
        me.handler.push(request);
        callback && callback.call(this);
    };
    SmartTable.load = function(data){
        var length = data.length,
            tpl = this.handler[0]["tpl"],
            titles = this.handler[0]["title"],
            d;
        if(!length){
            this.addRow(["not data!"], "<td colspan='100'>{0}</td>");
        }
        var array = [],
            keys = Store.getInstance().getKey();
        for(var k = 0; k < keys.length; k++){
            for(var p in tpl){
                if(p == keys[k]){
                    array.push("<td>" + tpl[p] + "</td>");
                }
            }
        }
        for(var i = 0; i < length; i++){
            d = data[i];
            if(isType(d) === "array"){
                this.addRow(d);//options["tpl"]
            }
            else if(isType(d) === "object"){
                this.addRow(d, array.join(""));
                /*for(var j in d){
                    cell = row.addCell(d[j], "<td>{\w}</td>");
                }*/
            }
        }
    };
    SmartTable.prototype.appendTo = function(el){
        (el || document.body).appendChild(this.getContext());
        return this;
    };
    SmartTable.prototype.setTemplate = function(){

    };
    SmartTable.prototype.reset = function(){
        this.removeAllRow();
        return this;
    };
    SmartTable.prototype.reload = function(options){
        var handler = this.handler,
            lastHandler = handler[handler.length - 1];//上一次的handler
        //console.log(handler)
        !("mapping" in options) && (options["mapping"] = lastHandler["mapping"]);
        !("column" in options) && (options["column"] = lastHandler["column"]);
        !("store" in options) && (options["store"] = lastHandler["url"]);
        !("query" in options) && (options["query"] = {"column": options["column"]});
        !("title" in options) && (options["title"] = handler[0]["title"]);
        SmartTable.init.call(this, options);
        return this;
    };
    SmartTable.prototype.ready = function(callback){
        this.done.push(function(data){
            callback && callback(data);
        });
        return this;
    };
    SmartTable.ajax = function(options){        
        _fd.ajax({
            "url": options["url"],
            "type": options["type"],
            "async": options["async"],
            "data": options["data"],
            "success": function(xmlhttp, query){
                options["success"] && options["success"](_fd.parseData(xmlhttp.responseText),query);
            }
        });
    };
    /**
     * Store
     */
    function Store(){
        this.store = [];
    };
    Store.getInstance = function(){
        if(!this.store){
            this.store = new Store();
            //console.log(this.store);
        }
        return this.store;
    };
    Store.prototype = {
        "collection": function(src, target){
            var key = [],
                data = [],
                length = 0,
                i,
                j,
                o;
            if(!target){
                this.store = src;
                this.key = [];
                return src;
            }
            //handler target, only object
            for(i in target){
                if(target.hasOwnProperty(i)){
                    key.push(i);
                    key = key.concat(target[i]["field"]);
                }
            }
            key = key.join(" ").replace(/\b([A-Za-z\u00C0-\u1FFF\u2800-\uFFFD\'\-]+)\b(?=.*\b\1\b)/ig, "").replace(/(^\s*)|(\s*$)/g, "").split(/\s+/);
            for(i = 0, length = src.length; i < length; i++){
                o = {};
                if(isType(src[i]) === "object"){
                    for(j = 0; j < key.length; j++){
                        if(key[j] in src[i]){
                            o[key[j]] = src[i][key[j]];
                        }
                    }
                    data.push(o);
                }
            }
            //console.log(key, data, target, src);
            this.store = data;
            this.key = key;
            return data;
        },
        "getStore": function(){
            return this.store;
        },
        "getKey": function(){
            return this.key;
        }
    };
});