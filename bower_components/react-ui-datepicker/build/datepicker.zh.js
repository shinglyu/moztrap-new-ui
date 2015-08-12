/**
 * react-ui-datepicker v0.1.0 A flexible datepicker component in Bootstrap style using Facebook React.
 * Repository git@github.com:WJsjtu/react-datepicker.git
 * Homepage http://wjsjtu.github.io/react-datepicker/
 * Copyright 2015 王健（Jason Wang）
 * Licensed under the MIT License
 */

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	__webpack_require__(2);

	var Month = __webpack_require__(3);

	var clearTime = function clearTime(date) {
		var daySec = 86400000,
		    time;
		if (typeof date == "number") {
			time = parseInt(date / daySec) * daySec;
		} else if (date instanceof Date) {
			time = parseInt(date.getTime() / daySec) * daySec;
		} else {
			if (true) {
				console.log(date);
				throw new TypeError("Function clearTime require Date or number args");
			}
		}
		var result = new Date();
		result.setTime(time);
		return result;
	};

	var dateFormat = __webpack_require__(4);

	/**
	*
	* props: active current focused rule preserve format onSelect
	**/

	window.Datepicker = React.createClass({
		displayName: "Datepicker",

		getDefaultProps: function getDefaultProps() {
			return {};
		},
		getInitialState: function getInitialState() {
			var propActive = this.props.active,
			    propCurrent = this.props.current || this.props.active || new Date();
			if (propActive) {
				propActive = clearTime(propActive);
			}
			propCurrent = clearTime(propCurrent);
			return {
				active: propActive,
				current: propCurrent,
				focused: this.props.focused,
				panel: 1
			};
		},
		componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
			var newActive = nextProps.active,
			    currActive = this.state.active,
			    newCurrent = nextProps.current || currActive || new Date(),
			    obj = {};
			if (newActive) {
				obj.active = clearTime(newActive);
			}
			obj.current = clearTime(newCurrent);
			this.setState(obj);
		},
		componentDidMount: function componentDidMount() {
			if (this.props.focused) {
				React.findDOMNode(this.refs.input).focus();
			}
		},
		events: {
			day: __webpack_require__(5),
			month: __webpack_require__(1),
			year: __webpack_require__(6)
		},
		isEnter: false,
		onFocus: function onFocus() {
			if (!this.state.focused) {
				this.setState({
					focused: true
				});
			}
		},
		onBlur: function onBlur() {
			var self = this;
			if (!self.isEnter) {
				var obj = {
					focused: false
				};
				if (!self.props.preserve) {
					obj.panel = 1;
					obj.current = self.state.active || new Date();
				}
				self.setState(obj);
			}
		},
		onMouseEvent: function onMouseEvent(isIn, event) {
			this.isEnter = isIn;
		},
		onClick: function onClick() {
			React.findDOMNode(this.refs.input).focus();
			this.setState({
				focused: true
			});
		},
		render: function render() {

			var func,
			    self = this,
			    stateArgs = self.state;
			if (stateArgs.panel == 1) {
				func = __webpack_require__(7);
			} else if (stateArgs.panel == 2) {
				func = __webpack_require__(9);
			} else if (stateArgs.panel == 3) {
				func = __webpack_require__(10);
			}

			var format = self.props.format || function (date, fmt) {
				return fmt(date, "mm/dd/yyyy");
			};

			var inline = func.bind(self, Month.prototype.parse(stateArgs.current))(),
			    position = +self.props.position,
			    input = React.createElement("input", _extends({}, this.props, { type: "text", key: 0, ref: "input",
				className: "form-control",
				value: format(stateArgs.active, dateFormat),
				onFocus: self.onFocus,
				onBlur: self.onBlur })),
			    style = {};

			if (!(position < 7 || position >= 0)) {
				position = 5;
			}
			position = parseInt(position);

			if (position % 3 == 2) {
				style.left = 0;
			} else if (position % 3 == 0) {
				style.right = 0;
			} else if (position) {
				style.left = "50%";
				style.marginLeft = -107;
			}

			if (position == 0) {
				return React.createElement(
					"div",
					{ className: "datepicker datepicker-inline" },
					inline
				);
			} else {
				var datepicker = React.createElement(
					"div",
					{ key: 1, className: "datepicker datepicker-dropdown", style: style },
					inline
				);
				if (position < 4) {
					style.bottom = 36;
				} else {
					style.top = 36;
				}
				var content = stateArgs.focused ? [input, datepicker] : [input];
				return React.createElement(
					"div",
					{ style: { position: "relative" },
						onMouseEnter: self.onMouseEvent.bind(self, true),
						onMouseLeave: self.onMouseEvent.bind(self, false),
						onClick: self.onClick },
					content
				);
			}
		}

	});

	Datepicker.position = {
		INLINE: 0,
		TOP: {
			AUTO: 1,
			LEFT: 2,
			RIGHT: 3
		},
		BOTTOM: {
			AUTO: 4,
			LEFT: 5,
			RIGHT: 6
		}
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
		select: function(month, event){
			var current = this.state.current;
			current.setMonth(month);
			this.setState({
				panel: 1,
				current: current
			});
		},
		year: function(year, event){
			this.setState({
				panel: 3
			});
		},
		move: function(year, event){
			var current = this.state.current;
			current.setFullYear(year);
			this.setState({
				current: current
			});
		},
		wheel: function(year, deltaMode){
	    	deltaMode.preventDefault();
	    	var current = this.state.current;
	    	current.setFullYear(year + (deltaMode.deltaY < 0 ? 1 : -1));
	    	this.setState({
	    		current: current
	    	});
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	if (!Function.prototype.bind) {
	    Function.prototype.bind = function(oThis) {
	        if (typeof this !== 'function' && (true)) {
	            // closest thing possible to the ECMAScript 5
	            // internal IsCallable function
	            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	        }

	        var aArgs   = Array.prototype.slice.call(arguments, 1),
	            fToBind = this,
	            fNOP    = function() {},
	            fBound  = function() {
	                return fToBind.apply(this instanceof fNOP
	                    ? this
	                    : oThis,
	                    aArgs.concat(Array.prototype.slice.call(arguments)));
	            };
	    
	        fNOP.prototype = this.prototype;
	        fBound.prototype = new fNOP();

	        return fBound;
	    };
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	function Month(year, month){
		var self = this;
		self.year = year;
		self.month = month;
		self.leap = ((month == 2) && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0));
		self.days = [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1][month] + 30 + self.leap;
	}

	var proto = Month.prototype;

	proto.next = function(){
		var self = this;
		if(self.month != 11){
			return new Month(self.year, self.month + 1);
		} else {
			return new Month(self.year + 1, 1);
		}
	};

	proto.prev = function(){
		var self = this;
		if(self.month != 0){
			return new Month(self.year, self.month - 1);
		} else {
			return new Month(self.year - 1, 11);
		}
	};

	proto.compare = function(monthObj){
		var self = this;
		if(self.year == monthObj.year){
			return self.month - monthObj.month;
		} else {
			return self.year - monthObj.year;
		}
	}

	proto.date = function(){
		var date = new Date;
		date.setFullYear(this.year);
		date.setMonth(this.month);
		date.setDate(1);
		return date;
	};

	proto.parse = function(date){
		return new Month(date.getFullYear(), date.getMonth());
	};

	module.exports = Month;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(date, fmt) {
		if(!(date instanceof Date)){
			return "";
		}
		var day = date.getDate(),
			month = date.getMonth() + 1,
			year = date.getFullYear()
			o = {
				"m+": month,
				"d+": day,
				"q+": Math.floor((month + 2) / 3)
			};
		if (/(y+)/.test(fmt)){
			fmt = fmt.replace(RegExp.$1, (year + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o){
			if(new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var dateFormat = __webpack_require__(4);

	module.exports = {
		select: function(dateObj, monthObj, event){
			var self = this;
			self.setState({
				active: dateObj,
				current: monthObj.date()
			});
			if(typeof self.props.onSelect == "function"){
				self.props.onSelect(dateObj, dateFormat);
			}
		},
		month: function(monthObj, event){
			this.setState({
				panel: 2
			});
		},
		move: function(monthObj, event){
			this.setState({
				current: monthObj.date()
			});
		},
		wheel: function(monthObj, deltaMode){
	    	deltaMode.preventDefault();
	    	this.setState({
	    		current: (deltaMode.deltaY < 0 ? monthObj.next() : monthObj.prev()).date()
	    	});
	    }
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
		select: function(year, event){
			var current = this.state.current;
			current.setFullYear(year);
			this.setState({
				panel: 2,
				current: current
			});
		},
		move: function(year, event){
			var current = this.state.current;
			current.setFullYear(year);
			this.setState({
				current: current
			});
		},
		wheel: function(year, deltaMode){
	    	deltaMode.preventDefault();
	    	var current = this.state.current;
	    	current.setFullYear(year + (deltaMode.deltaY < 0 ? 1 : -1));
	    	this.setState({
	    		current: current
	    	});
	    }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// import language file
	"use strict";

	var locales = __webpack_require__(8);

	// import Month class
	var Month = __webpack_require__(3);

	var dateFormat = __webpack_require__(4);

	module.exports = function (currMonth) {

		/**
	 *
	 * this refers to this in React Components
	 * date refers to the picker panel which the date is in
	 * onSwitch is a event handler to go to month select panel
	 *
	 **/
		var instance = this;

		var rule = instance.props.rule;

		if (typeof rule != "function") {
			rule = undefined;
		}

		var prevMonth = currMonth.prev(),
		    nextMonth = currMonth.next();

		var prevDays = currMonth.date().getDay();

		// add a row before this month when the first day of this month is Sunday
		if (!prevDays) {
			prevDays = 7;
		}

		var daysArr = [],
		    dayDate,
		    className,
		    validate;

		for (var i = 0; i < prevDays; i++) {
			dayDate = prevMonth.date();
			dayDate.setDate(prevMonth.days - prevDays + 1 + i);
			validate = !rule || rule(dayDate, dateFormat) !== false;
			className = (validate ? "day" : "day disabled") + " old";
			daysArr.push([dayDate, className, validate, prevMonth]);
		}

		for (var i = 0; i < currMonth.days; i++) {
			dayDate = currMonth.date();
			dayDate.setDate(i + 1);
			validate = !rule || rule(dayDate, dateFormat) !== false;
			className = validate ? "day" : "day disabled";
			daysArr.push([dayDate, className, validate, currMonth]);
		}

		for (var i = 0; i < 42 - prevDays - currMonth.days; i++) {
			dayDate = nextMonth.date();
			dayDate.setDate(i + 1);
			validate = !rule || rule(dayDate, dateFormat) !== false;
			className = (validate ? "day" : "day disabled") + " new";
			daysArr.push([dayDate, className, validate, nextMonth]);
		}

		var addSpecialDay = function addSpecialDay(date, className) {
			if (!date) {
				return;
			}
			var month = Month.prototype.parse(date),
			    _date = date.getDate();
			if (!month.compare(prevMonth)) {
				if (_date >= prevMonth.days - prevDays + 1) {
					daysArr[_date - prevMonth.days + prevDays - 1][1] += className;
				}
			} else if (!month.compare(currMonth)) {
				daysArr[prevDays + _date - 1][1] += className;
			} else if (!month.compare(nextMonth)) {
				if (_date < 42 - prevDays - currMonth.days) {
					daysArr[prevDays + currMonth.days + _date - 1][1] += className;
				}
			}
		};
		addSpecialDay(new Date(), " today");
		addSpecialDay(instance.state.active, " active");

		//according to the usage day events should implement "select[dateObj, monthObj]", "year[year]", "go[monthObj]" events
		var events = instance.events.day;

		var eventBinder = function eventBinder(name, arg1, arg2) {
			return arg2 ? events[name].bind(instance, arg1, arg2) : events[name].bind(instance, arg1);
		};

		var rows = [],
		    row,
		    item,
		    className;
		for (var i = 0; i < 6; i++) {
			row = [];
			for (var j = 0; j < 7; j++) {
				item = daysArr[7 * i + j];
				row.push(item[2] ? React.createElement(
					"td",
					{ key: j, className: item[1], onClick: eventBinder("select", item[0], item[3]) },
					item[0].getDate()
				) : React.createElement(
					"td",
					{ key: j, className: item[1] },
					item[0].getDate()
				));
			}
			rows.push(React.createElement(
				"tr",
				{ key: i },
				row
			));
		}

		var tbody = React.createElement(
			"tbody",
			{ onWheel: eventBinder("wheel", currMonth) },
			rows
		);

		var thead = React.createElement(
			"thead",
			null,
			React.createElement(
				"tr",
				null,
				React.createElement(
					"th",
					{ className: "prev", onClick: eventBinder("move", prevMonth) },
					"«"
				),
				React.createElement(
					"th",
					{ colSpan: "5", className: "datepicker-switch", onClick: eventBinder("month", currMonth) },
					locales.month[currMonth.month] + " " + currMonth.year
				),
				React.createElement(
					"th",
					{ className: "next", onClick: eventBinder("move", nextMonth) },
					"»"
				)
			),
			React.createElement(
				"tr",
				null,
				locales.week.map(function (ele, index) {
					return React.createElement(
						"th",
						{ key: index, className: "dow" },
						ele
					);
				})
			)
		);

		return React.createElement(
			"div",
			{ className: "datepicker-days", style: { display: "block" } },
			React.createElement(
				"table",
				{ className: "table" },
				thead,
				tbody
			)
		);
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = {
		week: ["日", "一", "二", "三", "四", "五", "六"],
		month: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"].map(function(ele){ return ele + "月"; })
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// import language file
	"use strict";

	var locales = __webpack_require__(8);

	// import Month class
	var Month = __webpack_require__(3);

	module.exports = function (currMonth) {

		/**
	 *
	 * this refers to this in React Components
	 * date refers to the picker panel which the date is in
	 * onSwitch is a event handler to go to month select panel
	 *
	 **/
		var instance = this;

		//according to the usage day events should implement "select[dateObj, monthObj]", "year[year]", "go[monthObj]" events
		var events = instance.events.month;

		var eventBinder = function eventBinder(name, arg1) {
			return events[name].bind(instance, arg1);
		};

		var thead = React.createElement(
			"thead",
			null,
			React.createElement(
				"tr",
				null,
				React.createElement(
					"th",
					{ className: "prev", onClick: eventBinder("move", currMonth.year - 1) },
					"«"
				),
				React.createElement(
					"th",
					{ colSpan: "5", className: "datepicker-switch", onClick: eventBinder("year", currMonth.year) },
					currMonth.year
				),
				React.createElement(
					"th",
					{ className: "next", onClick: eventBinder("move", currMonth.year + 1) },
					"»"
				)
			)
		);

		var spans = [];
		for (var i = 0; i < 12; i++) {
			spans.push([locales.month[i], "month"]);
		}

		var addSpecialMonth = function addSpecialMonth(date, className) {
			if (!date) {
				return;
			}
			var month = Month.prototype.parse(date);
			if (month.year == currMonth.year) {
				spans[month.month][1] += className;
			}
		};
		addSpecialMonth(new Date(), " today");
		addSpecialMonth(instance.state.active, " active");

		var tbody = React.createElement(
			"tbody",
			{ onWheel: eventBinder("wheel", currMonth.year) },
			React.createElement(
				"tr",
				null,
				React.createElement(
					"td",
					{ colSpan: "7" },
					spans.map(function (ele, index) {
						return React.createElement(
							"span",
							{ className: ele[1], key: index, onClick: eventBinder("select", index) },
							ele[0]
						);
					})
				)
			)
		);

		return React.createElement(
			"div",
			{ className: "datepicker-days", style: { display: "block" } },
			React.createElement(
				"table",
				{ className: "table" },
				thead,
				tbody
			)
		);
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	// import Month class
	"use strict";

	var Month = __webpack_require__(3);

	module.exports = function (currMonth) {

		/**
	 *
	 * this refers to this in React Components
	 * date refers to the picker panel which the date is in
	 * onSwitch is a event handler to go to month select panel
	 *
	 **/
		var instance = this;

		//according to the usage day events should implement "select[dateObj, monthObj]", "year[year]", "go[monthObj]" events
		var events = instance.events.year;

		var eventBinder = function eventBinder(name, arg1) {
			return events[name].bind(instance, arg1);
		};

		var startYear = parseInt(currMonth.year / 10) * 10 - 1;

		var thead = React.createElement(
			"thead",
			null,
			React.createElement(
				"tr",
				null,
				React.createElement(
					"th",
					{ className: "prev", onClick: eventBinder("move", startYear - 9) },
					"«"
				),
				React.createElement(
					"th",
					{ colSpan: "5", className: "datepicker-switch" },
					startYear + 1,
					"-",
					startYear + 10
				),
				React.createElement(
					"th",
					{ className: "next", onClick: eventBinder("move", startYear + 11) },
					"»"
				)
			)
		);

		var spans = [];
		for (var i = 0; i < 12; i++) {
			spans.push([startYear + i, "year"]);
		}
		spans[0][1] += " old";
		spans[11][1] += " new";

		var addSpecialYear = function addSpecialYear(date, className) {
			if (!date) {
				return;
			}
			var month = Month.prototype.parse(date);
			if (startYear <= month.year && startYear + 11 >= month.year) {
				spans[month.year - startYear][1] += className;
			}
		};
		addSpecialYear(new Date(), " today");
		addSpecialYear(instance.state.active, " active");

		var tbody = React.createElement(
			"tbody",
			{ onWheel: eventBinder("wheel", currMonth.year) },
			React.createElement(
				"tr",
				null,
				React.createElement(
					"td",
					{ colSpan: "7" },
					spans.map(function (ele, index) {
						return React.createElement(
							"span",
							{ className: ele[1], key: index, onClick: eventBinder("select", ele[0]) },
							ele[0]
						);
					})
				)
			)
		);

		return React.createElement(
			"div",
			{ className: "datepicker-days", style: { display: "block" } },
			React.createElement(
				"table",
				{ className: "table" },
				thead,
				tbody
			)
		);
	};

/***/ }
/******/ ]);