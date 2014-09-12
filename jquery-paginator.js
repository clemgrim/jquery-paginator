var PaginatePlugin = function ($el) {
		this.$el = $el;
		
		this.options = {};
		
		this.results = [];
		
		this.init = function (options) {
			var self = this;

			$.extend(this.options, $.fn.paginate.defaults, options, {
    	        onPageClick: function (e, page) {
    	        	e.preventDefault();
    	        	self.drawPage(page);
    	        }
    	    });
	    	
			this.items = $(this.options.selector);
	    	this.results = this.items;
			this.$el.data('$el', this);
	    	this.pagine();
	    };
	    
	    this.pagine = function (filter) {
	    	
	    	if (typeof filter === 'function') {
	    		this.results = this.items.filter(filter);
	    	}
	    	
	    	if (this.$el.data('twbs-pagination')) {
	    		this.$el.twbsPagination('destroy');
	    	}
	    	
	    	if (this.results.length <= this.options.nbItemsPerPage) {
	    		this.$el.hide();
	    	} else {
	    		this.options.totalPages = Math.ceil(this.results.length / this.options.nbItemsPerPage);
	    		this.$el.twbsPagination(this.options).show();
	    	}
	    	
	    	this.drawPage(1);
	    };
	    
	    this.drawPage = function (page) {
	    	$(this.options.selector).hide();
	    	
	    	var start = (page-1)*this.options.nbItemsPerPage,
	    		results = this.results.slice(start, start + this.options.nbItemsPerPage);
	    	
	    	results.each(function () {
	    		$(this).show();
	    	});
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