var PaginatePlugin = function ($el) {
		this.$el = $el;
		
		this.options = {};
		
		this.results = [];
		
		this._page = 1;
		
		this.init = function (options) {
			var self = this;

			$.extend(this.options, $.fn.paginate.defaults, options, {
    	        onPageClick: function (e, page) {
    	        	e.preventDefault();
    	        	self.drawPage(page);
    	        	
    	        	if ($.isFunction(self.options.onClick)) {
    	        		self.options.onClick(page);
    	        	}
    	        }
    	    });
	    	
			this.items = $(this.options.selector);
			this.$el.data('$el', this);
	    	this.pagine();
	    };
	    
	    this.pagine = function (filter) {
	    	var page = 1;
	    	
	    	if (typeof filter === 'function') {
	    		this.results = this.items.filter(filter);
	    	} else {
	    		this.results = $(this.options.selector).filter(function () {
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
	    	
	    	if (this.options.hideWhenUseless) {
		    	if (this.results.length <= this.options.nbItemsPerPage) {
		    		this.$el.hide();
		    	} else {
		    		this.$el.show();
		    	}
	    	}
	    	
	    	this.options.totalPages = Math.ceil(this.results.length / this.options.nbItemsPerPage);
	    	this.$el.twbsPagination(this.options)
	    	
	    	this.drawPage(page);
	    };
	    
	    this.drawPage = function (page) {
	    	$(this.options.selector).data('p_filtered', false).hide();
	    	
	    	this.page = page;
	    	
	    	var start = (page-1)*this.options.nbItemsPerPage,
	    		limit = this.options.nbItemsPerPage + start;
    		
	    	this.results.each(function (i) {
	    		$(this).data('p_filtered', true);
	    		
	    		if (i >= start && i < limit) {
	    			$(this).show();
	    		}
	    	});
	    	
	    	if ($.isFunction(this.options.onDraw)) {
        		this.options.onDraw(page);
        	}
	    };
	    
	    this.getCount = function () {
	    	return this.results.length;
	    };
	    
	    this.getPageCount = function () {
	    	return this.options.totalPages;
	    };
	    
	    this.getPage = function () {
	    	return this.page;
	    };
	};
	
	$.fn.paginate = function (method) {
		var args = arguments;
		
		if (this.length > 1) {
			return this.eq(0).paginate.apply(args);
		}
		
		var $el = this.data('$el');
		
		var Plugin = $el ? $el : new PaginatePlugin(this);
		
		if ($el && $.isFunction(Plugin[method]) && method.charAt(0) != '_'){
			return Plugin[method].apply(Plugin, Array.prototype.slice.call(args, 1));
		} else {
			return Plugin.init(method);
		}
		
		return this;
	};
	
	$.fn.paginate.defaults = {
		startPage: 1,
        totalPages: 1,
        visiblePages: 5,
        href: '#/page-{{number}}',
        first: '<i class="fa fa-step-backward"></i>',
        prev: '<i class="fa fa-chevron-left"></i>',
        next: '<i class="fa fa-chevron-right"></i>',
        last: '<i class="fa fa-step-forward"></i>',
        selector: '.item',
        nbItemsPerPage: 5,
        onClick: $.noop,
        onDraw: $.noop,
        hideWhenUseless: true
	};
