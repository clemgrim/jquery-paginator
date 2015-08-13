(function ($, undefined) {
	'use strict';
	
	var Pagination = {
		click: function (i, cb) {
			return function (e) {
				e.preventDefault();
				cb(i);
			};
		},
		page: function (text, cls) {
			return $('<li class="' + cls + '" />').append('<a href="#">' + text + '</a>');
		}
	};
	
	function PaginatePlugin ($el) {
		this.$el = $el;
	
		this.options = {};
		
		this.results = [];
		
		this._page = 1;
		
		/** Init pagination */
		this.init = function (options) {
			var self = this;

			// merge user options with default plugin options
			$.extend(this.options, $.fn.paginate.defaults, options);
	
			// wrap pagination if user want to show pagination count
			if (this.options.count) {
				if (!this.options.counterTarget) {
					this.$el.wrap('<div class="row pagination-wrapper"/>').before('<div class="col-md-5 pagination-count"/>');
					this.$el.addClass('col-md-7');
				}
			}
	
			this.items = $(this.options.selector);
			
			// save plugin instance in data attribute
			this.$el.data('$el', this);
	    	this.pagine();
	    };
	    
	    /** Update pagination. Filter is a function that will be used with $.fn.filter to filter items to show */
	    this.pagine = function (filter) {
	    	var page = this.options.startPage;

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
	    		
	    		if (filter > 1) {
		    		page = parseInt(filter);
		    	}
	    	}
	
	    	// show/hide pagination if no results
	    	if (this.options.hideWhenUseless) {
		    	var method = this.results.length <= this.options.nbItemsPerPage ? 'hide' : 'show';
		    	
		    	if (this.options.count) {
		    		if (!this.options.counterTarget) {
		    			this.$el.parent()[method]();
		    		} else {
		    			this._getCounterTarget().add(this.$el)[method]();
		    		}
		    	} else {
		    		this.$el[method]();
		    	}
	    	}
	    	
	    	this.options.totalPages = Math.ceil(this.results.length / this.options.nbItemsPerPage);
	
	    	// update current page
	    	this.setPage(page);
	    };
	    
	    /** Change the current page */
	    this.setPage = function (page) {
	    	page = page > this.options.totalPages || page < 1 ? 1 : parseInt(page);
	    	
	    	if (this.options.totalPages < 1) {
	    		return;
	    	}
    		
    		if ($.isFunction(this.options.onClick)) {
        		this.options.onClick(page);
        	}
	    	
    		var delta = parseInt(this.options.visiblePages / 2);
    		var cb = $.proxy(this.setPage, this);
    		var start, end;
    		
    		// determine start and end page to display
    		if (page + delta <= this.options.totalPages) {
	    		start = Math.max(page - delta,  1);
	    		end = Math.min(start + this.options.visiblePages - 1, this.options.totalPages);
    		} else {
	    		end = Math.min(page + delta, this.options.totalPages);
	    		start = Math.max(end - this.options.visiblePages + 1,  1);
    		}
    		
    		// build pagination
    		this.$el.empty();
    		
    		for (var i = start ; i <= end ; i++) {
    			var p = Pagination.page(i, 'page');
    			
    			if (i == page) {
    				p.addClass('active');
    			}
    			
    			this.$el.append(p.click(Pagination.click(i, cb)));
    		}

    		// add navigation buttons
    		if (this.options.prev !== false) {
    			this.$el.prepend(Pagination.page(this.options.prev, 'prev').click(Pagination.click(page - 1, cb)));
    		}
    		
    		if (this.options.first !== false) {
    			this.$el.prepend(Pagination.page(this.options.first, 'first').click(Pagination.click(1, cb)));
    		}
    		
    		if (this.options.next !== false) {
    			this.$el.append(Pagination.page(this.options.next, 'next').click(Pagination.click(page+1, cb)));
    		}
    		
    		if (this.options.last !== false) {
    			this.$el.append(Pagination.page(this.options.last, 'last').click(Pagination.click(this.options.totalPages, cb)));
    		}
    		
    		// set buttons classes
    		if (page === 1) {
    			this.$el.find('.first, .prev').addClass('disabled');
    		}
    		
    		if (page === this.options.totalPages) {
    			this.$el.find('.last, .next').addClass('disabled');
    		}
    		
    		// add url hash
    		if (this.options.href) {
    			location.hash = this.options.href.replace('{{number}}', page);
    		}
    		
    		// show items for the selected page
	    	this.drawPage(page);
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
	    		var counter = first != last ? this.options.counter : this.options.counterObvious;
	    			
	    		counter = counter.replace('{{first}}', first)
    							.replace('{{last}}', last)
    							.replace('{{count}}', this.results.length)
    							.replace('{{page}}', page)
    							.replace('{{pageCount}}', this.options.totalPages);
	    		
	    		this._getCounterTarget().html(counter);
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
	    		if (this.options.countTarget) {
	    			this._getCounterTarget().empty();
	    		} else {
			    	this.$el.removeClass('col-md-7').data('$el', null);
			    	this.$el.parent().before(this.$el).remove();
	    		}
	    	}
	    	
	    	this.$el.data('$el', null).empty();
	    };
	    
	    this._getCounterTarget = function () {
	    	return this.options.counterTarget ? $(this.options.counterTarget) : this.$el.prev('.pagination-count');
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
	    first: '<i class="fa fa-step-backward"></i>',
	    prev: false,
	    next: false,
	    last: '<i class="fa fa-step-forward"></i>',
	    selector: '.item',
	    nbItemsPerPage: 5,
	    onClick: $.noop,
	    onDraw: $.noop,
	    hideWhenUseless: true,
	    count: false,
	    counter: '{{first}} to {{last}} to {{count}}',
	    counterObvious: '{{first}} of {{count}}',
	    counterTarget: false,
	};
})(jQuery);