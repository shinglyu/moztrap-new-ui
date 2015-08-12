/**
 * jQuery TextExt Plugin
 * http://textextjs.com
 *
 * @version 1.3.1
 * @copyright Copyright (C) 2011 Alex Gorbatchev. All rights reserved.
 * @license MIT License
 *
 * This is a modified plugin for MozTrap REST API
 */
(function($)
{
	function TextExtAjax() {};

	$.fn.textext.TextExtAjax = TextExtAjax;
	$.fn.textext.addPlugin('ajax', TextExtAjax);

	/*
	 * For mapping 'Modifier" to a correct Query name for MozTrap REST API
	 * TODO: 1. change 'status' to 3 default results (active/draft/disable)
	 */
	var searchTypeMapModifiers = {
		"caseversion" : {
			"name" : "caseversion",
		 	"tag" : "tag",
			"suite" : "suite",
			"product" : "product",
			"ver" : "productversion",
			"status" : "caseversion"
		},
		"suite" : {
			"name" : "suite",
			"product" : "product",
			"status" : "suite"
		},
	};

	var p = TextExtAjax.prototype,


		OPT_DATA_CALLBACK = 'ajax.data.callback',
		
		OPT_CACHE_RESULTS = 'ajax.cache.results',
		
		OPT_LOADING_DELAY = 'ajax.loading.delay',

		OPT_LOADING_MESSAGE = 'ajax.loading.message',

		OPT_TYPE_DELAY = 'ajax.type.delay',



		EVENT_SET_SUGGESTION = 'setSuggestions',

		EVENT_SHOW_DROPDOWN = 'showDropdown',

		TIMER_LOADING = 'loading',

		DEFAULT_OPTS = {
			ajax : {
				typeDelay      : 0.5,
				loadingMessage : 'Loading...',
				loadingDelay   : 0.5,
				cacheResults   : false,
				dataCallback   : null
			}
		}
		;
	p.init = function(core)
	{
		var self = this;

		self.baseInit(core, DEFAULT_OPTS);
		self.on({
			getSuggestions : self.onGetSuggestions,
			tagAdded : self.onTagAdded
		});

		/*
		 * use 'ajax.params' to pass required info when creating TextExt instance
		 * ------------------------------------------------------
		 * _suggestions: only save suggestions, no 'modifiers'
		 * _product: to get correct 'version'
	         * _searchType: to get correct REST API uri
		 * _modifier: get from current user input
   		 */
		self._suggestions = null;
		self._url = self._core._opts.ajax.params.url + "/api/v1/" || "http://moztrap.mozilla.org/api/v1/";
		self._product = self._core._opts.ajax.params.product || "";
		self._searchType = self._core._opts.ajax.params.searchType || "caseversion";
		self._listLimit = self._core._opts.ajax.params.listLimit || 20;
		self._modifier = null;
	};

	p.load = function(query)
	{
		var self = this,
		    dataCallback = self.opts(OPT_DATA_CALLBACK) || function(query) { return { q : query } },
		    opts,
		    url,
		    tmpURI = searchTypeMapModifiers[self._searchType][self._modifier] || "caseversion",
		    tmpQuery
		    ;

		//FIXME: if user does not input product, get unexpected results
		tmpQuery = (tmpURI === "productversion") ? "product__name__icontains=" + self._product + "&version__icontains" : "name__icontains";

		url = self._url + tmpURI + "/?" + tmpQuery + "=" + query + "&limit=" + self._listLimit;
		//console.log("get suggestion url: " + url);

		opts = $.extend(true,
			{
				url     : url,
				data    : dataCallback(query),
			        //TODO: support different response type
				success : function(data) { self.onComplete(data, query) },
				error   : function(jqXHR, message) { console.error(message, query) }
			}, 
			self.opts('ajax')
		);
	        //TODO: initiate multiple call to all REST APIs
		$.ajax(opts);
	};

	p.onComplete = function(data, query)
	{
		var self   = this,
			result = data
			;

		self.dontShowLoading();
		// If results are expected to be cached, then we store the original
		// data set and return the filtered one based on the original query.
		// That means we do filtering on the client side, instead of the
		// server side.
		if(self.opts(OPT_CACHE_RESULTS) == true)
		{
			self._suggestions = data;

			if (data.hasOwnProperty('meta')) {
			        data = data.objects.map(d => self._modifier + ":\"" + d[getAttributeByModifiers(self._modifier)] + '"');
		        }
			
			if(self._modifier === "status") {
				result = ["status:\"active\"", "status:\"draft\"", "status:\"disable\""];
			} else {
				result = self.itemManager().filter(data, query);
			}

			if (result.length == 0 || self._suggestions.meta.total_count == 0) { //FIXME: NOW, force to retrieve result 1 more time when no suggestion
				self._suggestions = null;
				self.on({
					getSuggestions : self.onGetSuggestions
				});
			}
		}

		self.trigger(EVENT_SET_SUGGESTION, { result : result });
	};

	p.dontShowLoading = function()
	{
		this.stopTimer(TIMER_LOADING);
	};

	p.showLoading = function()
	{
		var self = this;
		self.dontShowLoading();
		self.startTimer(
			TIMER_LOADING,
			self.opts(OPT_LOADING_DELAY),
			function()
			{
				self.trigger(EVENT_SHOW_DROPDOWN, function(autocomplete)
				{
					autocomplete.clearItems();
					var node = autocomplete.addDropdownItem(self.opts(OPT_LOADING_MESSAGE));
					node.addClass('text-loading');
				});
			}
		);
	};

	p.onGetSuggestions = function(e, data)
	{
		var self = this,
			suggestions = self._suggestions,
		        query = (data || {}).query || ''
			;

		/*
	   	 * 1. input format from user: 'modifier':'query string'
		 * 2. how to handle: remove leading/ending spaces & leading/ending quotation("|')
		 */
		if(query.indexOf(":") >= 0) {
			var tmpToken = query.split(":");
			if (tmpToken.length > 2) {
				for(var i=2; i<tmpToken.length; i++) {  // concat all words after 1st ':'
					tmpToken[1] = tmpToken[1] + ":" + tmpToken[i];
				}
			}

			tmpToken[0] = tmpToken[0].replace(/^\s+|\s+$/g, '').replace(/^["|']|["|']$/g, '').toLowerCase();
			//console.log("modifier: \'" + tmpToken[0] + "\'; query: \'" + tmpToken[1] + "\'");

			//make sure user input a legal modifier, otherwise provide default one
			if((typeof searchTypeMapModifiers[self._searchType][tmpToken[0]] != 'undefined') ? true : false) {

				if(!self._modifier) {
					self._modifier = tmpToken[0];
					query = tmpToken[1];
				} else if(self._modifier == tmpToken[0]) {
					query = tmpToken[1];
				} else {                                    // modifier changed, clear cached suggestions
					self._modifier = tmpToken[0];
					query = tmpToken[1];
					suggestions = null;
				}
			} else {
				//TODO: how to inform user?
				console.log("wrong modifier, use default modifier for suggestion");
				self._modifier = getDefaultModifier(self._searchType).toLowerCase();
				query = tmpToken[1];
				suggestions = null;
			}
		} else {
			var tmpToken = getDefaultModifier(self._searchType).toLowerCase();
			//previous one is not default, clear cached suggestions
			if(self._modifier != tmpToken) {
				self._modifier = tmpToken;
				suggestions = null;
			}
		}

		query = query.replace(/^\s+|\s+$/g, '').replace(/^["|']|["|']$/g, '');

		if(suggestions && self.opts(OPT_CACHE_RESULTS) === true)
			return self.onComplete(suggestions, query);

		self.startTimer(
			'ajax',
			self.opts(OPT_TYPE_DELAY),
			function()
			{
				self.showLoading();
				self.load(query);
			}
		);
	};

	/**
	 * Reacts to the `tagAdded` event to get a updated 'product', containing an array including new added tags' content
	 *
	 * TODO: currently, always set the latest input 'product'
	 */
	p.onTagAdded = function(e, data)
	{
		if(data) {
			for(var j=0; j<data.length; j++) {

				var tmpToken = data[j].split(":");
				tmpToken[0] = tmpToken[0].replace(/^\s+|\s+$/g, '').replace(/^["|']|["|']$/g, '').toLowerCase();

				if(tmpToken[0] === "product") {
					if (tmpToken.length > 2) {
						for(var i=2; i<tmpToken.length; i++) {  // concat all words after 1st ':'
							tmpToken[1] = tmpToken[1] + ":" + tmpToken[i];
						}
					}

					tmpToken[1] = tmpToken[1].replace(/^\s+|\s+$/g, '').replace(/^["|']|["|']$/g, '');
					this._product = tmpToken[1];
				}
			}
		}
	}

	function getDefaultModifier(searchType) {
		switch(searchType) {
			case "caseversion":
			case "suite":
			default:
				return "name";
		}
	}	

	function getAttributeByModifiers(modifiers) {
		switch(modifiers.toLowerCase()) {
			case "name":
			case "tag":
			case "suite":
			case "product":
				return "name";
			case "ver":
				return "version";
			case "status":
				return "status";
			default:
				return "unkown";
		}
	}
})(jQuery);
