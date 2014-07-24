/*
	the expandableForEach Binding
	=============================

	the _expandableForEach_ binding allows us to pass in a collection
	and an expandList observable (or boolean) to cause the list
	to be shown in a condensed format if the value is true, and 
	expanded (i.e. show all items) if the value is false

	The binding will insert a "more" button to allow the user
	to update the observable, but it can also be updated
	programmatically

	Example Usage:
	=============

	<div data-bind="expandableForEach: {
		list: observableArray,             // the collection
		expandList: observable(boolean),   // whether or not the list is expanded
		[expandByDefault]: boolean,        // whether or not the list is expanded by default
		[condensedSize]: number,           // what size collection to condense
		[buttonClass]: string,             // a class to apply to the button
		[buttonMoreText] : string/function,// the text for the "more" button, or a function with
										   // the signature function( numToShow, originalListLength,expand )
		[buttonLessText]: string/function  // same as above for the "less" function

	}"></div>

	
	Todo:
	====
	1. Get this working with an internal observable
		- idea: store as ko.bindingHandlers['expandableForEach'][elementBasedKey]['expandableState'] = ko.observable(options.expandByDefault)
		so it can be accessed in the update

*/


ko.bindingHandlers['expandableForEach'] = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
		return ko.bindingHandlers['foreach'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
	},
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
		
		var defaults = {
			expandByDefault: false,
			expandList: false, // this needs to be passed in for now
			condensedSize: 10,
			buttonClass: 'expandable-expander',
			buttonMoreText: 'More',
			buttonLessText: 'Less'
		},
			bindingValue = valueAccessor(),
			collection = ko.utils.unwrapObservable( bindingValue.items || bindingValue),
			options = typeof bindingValue === 'object' ? $.extend( {},defaults, bindingValue ) : defaults,
			expand = ko.utils.unwrapObservable(options.expandList),
			numToShow = expand ? collection.length : options.condensedSize,
			$element = $(element),
			$toggleButton = $('<a class="' + options.buttonClass + '">' + _buttonText( options.buttonMoreText ) + '</a>')
				.html( _buttonText( expand ? options.buttonLessText : options.buttonMoreText ))
				.click(function(){
					options.expandList(!expand);
				});


		// create valueAccessor that returns a sliced collection
		function newValueAccessor(){
			return ko.utils.unwrapObservable(collection).slice( 0, numToShow );
		}
		// use the vanilla foreach binding to render the sliced
		// collection to the DOM
		var toReturn = ko.bindingHandlers['foreach'].update(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);

		//remove and re-add button each time
		if(collection.length > options.condensedSize){
			$element.parent().find('.' + options.buttonClass).remove();
			$element.after($toggleButton);
		}

		return toReturn;

		function _buttonText(textOrFunc){
			if(typeof textOrFunc === 'string'){
				return textOrFunc;
			} else if(typeof textOrFunc === 'function'){
				return textOrFunc(numToShow,collection.length,expand);
			}
		}
	}
};