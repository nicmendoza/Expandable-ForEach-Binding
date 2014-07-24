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

Currently requires jQuery