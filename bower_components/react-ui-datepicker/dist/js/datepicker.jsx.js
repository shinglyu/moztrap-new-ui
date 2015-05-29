(function(React, window){var __ReactCreateElement = React.createElement;
var _Datepicker = window.Datepicker,
DateItem = function(date){
	if(!(date instanceof Date)){
		date = new Date;
	}
	var self = this; self.init = {};
	self.init.y = self.y = date.getFullYear();
	self.init.m = self.m = date.getMonth() + 1;
	self.init.d = self.d = date.getDate();
}, DateItemPrototype = DateItem.prototype;
DateItemPrototype.toDate = function(){
	var self = this;
	return new Date(self.y, self.m - 1, self.d);
};
DateItemPrototype.monthDays = [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1];
DateItemPrototype.nextMonth = function(){
	var self = this;
	if(self.m == 12){
		self.y += 1;
		self.m = 1;
	} else {
		self.m += 1;
	}
	self.d = 1;
	return self;
};
DateItemPrototype.prevMonth = function(){
	var self = this;
	if(self.m == 1){
		self.y -= 1;
		self.m = 12;
	} else {
		self.m -= 1;
	}
	self.d = 1;
	return self;
};
DateItemPrototype.getMonthDays = function(){
	var self = this, leap = (self.m == 2) && (self.y % 4 == 0 && self.y % 100!=0 || self.y % 400 == 0) ? 1 : 0;
    return self.monthDays[self.m - 1] + 30 + leap;
};
DateItemPrototype.format = function(fmt) {
	var self = this, o = {
		"m+": self.m,
		"d+": self.d,
		"q+": Math.floor((self.m + 2) / 3)
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (self.y + "").substr(4 - RegExp.$1.length));
	for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};


var monthDays = [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
	titleLang ={
		"zh": {
			dayTitle: ["一","二","三","四","五","六","日"],
			monthTitle: ["一","二","三","四","五","六","七","八","九","十","十一","十二"].map(function(item){ return item + "月";}),
			dateTitle: function(y, m, d){
				return y + " 年 " + m + " 月";
			}
		}
	},
	dayTitle = function(year, month){
		return year + " 年 " + month + " 月";
	},
	classPreffix = "c",
	itemPreffix = "i",
	classPrefix = "am-datepicker-",
	dayClassSet = {
		BASIC: classPrefix + "day",
		ACTIVE: classPrefix + "day am-active",
		DISABLED: classPrefix + "day am-disabled",
		CURRENT: classPrefix + "day am-current"
	},
	monthClassSet = yearClassSet = {
		BASIC: "",
		ACTIVE: "am-active",
		CURRENT: "am-current",
		DISABLED: "am-disabled"
	},
    getDayCaculate = function(props){
    	var from = props.from, to = props.to, current = props.current,
			i = 0, j = 0, k = 0,  index = 0, 
			dayList = {}, active,
			temp = current.toDate(),
	   		lastCnt = (new DateItem(temp)).prevMonth().getMonthDays(),
	   		nextCnt = (new DateItem(temp)).nextMonth().getMonthDays(),
	   		currCnt = current.getMonthDays();
	   	temp.setDate(1);
	   	var dayOfWeek = (temp.getDay() + 6) % 7;
	   	for(; i < dayOfWeek; i++, index++) {
	   		dayList[classPreffix + index] = -1;
	   		dayList[itemPreffix + index] = lastCnt - dayOfWeek + 1 + i;
		}
	   	for(; j < currCnt; j++, index++) {
	   		dayList[classPreffix + index] = 0;
	   		dayList[itemPreffix + index] = j + 1;
	   	}
	   	for(; k < 42 - currCnt - dayOfWeek; k++, index++) {
	   		dayList[classPreffix + index] = -1;
	   		dayList[itemPreffix + index] = k + 1;
	   	}

	   	if(current.y == current.init.y && current.m == current.init.m){
	   		dayList[classPreffix + (dayOfWeek + current.init.d - 1)] = 2;
	   	}
	   	active = dayOfWeek + current.d - 1;
	   	dayList[classPreffix + active] = 1;
	   	return {
	   		active: active,
	   		obj: dayList
	   	};
    },
    getMonthCaculate = function(props){
    	var from = props.from, to = props.to, current = props.current,
    		i = 0,
    		monthList = {}, active;

    	for(; i < 12; i++){
    		monthList[classPreffix + i] = 0;
    		monthList[itemPreffix + i] = i + 1;
    	}
    	if(current.y == current.init.y){
	   		monthList[classPreffix + (current.init.m - 1)] = 2;
	   	}
	   	active = current.m - 1;
	   	monthList[classPreffix + active] = 1;
    	return {
	   		active: active,
	   		obj: monthList
	   	};
    },
    getYearCaculate = function(props){
    	var from = props.from, to = props.to, current = props.current,
    		i = 0,
    		yearList = {}, active,
    		year = current.y, year12 = year % 12, start = year - year12;

    	for(; i < 12; i++){
    		yearList[classPreffix + i] = 0;
    		yearList[itemPreffix + i] = start + i;
    	}
    	if(current.init.y - current.init.y % 12 == start){
    		yearList[classPreffix + current.init.y % 12] = 2;
    	} 
    	active = year12;
    	yearList[classPreffix + active] = 1;
    	return {
	   		active: active,
	   		obj: yearList
	   	};
    },
    getClassSet = function(value, set, onClick){
    	var className = null, _onClick = onClick;
    	switch (value){
		  	case -1: className = set.DISABLED; _onClick = null; break;
		  	case 0: className = set.BASIC; break;
		  	case 1: className = set.ACTIVE; break;
		  	case 2: className = set.CURRENT; break;
		}
		return [className, _onClick];
    },
    tbodyMixin = {
		active: null,
		getInitialState: function() {
			var self = this, result = self.caculate(self.props);
			self.active = result.active;
	    	return result.obj;
		},
		componentWillReceiveProps: function(nextProps){
			var self = this, result = self.caculate(nextProps);
			self.active = result.active;
			self.setState(result.obj);
		},
		onClick: function(name, event){
			event.stopPropagation();
			var self = this, _name = self.active, temp = {};
			if(_name !== null && _name !== name && self.state[classPreffix + _name] === 1){
				temp[classPreffix + _name] = 0;
			}
			if(_name !== name){
				temp[classPreffix + name] = self.state[classPreffix + name] == 2 ? 2 : 1;
				self.active = name;
				//self.setState(temp);
			}
			self.props.select(self.state[itemPreffix + name]);
		}
	},
	DatepickerDayTbody = React.createClass({displayName: "DatepickerDayTbody",
		mixins: [tbodyMixin],
		caculate: getDayCaculate,
		render: function(){
			var self = this, tbody = [];
		  	for(i = 0; i < 6; i++){
		  		var tr = [];
		  		for(j = 0; j < 7; j++){
		  			var name = 7 * i + j,
		  				temp = getClassSet( self.state[classPreffix + name],
		  									dayClassSet,
		  									self.onClick.bind(self, name)
		  									);
		  			var className = temp[0], onClick = temp[1];
		  			tr.push(__ReactCreateElement("td", {key: name, className: className, onClick: onClick}, self.state[itemPreffix + name]));
		  		}
		  		tbody.push(__ReactCreateElement("tr", {key: i}, tr));
		    }
			return __ReactCreateElement("tbody", null, tbody);
    	}
	}),
	DatepickerMonthTbody = React.createClass({displayName: "DatepickerMonthTbody",
		mixins: [tbodyMixin],
		caculate: getMonthCaculate,
		render: function(){
			var self = this, spans = [], i = 0, className, onClick, temp, _lang = titleLang[self.props.lang] || titleLang["zh"];
			for(; i < 12; i++){
				temp = getClassSet( self.state[classPreffix + i],
		  							monthClassSet,
		  							self.onClick.bind(self, i)
		  						);
		  		className = temp[0], onClick = temp[1];
		  		spans.push(__ReactCreateElement("span", {key: "m-" + i, className: className, onClick: onClick}, _lang.monthTitle[self.state[itemPreffix + i] - 1]));
			}
			return __ReactCreateElement("tbody", null, __ReactCreateElement("tr", null, __ReactCreateElement("td", {colSpan: "7"}, spans)));
		}
	}),
	DatepickerYearTbody = React.createClass({displayName: "DatepickerYearTbody",
		mixins: [tbodyMixin],
		caculate: getYearCaculate,
		render: function(){
			var self = this, spans = [], i = 0, className, onClick, temp;
			for(; i < 12; i++){
				temp = getClassSet( self.state[classPreffix + i],
		  							yearClassSet,
		  							self.onClick.bind(self, i)
		  						);
		  		className = temp[0], onClick = temp[1];
		  		spans.push(__ReactCreateElement("span", {key: "y-" + i, className: className, onClick: onClick}, self.state[itemPreffix + i]));
			}
			return __ReactCreateElement("tbody", null, __ReactCreateElement("tr", null, __ReactCreateElement("td", {colSpan: "7"}, spans)));
		}
	}),
	DatepickerPanel = React.createClass({displayName: "DatepickerPanel",
		getDefaultProps: function() {
		    return {
		    	from: null,
		    	to: null,
		    	current: new DateItem,
		    	select: null
		    };
		},
		getInitialState: function(){
			var prop = this.props;
			return {
				panel: prop.panel,
				current: prop.current
			};
		},
		componentWillReceiveProps: function(nextProps){
			this.setState({
				current: nextProps.current
			});
		},
    	changePanel: function(){
    		var self = this;
			this.setState({
				panel: self.state.panel + 1
			});
    	},
    	selectDay: function(day){
    		var self = this, current = self.state.current;
    		current.d = day;
    		self.setState({
    			current: current
    		});
    		self.props.select(current);
    	},
    	selectPanel: function(panel, data){
    		var self = this, current = self.state.current;
    		if(panel == 1){
    			current.m = data;
    			if(data != current.init.m){
    				current.d = 1;
    			}
    		} else {
    			current.y = data;
    			if(data != current.init.y){
    				current.d = 1;
    			}
    		}
			this.setState({
				current: current,
				panel: panel
			});
    	},
    	onWheel: function(deltaMode){
    		deltaMode.preventDefault();
    		this.goIcon(deltaMode.deltaY > 0 ? 1 : -1);
    	},
		goIcon: function(action, event){
    		event && event.stopPropagation();
    		var self = this; stateArgs = self.state, propArgs = self.props;
    		if(stateArgs.panel == 1){
		   		action > 0 ? stateArgs.current.nextMonth() : stateArgs.current.prevMonth();
		   	} else if(stateArgs.panel == 2){
		   		stateArgs.current.y += action > 0 ? 1 : -1;
		   	} else if(stateArgs.panel == 3){
		   		stateArgs.current.y += action > 0 ? 12 : -12;
		   	}
		   	self.setState({
		   		current: stateArgs.current
		   	});
    	},
		render: function() {
			var self = this; stateArgs = self.state, propArgs = self.props, _lang = titleLang[propArgs.lang] || titleLang["zh"],
				table = null,
				tableClass = classPrefix + "table",
				headClass = classPrefix + "header",
				switchClass = classPrefix + "switch",
				selectClass = classPrefix + "select",
				prevTh = __ReactCreateElement("th", {className: classPrefix + "prev"}, 
							__ReactCreateElement("i", {className: classPrefix + "prev-icon", onClick: self.goIcon.bind(self, 1)})
						),
				nextTh = __ReactCreateElement("th", {className: classPrefix + "next"}, 
							__ReactCreateElement("i", {className: classPrefix + "next-icon", onClick: self.goIcon.bind(self, -1)})
						);
			if(stateArgs.panel == 1){
				table = __ReactCreateElement("table", {className: tableClass}, 
							__ReactCreateElement("thead", null, 
									__ReactCreateElement("tr", {className: headClass}, prevTh, 
										__ReactCreateElement("th", {colSpan: "5", className: switchClass}, 
											__ReactCreateElement("div", {className: selectClass, onClick: self.changePanel}, 
												_lang.dateTitle(stateArgs.current.y, stateArgs.current.m, stateArgs.d)
											)
										), nextTh
									), 
									__ReactCreateElement("tr", null, 
										_lang.dayTitle.map(function(day, index){
										    return __ReactCreateElement("th", {key: "th-"+ index, className: classPrefix + "dow"}, day)
										})
									)
							), 
		  					__ReactCreateElement(DatepickerDayTbody, {from: propArgs.from, 
												to: propArgs.to, 
												current: stateArgs.current, 
												select: self.selectDay})
		  				);
			} else if(stateArgs.panel == 2){
				table = __ReactCreateElement("table", {className: tableClass}, 
							__ReactCreateElement("thead", null, 
								__ReactCreateElement("tr", {className: headClass}, prevTh, 
									__ReactCreateElement("th", {colSpan: "5", className: switchClass}, 
										__ReactCreateElement("div", {className: selectClass, onClick: self.changePanel}, stateArgs.current.y)
									), nextTh
								)
							), 
							__ReactCreateElement(DatepickerMonthTbody, {from: propArgs.from, 
												  to: propArgs.to, 
												  current: stateArgs.current, 
												  lang: propArgs.lang, 
												  select: self.selectPanel.bind(self, 1)})
						);
			} else if(stateArgs.panel == 3){
				var start = stateArgs.current.y - stateArgs.current.y % 10;
				table = __ReactCreateElement("table", {className: tableClass}, 
							__ReactCreateElement("thead", null, 
								__ReactCreateElement("tr", {className: headClass}, prevTh, 
									__ReactCreateElement("th", {colSpan: "5", className: switchClass}, 
										__ReactCreateElement("div", {className: selectClass}, start, "-", start + 11)
									), nextTh
								)
							), 
							__ReactCreateElement(DatepickerYearTbody, {from: propArgs.from, 
												 to: propArgs.to, 
												 current: stateArgs.current, 
												 select: self.selectPanel.bind(self, 2)})
						);
			}
		    return __ReactCreateElement("div", {className: "am-datepicker", style: {display: "block"}, onWheel: self.onWheel}, 
			    		__ReactCreateElement("div", {className: classPrefix + "days", style: {display: "block"}}, table)
			    	);
		 }
    }),
	DatepickerInput = React.createClass({displayName: "DatepickerInput",
		/*
		propTypes: {
			from: React.PropTypes.instanceOf(Date),
			to: React.PropTypes.instanceOf(Date),
			current: React.PropTypes.instanceOf(Date),
			format: React.PropTypes.string,
			onSelect: React.PropTypes.func,
			lang: React.PropTypes.string,
			panel: React.PropTypes.number
		},
		*/
		getDefaultProps: function() {
		    return {
		    	from: null,
		    	to: null,
		    	current: new DateItem,
		    	format: "yyyy-mm-dd",
		    	onSelect: null,
		    	lang: "zh",
		    	panel: 1
		    };
		},
		getInitialState: function(){
			var props = this.props;
			return {
				visible: false,
				current: new DateItem(props.current)
			};
		},
		componentWillReceiveProps: function(nextProps){
			this.setState({
				visible: false,
				current: nextProps.current
			});
		},
		onClick: function(event){
			event.stopPropagation();
			var self = this;
			this.setState({visible: !self.state.visible});
		},
		onSelect: function(current){
			var self = this, callBack = self.props.onSelect;
			typeof callBack === "function" && callBack(current.toDate());
			self.setState({
				visible: false,
				current: current
			});
		},
		render: function(){
			var self = this, stateArgs = self.state, propArgs = self.props;
			return  __ReactCreateElement("div", null, 
					  __ReactCreateElement("input", {type: "text", 
					  		 className: classPrefix + "input-field", 
					  		 value: stateArgs.current.format(propArgs.format), 
					  		 onClick: self.onClick}), 
					  __ReactCreateElement("div", {style: {display: stateArgs.visible ? null : "none"}}, 
					  	__ReactCreateElement(DatepickerPanel, {from: propArgs.from, 
					  					 to: propArgs.to, 
					  					 panel: propArgs.panel, 
					  					 current: stateArgs.current, 
					  					 lang: propArgs.lang, 
					  					 select: self.onSelect})
					  )
					);
		}
	});

window.Datepicker = DatepickerInput;
DatepickerInput.noConflict = function(){
	window.Datepicker = _Datepicker;
	return DatepickerInput;
};
DatepickerInput.addLang = function(name, lang){
	titleLang[name] = lang;
};})(React, window);