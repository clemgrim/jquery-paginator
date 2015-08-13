(function ($) {
	'use strict';
	
	function PaginatePlugin ($el) {
		this.$el = $el;
	
		this.options = {};
		
		this.results = [];
		
		this._page = 1;
		
		/** Init pagination */
		this.init = function (options) {
			var self = this;
	
			// merge user options with default plugin options
			$.extend(this.options, $.fn.paginate.defaults, options, {
		        onPageClick: function (e, page) {
		        	e.preventDefault();
		        	self.drawPage(page);
		        	
		        	if ($.isFunction(self.options.onClick)) {
		        		self.options.onClick(page);
		        	}
		        },
		    });
	
			// wrap pagination if user want to show pagination count
			if (this.options.count) {
				this.$el.wrap('<div class="row pagination-wrapper"/>').before('<div class="col-md-5 pagination-count"/>');
				this.$el.addClass('col-md-7');
			}
	
			this.items = $(this.options.selector);
			
			// save plugin instance in data attribute
			this.$el.data('$el', this);
	    	this.pagine();
	    };
	    
	    /** Update pagination. Filter is a function that will be used with $.fn.filter to filter items to show */
	    this.pagine = function (filter) {
	    	var page = 1;
	    	
	    	// Try to detect if the current page is in the hash url
	    	if (location.hash) {
	    		var match = location.hash.match(/page-([0-9]+)/);
	    		
	    		if (match && match.length > 1) {
	    			page = match[1];
	    		}
	    	}
	    	
	    	// filter results
	    	if (typeof filter === 'function') {
	    		this.results = this.items.filter(filter);
	    	} else {
	    		this.results = this.items.filter(function () {
	    			var data = $(this).data('p_filtered');
	    			return data === true || data === undefined;
	    		});
	    		
	    		if (typeof filter !== 'undefined') {
		    		filter = parseInt(filter);
	
		    		if (filter > 1) {
		    			page = filter;
		    		}
		    	}
	    	}
	
	    	if (this.$el.data('twbs-pagination')) {
	    		this.$el.twbsPagination('destroy');
	    	}
	    	
	    	// show/hide pagination if no results
	    	if (this.options.hideWhenUseless) {
		    	var method = this.results.length <= this.options.nbItemsPerPage ? 'hide' : 'show';
		    	
		    	if (this.options.count) {
		    		this.$el.parent()[method]();
		    	} else {
		    		this.$el[method]();
		    	}
	    	}
	    	
	    	this.options.totalPages = Math.ceil(this.results.length / this.options.nbItemsPerPage);
	
	    	// update pagination
	    	if (this.options.totalPages > 0) {
	    		this.$el.twbsPagination(this.options);
	    	}
	
	    	// draw the page (update items display status)
	    	this.drawPage(page);
	    };
	    
	    /** Change the current page */
	    this.setPage = function (page, draw) {
	    	if (page <= this.options.totalPages && page > 0) {
	    		this.$el.find('li').eq(page).click();
	    	}
	    };
	    
	    /** Alias of paginate */
	    this.update = function (filter) {
	    	this.pagine(filter); 
	    };
	    
	    /** Draw the page (update dysplay status of items) */
	    this.drawPage = function (page) {
	    	this.items.data('p_filtered', false).hide();
	    	this.page = page;
	    	
	    	var start = (page-1)*this.options.nbItemsPerPage,
	    		limit = this.options.nbItemsPerPage + start,
	    		shown = 0;
			
	    	this.results.each(function (i) {
	    		$(this).data('p_filtered', true);
	    		
	    		if (i >= start && i < limit) {
	    			shown ++;
	    			$(this).show();
	    		}
	    	});
	
	    	if ($.isFunction(this.options.onDraw)) {
	    		this.options.onDraw(page);
	    	}
	
	    	if (this.options.count) {
	    		var first = start + 1;
	    		var last = start + shown;
	    		this.$el.prev('.pagination-count').text((first != last ? first + ' à ' +  last : first) + ' sur ' + this.results.length);
	    	}
	    };
	    
	    /** Set a new config option */
	    this.option = function (name, value) {
	    	this.options[name] = value;
	    	this.$el.data('$el', this);
	    };
	    
	    /** Get filtered items count */
	    this.getCount = function () {
	    	return this.results.length;
	    };
	    
	    /** Get page count */
	    this.getPageCount = function () {
	    	return this.options.totalPages;
	    };
	    
	    /** Get the current page */
	    this.getPage = function () {
	    	return this.page;
	    };
	    
	    /** Destroy plugin instance */
	    this.remove = function () {
	    	if (this.options.count) {
		    	this.$el.removeClass('col-md-7').data('$el', null);
		    	this.$el.parent().before(this.$el).remove();
	    	}
	    	
	    	this.$el.data('$el', null);
	    	
	    	if (this.$el.data('twbs-pagination')) {
	    		this.$el.twbsPagination('destroy');
	    	}
	    };
	}
	
	$.fn.paginate = function (method) {
		var $el = this.data('$el');
		var Plugin = $el || new PaginatePlugin(this);
		var ret;
		
		if (!$el) {
			ret = Plugin.init(method);
		} else if ($.isFunction(Plugin[method]) && method.charAt(0) != '_'){
			ret = Plugin[method].apply(Plugin, [].slice.call(arguments, 1));
		}
		
		return ~[void 0, null].indexOf(ret) ? this : ret;
	};
	
	$.fn.paginate.defaults = {
		startPage: 1,
	    totalPages: 1,
	    visiblePages: 5,
	    href: '#/page-{{number}}',
	    first: ' ', //'<i class="fa fa-step-backward"></i>',
	    prev: '', //'<i class="fa fa-chevron-left"></i>',
	    next: '', //'<i class="fa fa-chevron-right"></i>',
	    last: ' ', //'<i class="fa fa-step-forward"></i>',
	    selector: '.item',
	    nbItemsPerPage: 5,
	    onClick: $.noop,
	    onDraw: $.noop,
	    hideWhenUseless: true,
	    count: false
	};
})(jQuery);