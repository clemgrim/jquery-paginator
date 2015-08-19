jquery-paginator
================

A jquery plugin for create twitter bootstrap pagination, and handle items display

This plugin handle the pagination for elements inside a list : 
* it creates a bootstrap pagination
* it handles show / hide of items while user click
* you can apply filter on your items, to update pagination

```html
<div class="block odd">
  <h3>My title</h3>
  <p>Purus volutpat adipisci</p>
</div>
<div class="block even">
  <h3>One item</h3>
  <p>Purus volutpat adipisci</p>
</div>
<div class="block odd">
  <h3>An other item</h3>
  <p>Purus volutpat adipisci</p>
</div>
...
<script src="path/to/jquery.js"></script>
<script src="path/to/jquery-paginator.js"></script>
```

```js
$('#pagination').paginate({
  selector: '.block',
  onClick: function (page) {
    console.log('Page', page, 'has been clicked');
  },
  onDraw: function (page) {
  	console.log('Page', page, 'has been rendered'); 
  }
});
```

## Apply filter
```html
<button id="filter">Show odd elements</button>
```
```js
// after initialize pagination
$('#button').click(function(){
  $('#pagination').paginate('pagine', function() {
    return $(this).hasClass('odd');
  });
});
```
Filters work as jquery filters, the ```this``` variable refers to the current element to test (here a .block element)
The callback function will be passed to `$.fn.filter` function to filter elements that will be shown

## Options
Here are options you could override, with their default values

```js
	$.fn.paginate.defaults = {
	    startPage: 1,
	    visiblePages: 5,
	    href: '#/page-{{number}}',
	    first: '<i class="fa fa-step-backward"></i>', // false to hide this control
	    prev: '<i class="fa fa-chevron-left"></i>', // you can put html or string (empty strings are allowed ;))
	    next: '<i class="fa fa-chevron-right"></i>',
	    last: '<i class="fa fa-step-forward"></i>',
	    selector: '.item',
	    nbItemsPerPage: 5,
	    onClick: $.noop,
	    onDraw: $.noop,
	    hideWhenUseless: true,
	    count: false, // if true, display a pagination counter
	    counter: '{{first}} to {{last}} of {{count}}', // text for counter, you can use : first, last, page, count, pageCount (it can contains html)
	    counterObvious: '{{first}} of {{count}}' // if you have only one item on your page (first = last), show this counter instead
	};
	
	// Global override
	$.fn.paginate.defaults.first = '<<';
	$.fn.paginate.defaults.last = '>>';
	
	// Local override, only for this element
	$(element).paginate({
	  first: '<<',
	  last: '>>'
  });
```

## Methods
You can call plugin methods with this syntax (after you have initialized the plugin)

```js
	$('.pagination').paginate('methodName', arg1, arg2, ...);
```

### setPage(int) *chainable*
Change the current page

### update(function) *chainable*
Update the pagination
The filter function will filter your items to determine if they have to be shown or hide (if you want to apply filters)

```js
	var toShow = [1,2,5,6];
	var id;
	
	$('.pagination').paginate('update', function () {
		id = $(this).data('id');
		return toShow.indexOf(id) > -1; // will show items that have attribute `data-id` in toShow array
										// other items are hidden
	});
```

### option(string, mixed) *chainable*
Set an option for the plugin. It is the only way to override your plugin option after its initialization

```js
	$('.pagination').paginate('visiblePages', 3);
```

### remove() *chainable*
Destroy the plugin instance and clean the element
	
### getCount()
Get paginated items count

### getPageCount()
Get the page count

### getPage()
Get the current page
