/*!
* Calendar Javascript Widget
* Author: flyend
* Contact: flyend@126.com(e-mail), 269644230(qq)
* Date: Mon Oct 2012
*/
(function(window,document){
	_$.namespace("_$.widget.Calendar");
	var d = document, that = window,
		CALENDAR_NAME = "x-calendar",
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
		CALENDAR_HIDE = CALENDAR_NAME + "-hide";
	_$.widget.Calendar = Calendar;
	function Calendar(opt){
		this.calendar = null;
		this.toString = function(){
			return "[object Calendar]";	
		};
		this.create = function(){
			this.calendar = d.createElement("table");
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
	Calendar.prototype.init = function(opt){
		var date, year, month, day;
		if(opt && opt.date){
			date = opt.date.split(/[^\d+]/);
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
		this.format = (opt && opt.format) || "yyyy/MM/dd";
		(opt && opt.css) && _$(this.calendar || this.getContext()).css(opt.css);
		document.body.appendChild(this.calendar);
		this.draw(this.year,this.month,opt);
	};
	/*Calendar.prototype.draws = function(year,month){
		//new DateUI(this.constructor,this);
	};*/
	Calendar.prototype.draw = function(year,month,opt){
		this.ui = new DateUI(this);
		var calendar = this.calendar || this.getContext(),
			body = this.redraw(year,month);
		calendar.appendChild(this.ui.setHeader(year,month + 1 % 12 || 12));
		calendar.appendChild(body);
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
		el.appendChild(this.calendar || this.getContext());
		return this;
	};
	Calendar.prototype.bind = function(type,fn){
		var calendar = this.calendar || this.getContext(),
			me = this,
			parseDate = function(format,el){
				var r = {
						"y+": me.year,
						"M+": me.month + 1,
						"d+": el,
						"h+": me.date.getHours(),
						"m+": me.date.getMinutes(),
						"s+": me.date.getSeconds()
					};
				for(var p in r){
					if(new RegExp("(" + p + ")","i").test(format)){

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
		//console.log(parseDate("yyyy/MM/dd"))
		//_$(calendar).bind(type,function(e){
		calendar["on" + type] = function(e){
			var e = e || that.event,
				target = e.target || e.srcElement;
			if(target.tagName == "A" &&  target.parentNode.tagName == "TD"){
				fn && fn(parseDate(me.format,target.firstChild.nodeValue),target,me);
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
		_$(calendar).addClass(CALENDAR_HIDE);
		//calendar.parentNode.removeChild(calendar);
		return !1;
	};
	Calendar.prototype.show = function(){
		var calendar = this.calendar || this.getContext();
		_$(calendar).removeClass(CALENDAR_HIDE);
		return !0;
	};
	Calendar.prototype.redate = function(value){
		if(/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value)){
			var calendar = this.calendar || this.getContext();
			if(value){
				var value = value.split(/-|\//);
			}
			else{
				value = [];
				var date = new Date();
				value[0] = date.getFullYear(),
				value[1] = date.getMonth() + 1,
				value[2] = date.getDate();
			}
			calendar.replaceChild(this.ui.setHeader(+value[0],+value[1] % 12 || 12),_$(calendar).find("thead")[0]);
			calendar.replaceChild(this.redraw(+value[0],+value[1] - 1,+value[2]),_$(calendar).find("tbody")[0]);
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
			_$(document).bind("click",function(e){
				var e = e || that.event,
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
			e = e || that.event,
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
		var thead = d.createElement("thead"),
			trow = d.createElement("tr"),
			th = d.createElement("th"),
			ch = d.createElement("div"),
			isIE = !!window.ActiveXObject && /msie (\d)/i.test(navigator.userAgent) ? RegExp['$1'] : false,
			colspan = isIE < 8 ? "colSpan" : "colspan",
			currentYear = Calendar.create.YEAR_CURRENT(year + "年"),
			currentMonth = Calendar.create.MONTH_CURRENT(month + "月"),
			prevMonth = Calendar.create.MONTH_PREV(),
			nextMonth = Calendar.create.MONTH_NEXT(),
			calendar = this.factory.calendar,
			me = this;
		//year
		_$(currentYear).bind("click",function(){
			if(!this.list){
				var from = year,
					to = from + 6,
					self = this;
				this.list = me.setItem(this,from - 5,to,function(el){
					calendar.replaceChild(me.factory.redraw(+el.value,month - 1),_$(calendar).find("tbody")[0]);
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
		_$(currentMonth).bind("click",function(){
			if(!this.list){
				this.list = me.setItem(this,1,12,function(el){
					calendar.replaceChild(me.factory.redraw(year,+el.value - 1),_$(calendar).find("tbody")[0]);
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
		_$(prevMonth).bind("click",function(){
			var v = parseInt(currentMonth.firstChild.nodeValue.split(/[^\d+]/)[0],10);
			--v || (v = 12);
			v ^ 12 || (me.factory.year -= 1);
			calendar.replaceChild(me.factory.redraw(year,v - 1),_$(calendar).find("tbody")[0]);
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
		_$(nextMonth).bind("click",function(){
			var v = parseInt(currentMonth.firstChild.nodeValue.split(/[^\d+]/)[0],10);
			v %= 12;
			v++ || (me.factory.year += 1);
			calendar.replaceChild(me.factory.redraw(year,v - 1),_$(calendar).find("tbody")[0]);
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
		var tbody = d.createElement("tbody"),
			trow = d.createElement("tr"),
			tcell;
		trow.className = CALENDAR_WEEK;
		for(var i = 0, weeks = "日一二三四五六".split(/\s*/); i ^ weeks.length; i++){
			tcell = d.createElement("td");
			tcell.appendChild(d.createTextNode(weeks[i]));
			trow.appendChild(tcell);	
		}
		tbody.appendChild(trow);
		for(var i = 1, j = 1; i <= 42; i++){
			if(!(i ^ 1)){
				trow = d.createElement("tr");
			}
			tcell = d.createElement("td");
			if(i <= firstDay){
				tcell.className = CALENDAR_DAY_INVALID;
				tcell.appendChild(d.createTextNode(prev - firstDay + i));
				Calendar.start = i + 6;
			}
			else{
				if(i > days + firstDay){
					tcell.className = CALENDAR_DAY_INVALID;
					tcell.appendChild(d.createTextNode(j++));
				}
				else{
					if(hasToday && !(i-firstDay ^ todayDate)){
						tcell.className = CALENDAR_TODAY;
						Calendar.index = i + 6;
					}
					var link = d.createElement("a");
					link.href = "javascript:void(0)";
					link.appendChild(d.createTextNode(i - firstDay));
					tcell.appendChild(link);
					Calendar.end = i + 6;
				}
			}
			trow.appendChild(tcell);
			if(!(i % 7) && i ^ 41){
				tbody.appendChild(trow);
				trow = d.createElement("tr");
			}
		}
		return tbody;
	};
	DateUI.prototype.setItem = function(el,from,to,fn){
		var val = el.firstChild.nodeValue.split(/[^\d+]/)[0],
			list = d.createElement("select"),
			x = _$(el).offset().left - 3,
			y = _$(el).offset().top;
		list.className = "s" + el.className;
		list.setAttribute("multiple","multiple");
		list.size = "12";
		for(var i = 0; from <= to; from++){
			var item = new Option(from, from);
			if(from == val)
				item.setAttribute("selected",1);
			list.options[i++] = item;
		}
		_$(list).css({"left": el.offsetLeft + "px", "top": el.offsetTop + el.offsetHeight - 0 + "px"});
		el.parentNode.appendChild(list);
		list.onchange = function(){
			el.firstChild.nodeValue = el.firstChild.nodeValue.replace(/(\d+)/,this.value);
			fn && fn(this);
		};
		return list;	
	};
})(this,document);