jquery-paginator
================

A jquery plugin for create twitter bootstrap pagination, and handle items display

This plugin handle the pagination for elements inside a list : 
* it creates a bootstrap pagination
* it handles show / hide of items while user click
* you can apply filter to your items, to update pagination

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
    console.log('Page' + page + 'has been clicked');
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

## Options
Here are options you could override, with their default values

```js
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
	
	// Global override
	$.fn.paginate.defaults.first = '<<';
	$.fn.paginate.defaults.last = '>>';
	
	// Local override, only for this element
	$(element).paginate({
	  first: '<<',
	  last: '>>'
  });
```

	
