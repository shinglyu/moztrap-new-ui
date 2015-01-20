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
			getSuggestions : self.onGetSuggestions
		});

		self._suggestions = null;
	};

	p.load = function(query)
	{
		var self         = this,
			dataCallback = self.opts(OPT_DATA_CALLBACK) || function(query) { return { q : query } },
			opts
			;

		opts = $.extend(true,
			{
        url     : "http://moztrap.mozilla.org/api/v1/suite/?limit=0",
				data    : dataCallback(query),
        //TODO: support different response type
				success : function(data) { self.onComplete(data, query) },
				error   : function(jqXHR, message) { console.error(message, query) }
			}, 
			self.opts('ajax')
		);
    
    //TODO: initiate multiple call to all REST APIs
		$.jsonp(opts); //TODO: maybe change this with jsonp?
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
      //TODO: do necessary parsing and filtering here
      if (data.hasOwnProperty('meta')) {
        data = data.objects.map(d => "suite:\"" + d.name + '"');
      }
			self._suggestions = data;
			result = self.itemManager().filter(data, query);
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
		var self        = this,
			suggestions = self._suggestions,
			query       = (data || {}).query || ''
			;

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
})(jQuery);
