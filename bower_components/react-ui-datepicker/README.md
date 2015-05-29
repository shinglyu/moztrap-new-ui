# react-datepicker
A datepicker component written in React.js

![](http://wjsjtu.github.io/react-datepicker/demo.png)

### Get Started

####install
```
bower install react-ui-datepicker
```

####build the source code
```
bower install
npm install
grunt
```

This component is based on ReactJS.
The website of React introduced react-tools for nodejs.
To work with grunt, I did ([wjsjtu-reactjs](https://github.com/WJsjtu/wjsjtu-reactjs)) ,a grunt task, myself.

If yoo want to know more about it, click the link above.

####online demo

[See demos here.](http://wjsjtu.github.io/react-datepicker/)


###Usage
####Create DOM like:
```html
<div class="demo">
	<h1>example1</h1>
	<div id="example1"></div>
</div>
<div class="demo">
	<h1>example2</h1>
	<div id="example2"></div>
</div>
<div class="demo">
	<h1>example3</h1>
	<div id="example3"></div>
</div>
```
####Javacript code:

```javascript
//to avoid conflict
	var myDatepicker = Datepicker.noConflict();
  
  React.render(React.createElement(myDatepicker, {
		current: null,
		onSelect: function(date) {
			console.log(date);
		}
	}), document.getElementById('example1'));
	
	var test = new Date(2008, 4, 12);

	React.render(React.createElement(myDatepicker, {
		current: test,
		panel: 3,
		onSelect: function(date) {
			console.log(date);
		}
	}), document.getElementById('example2'));

	var weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
		yearMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	myDatepicker.addLang("en", {
		dayTitle: weekDays,
		monthTitle: yearMonths,
		dateTitle: function(year, month, day){
			return year + " " + yearMonths[month - 1];
		}
	});

	React.render(React.createElement(myDatepicker, {
		current: null,
		panel: 2,
		lang: "en",
		format: "m/dd/yyyy",
		onSelect: function(date) {
		  console.log(date);
		}
	}), document.getElementById('example3'));
```

### Options

#### current

Type: `Date` 

Default: `new Date`

Set the start date of this datepicker.

#### panel

Type: `Number`

Default: `1`

Panel `1` refers to the date panel.`2` refers to month panel like `example3`. `3` refers to year panel like `example2` .

#### lang

Type: `String`

Default: `"zh"`

Set the language of this datepicker.

#### format

Type: `String`

Default: `"yyyy-dd-mm"`

Set the format of value of input.

#### onSelect

Type: `Function(Date)`

Default: `null`

This sets the callback when you select a day. And the argument of this callback is a `Date` object.

### Methods

#### Datepicker

```javascript
React.render(React.createElement(Datepicker, {
		current: null,
		panel: 1,
		lang: "en",
		onSelect: function(date) {
		  console.log(date);
		}
	}), document.getElementById('example3'));
```

It is easy to understand in JSX:

```javascript
React.render(<Datepicker current={null}
                         panel={1}
                         lang={"en"} 
                         onSelect={function(date) {console.log(date);}}
             />,
document.getElementById('example3'));
```

#### addLang

arguments `String` name, `{ dayTitle: Array, monthTitle: Array, dateTitle: String or Function }`

Note: `"zh"` is default name for lang, and the Object is configured in code.If you want to replace it. You can override the `"zh"`'s object.

For details, see code of `example3`.

#### noConflict

To avoid the confliction that caused by the same name as Datepicker.

###Todolist

Add props to set range of the date.

Set styleshhet apart.


###The MIT License (MIT)

Copyright (c) 2015 Jason Wang, contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
