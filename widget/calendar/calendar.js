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
        }
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
            }
        }
        fd.fn.init.prototype = fd.prototype;
        return fd;
    })();
    return function(f){
        callback && callback.call(fd, f);
    }
}).call(this, function(factory){
    return factory(window, this)
})(function(window, _fd, undefined){
    _fd.namespace("fd.widget.Calendar");
    var    CALENDAR_NAME = "x-calendar",
        CALENDAR_FIELD = CALENDAR_NAME + "-field",
        CALENDAR_HEADER = CALENDAR_NAME + "-top",
        CALENDAR_MONTH_PREV = CALENDAR_NAME + "-month-prev",
        CALENDAR_MONTH_NEXT = CALENDAR_NAME + "-month-next",
        CALENDAR_MONTH_CURRENT = CALENDAR_NAME + "-month",
        CALENDAR_YEAR_CURRENT = CALENDAR_NAME + "-year",
        CALENDAR_TODAY = CALENDAR_NAME + "-today",
        CALENDAR_CLOSE = CALENDAR_NAME + "-close",
        CALENDAR_WEEK = CALENDAR_NAME + "-week",
        CALENDAR_DAY_INVALID = CALENDAR_NAME + "-invalid",
        CALENDAR_HIDE = CALENDAR_NAME + "-hide",
        CALENDAR_TIME = CALENDAR_NAME + "-time",
        CALENDAR_HOUR = CALENDAR_TIME + "-hour",
        CALENDAR_MINUTE = CALENDAR_TIME + "-minute",
        CALENDAR_SECOND = CALENDAR_TIME + "-second";

    fd.widget.Calendar = Calendar;
    function Calendar(opt){
        this.calendar = null;
        this.toString = function(){
            return "[object Calendar]";    
        };
        this.create = function(){
            this.calendar = document.createElement("table");
            this.calendar.className = CALENDAR_NAME;
            return this.calendar;    
        };
        this.id = function(id){
            id && (this.calendar.setAttribute("id",id));
            return this;
        };
        this.getContext = function(){
            return this.calendar || this.create();
        };
        if(!this.calendar){
            this.calendar = this.create();
        }
        this.init(opt);
        return this;
    };
    Calendar.create = {
        "element": function(text,className,title){
            var el = document.createElement("a");
            el.href = "javascript:void(0);";
            el.className = className;
            el.title = title || "";
            el.innerHTML = text;
            return el;
        },
        "YEAR_CURRENT": function(year){
            return this.element(year,CALENDAR_YEAR_CURRENT);
        },
        "MONTH_CURRENT": function(month){
            return this.element(month,CALENDAR_MONTH_CURRENT);
        },
        "MONTH_PREV": function(){
            return this.element("&lt;",CALENDAR_MONTH_PREV,"上一月");
        },
        "MONTH_NEXT": function(){
            return this.element("&gt;",CALENDAR_MONTH_NEXT,"下一月");
        },
        "CLOSE": function(){
            return this.element("X",CALENDAR_CLOSE,"关闭");
        }
    };
    //console.log(Calendar.create.YEAR(2012))
    Calendar.prototype.init = function(options){
        var date, year, month, day;
        if(options && options.date){
            date = options.date.split(/[^\d+]/);
            year = +date[0];
            month = (+date[1] && +date[1] - 1) | 0;
            day = +date[2] || 1;
            this.date = new Date(year,month,day);
            this.year = year;
            this.month = month;
        }
        else{
            this.date = new Date();
            this.year = this.date.getFullYear();
            this.month = this.date.getMonth();    
        }
        this.format = (options && options.format) || "yyyy/MM/dd";
        (options && options.css) && _fd.selectAll(this.calendar || this.getContext()).css(options.css);
        this.appendTo();        
        this.draw(this.year, this.month, options);
    };
    /*Calendar.prototype.draws = function(year,month){
        //new DateUI(this.constructor,this);
    };*/
    Calendar.prototype.draw = function(year, month, options){
        this.ui = new DateUI(this);
        var calendar = this.calendar || this.getContext(),
            body = this.redraw(year,month);
        calendar.appendChild(this.ui.setHeader(year,month + 1 % 12 || 12));
        calendar.appendChild(body);
        if(/[hms]+/.test(this.format)){
            calendar.appendChild(this.ui.setFooter(options));
        }
        return this;
    };
    Calendar.prototype.redraw = function(year,month,tday){
        var currentMonth = month + 1,
            currentDays = new Date(year,currentMonth,0).getDate(),
            prevDays = new Date(year,month,0).getDate(),
            firstDay = new Date(year,month,1).getDay();
        firstDay || (firstDay = 7);
        var today = this.date,
            hasToday = tday || ((today.getFullYear() == year) && (today.getMonth() == month)),
            todayDate = tday || today.getDate();
        return this.ui.setContent(firstDay,prevDays,currentDays,hasToday,todayDate);
    };
    Calendar.prototype.appendTo = function(el){
        (el || document.body).appendChild(this.calendar || this.getContext());
        return this;
    };
    Calendar.prototype.bind = function(type, fn){
        var calendar = this.calendar || this.getContext(),
            me = this,
            parseDate = function(format, el, hour, minute, second){
                var r = {
                        "y+": me.year,
                        "M+": me.month + 1,
                        "d+": el,
                        "h+": hour,
                        "m+": minute,
                        "s+": second
                    };
                for(var p in r){
                    if(new RegExp("(" + p + ")", "i").test(format)){
                        //console.log(RegExp.$1.length)
                        var d = r[p] + "";
                        format = format.replace(RegExp.$1, function($0,$1){
                            //console.log(arguments[1])
                            var l = RegExp.$1.length;
                            return l < 2 || (l == 4) ? d : ("00" + d).substr(d.length);
                        });
                    }    
                }
                return format;
            };
        //_fd.selectAll(calendar).bind(type,function(e){
        calendar["on" + type] = function(e){
            var e = e || window.event,
                target = e.target || e.srcElement,
                footer = _fd.selectAll("tfoot", calendar),
                date = new Date(),
                hour,
                minute,
                second;
            if(target.tagName == "A" &&  target.parentNode.tagName == "TD"){
                if(footer.length){
                    footer = footer[0].getElementsByTagName("input");
                    hour = footer[0].value;
                    minute = footer[1].value;
                    second = footer[2].value;
                }
                else{
                    hour = date.getHours();
                    minute = date.getMinutes();
                    second = date.getSeconds();
                }
                //console.log(target.firstChild.nodeValue)
                fn && fn(parseDate(me.format, target.firstChild.nodeValue, hour, minute, second), target, me);
            }
        };
        //});
        return this;
    };
    Calendar.prototype.setFormat = function(format){
        this.format = format;
    };
    Calendar.prototype.hide = function(){
        var calendar = this.calendar || this.getContext();
        _fd.selectAll(calendar).addClass(CALENDAR_HIDE);
        return !1;
    };
    Calendar.prototype.show = function(){
        var calendar = this.calendar || this.getContext();
        _fd.selectAll(calendar).removeClass(CALENDAR_HIDE);
        return !0;
    };
    Calendar.prototype.redate = function(value){
        var calendar = this.calendar || this.getContext(),
            date = new Date(),
            me = this;
        function draw(){
            calendar.replaceChild(me.ui.setHeader(+value[0],+value[1] % 12 || 12), _fd.selectAll(calendar)[0].getElementsByTagName("thead")[0]);
            calendar.replaceChild(me.redraw(+value[0],+value[1] - 1,+value[2]), _fd.selectAll(calendar)[0].getElementsByTagName("tbody")[0]);
            if(value.length > 3){
                var footer = _fd.selectAll(calendar)[0].getElementsByTagName("tfoot")[0],
                    times = footer.getElementsByTagName("input");
                times[0].value = value[3];
                times[1].value = value[4];
                times[2].value = value[5];
            }
        }
        if(value && /^\d{4}\D+\d{1,2}\D+\d{1,2}\s*(\d{1,2}\D+\d{1,2}\D+\d{1,2})?$/.test(value)){            
            if(value){
                var value = value.match(/\d+/g);//split(/-|\//);
            }
            else{
                value = [];
                value[0] = date.getFullYear(),
                value[1] = date.getMonth() + 1,
                value[2] = date.getDate();
            }
            draw();
        }
        else{
            value = [];
            value[0] = date.getFullYear(),
            value[1] = date.getMonth() + 1,
            value[2] = date.getDate();
            if(/[hms]+/.test(this.format)){
                value[3] = paddingLeft(date.getHours());
                value[4] = paddingLeft(date.getMinutes());
                value[5] = paddingLeft(date.getSeconds());
            }
            draw();
        }
        return this;    
    };
    Calendar.prototype.css = function(prop){
        var calendar = this.calendar || this.getContext();
        for(var p in prop){
            calendar.style[p] = prop[p];
        }
        return this;
    };
    Calendar.prototype.doClickSpace = function(el){
        var me = this;
        (function(te,el,type){
            _fd.selectAll(document).bind("click",function(e){
                var e = e || window.event,
                    target = e.target || e.srcElement,
                    fn = function(o,c){
                        while(o = o.parentNode){
                            if(o.className && !!~o.className.indexOf(c))
                                return 1;
                        }
                        return 0;
                    };
                if(target == te){
                    me.show();
                }
                else if(!fn(target,type)){
                    me.hide();
                }    
            },0);
        })(el,this.calendar,CALENDAR_NAME);
        return this;
    };
    Calendar.prototype.direction = function(el,e){
        var calendar = this.calendar || this.getContext(),
            e = e || window.event,
            charCode = e.charCode || e.keyCode || e.which,
            tbody = calendar.getElementsByTagName("tbody")[0],
            tds = tbody.getElementsByTagName("td"),
            format = this.format.replace(/\w+/gi,"").split("");
        Calendar.index = Calendar.index;
        el.arrays || (el.arrays = [Calendar.index]);
        switch(charCode){
            case 39:
                //el.blur();
                if(Calendar.index >= Calendar.end)
                    return el.focus();
                Calendar.index++;
                el.arrays.unshift(Calendar.index);
                tds[Calendar.index].className = CALENDAR_TODAY;
                if(el.arrays.length > 1){
                    tds[el.arrays.pop()].className = "";
                }
                el.value = this.year + format[0] + (this.month + 1) + format[1] + (Calendar.index - Calendar.start);
                el.focus();
            break;
            case 37:
                //el.blur();
                if(Calendar.index <= Calendar.start + 1)
                    return el.focus();
                Calendar.index--;
                el.arrays.unshift(Calendar.index);
                tds[Calendar.index].className = "today";
                if(el.arrays.length > 1){
                    tds[el.arrays.pop()].className = "";    
                }
                el.value = this.year + format[0] + (this.month + 1) + format[1] + (Calendar.index - Calendar.start);
                el.focus();
            break;
        }
    }
    function DateUI(factory){
        //ct.call(this);
        //this.draw(factory);
        this.factory = factory;
    }
    DateUI.prototype.draw = function(factory){
        //this.calendar = factory.calendar;
        //this.setHeader(factory.year,factory.month);//.setContent()

        return this;
    };
    DateUI.prototype.setHeader = function(year,month){
        var thead = document.createElement("thead"),
            trow = document.createElement("tr"),
            th = document.createElement("th"),
            ch = document.createElement("div"),
            isIE = !!window.ActiveXObject && /msie (\d)/i.test(navigator.userAgent) ? RegExp['$1'] : false,
            colspan = isIE < 8 ? "colSpan" : "colspan",
            currentYear = Calendar.create.YEAR_CURRENT(year + "年"),
            currentMonth = Calendar.create.MONTH_CURRENT(month + "月"),
            prevMonth = Calendar.create.MONTH_PREV(),
            nextMonth = Calendar.create.MONTH_NEXT(),
            calendar = this.factory.calendar,
            me = this;
        //year
        _fd.selectAll(currentYear).bind("click",function(){
            if(!this.list){
                var from = year,
                    to = from + 6,
                    self = this;
                this.list = me.setItem(this,from - 5, to, function(el){
                    calendar.replaceChild(me.factory.redraw(+el.value,month - 1), _fd.selectAll(calendar)[0].getElementsByTagName("tbody")[0]);
                    me.factory.year = +el.value;
                    el.parentNode.removeChild(el);
                    self.list = null;
                });
            }
            else{
                this.list.style.display = "block";    
            }
            if(currentMonth.list){
                currentMonth.list.style.display = "none";    
            }
        });
        //month
        _fd.selectAll(currentMonth).bind("click",function(){
            if(!this.list){
                this.list = me.setItem(this,1,12,function(el){
                    calendar.replaceChild(me.factory.redraw(year,+el.value - 1), _fd.selectAll(calendar)[0].getElementsByTagName("tbody")[0]);
                    me.factory.month = +el.value - 1;
                    el.style.display = "none";
                });
            }
            else
                this.list.style.display == "none" ? this.list.style.display = "block" : this.list.style.display = "none";
            if(currentYear.list){
                currentYear.list.style.display = "none";
            }
        });
        //prev
        _fd.selectAll(prevMonth).bind("click",function(){
            var v = parseInt(currentMonth.firstChild.nodeValue.split(/[^\d+]/)[0],10);
            --v || (v = 12);
            v ^ 12 || (me.factory.year -= 1);
            calendar.replaceChild(me.factory.redraw(year,v - 1), _fd.selectAll(calendar)[0].getElementsByTagName("tbody")[0]);
            currentMonth.firstChild.nodeValue = currentMonth.firstChild.nodeValue.replace(/(\d+)/,v);
            currentYear.firstChild.nodeValue = currentYear.firstChild.nodeValue.replace(/(\d+)/,me.factory.year);
            me.factory.month = v - 1;
            //me.factory.year = year;
            if(currentYear.list){
                currentYear.list.style.display = "none";
            }
            if(currentMonth.list){
                currentMonth.list.style.display = "none";
            }
        });
        //next
        _fd.selectAll(nextMonth).bind("click",function(){
            var v = parseInt(currentMonth.firstChild.nodeValue.split(/[^\d+]/)[0],10);
            v %= 12;
            v++ || (me.factory.year += 1);
            calendar.replaceChild(me.factory.redraw(year,v - 1), _fd.selectAll(calendar)[0].getElementsByTagName("tbody")[0]);
            currentMonth.firstChild.nodeValue = currentMonth.firstChild.nodeValue.replace(/(\d+)/,v);
            currentYear.firstChild.nodeValue = currentYear.firstChild.nodeValue.replace(/(\d+)/,me.factory.year);
            me.factory.month = v - 1;
            //me.factory.year = year;
            if(currentYear.list){
                currentYear.list.style.display = "none";
            }
            if(currentMonth.list){
                currentMonth.list.style.display = "none";
            }
        });
        th.setAttribute(colspan,7);
        ch.className = CALENDAR_HEADER;
        ch.appendChild(prevMonth);
        ch.appendChild(currentYear);
        ch.appendChild(currentMonth);
        ch.appendChild(nextMonth);
        ch.appendChild(Calendar.create.CLOSE());
        th.appendChild(ch);
        trow.appendChild(th);
        trow.appendChild(th);
        thead.appendChild(trow);
        return thead;
    };
    DateUI.prototype.setContent = function(firstDay,prev,days,hasToday,todayDate){
        var tbody = document.createElement("tbody"),
            trow = document.createElement("tr"),
            tcell;
        trow.className = CALENDAR_WEEK;
        for(var i = 0, weeks = "日一二三四五六".split(/\s*/); i ^ weeks.length; i++){
            tcell = document.createElement("td");
            tcell.appendChild(document.createTextNode(weeks[i]));
            trow.appendChild(tcell);    
        }
        tbody.appendChild(trow);
        for(var i = 1, j = 1; i <= 42; i++){
            if(!(i ^ 1)){
                trow = document.createElement("tr");
            }
            tcell = document.createElement("td");
            if(i <= firstDay){
                tcell.className = CALENDAR_DAY_INVALID;
                tcell.appendChild(document.createTextNode(prev - firstDay + i));
                Calendar.start = i + 6;
            }
            else{
                if(i > days + firstDay){
                    tcell.className = CALENDAR_DAY_INVALID;
                    tcell.appendChild(document.createTextNode(j++));
                }
                else{
                    if(hasToday && !(i-firstDay ^ todayDate)){
                        tcell.className = CALENDAR_TODAY;
                        Calendar.index = i + 6;
                    }
                    var link = document.createElement("a");
                    link.href = "javascript:void(0)";
                    link.appendChild(document.createTextNode(i - firstDay));
                    tcell.appendChild(link);
                    Calendar.end = i + 6;
                }
            }
            trow.appendChild(tcell);
            if(!(i % 7) && i ^ 41){
                tbody.appendChild(trow);
                trow = document.createElement("tr");
            }
        }
        return tbody;
    };
    DateUI.prototype.setFooter = function(options){
        var tfoot = document.createElement("tfoot"),
            trow = document.createElement("tr"),
            td = document.createElement("td"),
            isIE = !!window.ActiveXObject && /msie (\d)/i.test(navigator.userAgent) ? RegExp['$1'] : false,
            colspan = isIE < 8 ? "colSpan" : "colspan";
        td.setAttribute(colspan, 7);
        td.appendChild(new TimePicker(options).getContext());
        trow.appendChild(td);
        tfoot.appendChild(trow);
        return tfoot;
    };
    DateUI.prototype.setItem = function(el,from,to,fn){
        var val = el.firstChild.nodeValue.split(/[^\d+]/)[0],
            list = document.createElement("select"),
            x = _fd.selectAll(el).offset().left - 3,
            y = _fd.selectAll(el).offset().top;
        list.className = "s" + el.className;
        list.setAttribute("multiple","multiple");
        list.size = "12";
        for(var i = 0; from <= to; from++){
            var item = new Option(from, from);
            if(from == val)
                item.setAttribute("selected",1);
            list.options[i++] = item;
        }
        _fd.selectAll(list).css({"left": el.offsetLeft + "px", "top": el.offsetTop + el.offsetHeight - 0 + "px"});
        el.parentNode.appendChild(list);
        list.onchange = function(){
            el.firstChild.nodeValue = el.firstChild.nodeValue.replace(/(\d+)/,this.value);
            fn && fn(this);
        };
        return list;    
    };
    /*
    * padding left
    */
    var paddingLeft = function(value){
        return +value < 10 ? "0" + value : value;
    };
    /*
     * DateTime
     */
    function TimePicker(options){
        var time = document.createElement("div");
        time.className = CALENDAR_TIME;
        this.toString = function(){
            return "[object TimePicker]";
        };
        this.getContext = function(){
            return time;
        };
        TimePicker.init.call(this, options, function(){
        });
    }
    TimePicker.init = function(options, callback){
        var context = this.getContext(),
            format = options["format"] || "hh:mm:ss",
            time = Time.getInstance.call(this, options),
            validate = function(){
                var me = this;
                return {
                    "digital": function(){
                        if(!me.value.match(/^[\+\-]?\d*?\d*?$/))
                            me.value = me.value.replace(/\D+/g, "");
                        return this;
                    },
                    "max": function(max){
                        var oldValue = me.value;
                        if(me.value.length > 2 && +me.value < max){
                            me.value = "00";
                        }
                        else if(+me.value > max){
                            me.value = "00";
                        }
                    }
                };
            };
        format = format.substr(format.indexOf("h")).match(/[^hms\s]/g);
        context.appendChild(time.addHour(format && format[0] || "时", function(){
            this.onkeypress = function(){
                validate.call(this)["digital"]().max(24);
            };
            this.onkeyup = function(){
                validate.call(this)["digital"]().max(24);
            };
        }));
        context.appendChild(time.addMinute(format && format[1] || "分", function(){
            this.onkeypress = function(){
                validate.call(this)["digital"]().max(60);
            };
            this.onkeyup= function(){
                validate.call(this)["digital"]().max(60);
            };
        }));
        context.appendChild(time.addSecond(format && format[2] || "", function(){
            this.onkeypress = function(){
                validate.call(this)["digital"]().max(60);
            };
            this.onkeyup= function(){
                validate.call(this)["digital"]().max(60);
            };
        }));
        callback && callback.call(this);
    };
    TimePicker.prototype.appendTo = function(el){
        (el || document.body).appendChild(this.getContext());
    };
    function Time(factory, options){
        this.datetime = new Date();
        //console.log(this)
    }
    Time.getInstance = function(options){
        //console.log(Tab.created);
        if(!Time.created){
            Time.created = new Time(this, options);
        }
        return Time.created;
    };
    Time.create = function(value){
        var text = document.createElement("input");
        text.type = "text";
        text.value = value;
        _fd.selectAll(text).bind("blur", function(){
            if(!this.value.length){
                this.value = value;
            }
            if(this.value.length < 2)
            this.value = paddingLeft(this.value);
        });
        return text;
    }
    Time.prototype.getHour = function(){
        return paddingLeft(this.datetime.getHours());
    };
    Time.prototype.getMinute = function(){
        return paddingLeft(this.datetime.getMinutes());
    };
    Time.prototype.getSecond = function(){
        return paddingLeft(this.datetime.getSeconds());
    };
    Time.prototype.addHour = function(ft, callback){
        var hour = document.createElement("span"),
            text = Time.create(this.getHour()),
            format = document.createElement("span");
        hour.className = CALENDAR_HOUR;
        format.className = CALENDAR_TIME + "-format";
        format.innerHTML = ft || "";
        hour.appendChild(text);
        hour.appendChild(format);
        callback && callback.call(text);
        return hour;
    };
    Time.prototype.addMinute = function(ft, callback){
        var minute = document.createElement("span"),
            text = Time.create(this.getMinute()),
            format = document.createElement("span");
        minute.className = CALENDAR_MINUTE;
        format.className = CALENDAR_TIME + "-format";
        format.innerHTML = ft || "";
        minute.appendChild(text);
        minute.appendChild(format);
        callback && callback.call(text);
        return minute;
    };
    Time.prototype.addSecond = function(ft, callback){
        var second = document.createElement("span"),
            text = Time.create(this.getSecond()),
            format = document.createElement("span");
        second.className = CALENDAR_SECOND;
        format.className = CALENDAR_TIME + "-format";
        format.innerHTML = ft || "";
        second.appendChild(text);
        second.appendChild(format);
        callback && callback.call(text);
        return second;
    };
});