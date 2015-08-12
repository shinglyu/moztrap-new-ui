/* jshint node: true */
'use strict';

var es = require('event-stream');
var gutil = require('gulp-util');
var UglifyJS = require("uglify-js");

var reactUglifyPlugin = function(replaceWord, props) {
	replaceWord = replaceWord || '__react_create_element';
	var rawWord = "React.createElement";

	return es.map(function(file, cb){

		var contentStr = String(file.contents).replace(new RegExp(rawWord, "g"), replaceWord);

		var otherVars = [], otherVarsStr = "";

		props.forEach(function(prop){
			contentStr = contentStr.replace(new RegExp("[.]" + prop, "g"), "[__prop_" + prop + "__]");
			otherVars.push("__prop_" + prop + "__='" + prop + "'");
		});
		
		if(otherVars.length){
			otherVarsStr = "var " + otherVars.join(",") + ";";
		}

		//contentStr = contentStr.replace(new RegExp("\"use strict\";", "g"), "");


		var fileStr = "(function(React){var " + replaceWord + " = " + rawWord + ";" + otherVarsStr
			+ contentStr
			+ "})(React);";

		fileStr = UglifyJS.minify(fileStr, {fromString: true, mangle: true}).code;
		
		file.contents = new Buffer(fileStr),
		cb(null, file);
	});
};

module.exports = reactUglifyPlugin;