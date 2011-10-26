/*!
 * jquery-ajaxPreparer-handler
 * Version:  0.9.7
 * Source:  https://github.com/CaryLandholt/jquery-ajaxPreparer-handler
 *
 * Copyright (c) 2011 Cary Landholt
 * https://github.com/CaryLandholt
 * https://twitter.com/CaryLandholt
 *
 * Description
 * Prepare ajax calls through conventions.  Ajaxify anchors (links), inputs, and selects.
 * This handler's sole responsibility is to prepare the ajax call.
 * Upon preparation an event will be fired for consumption by another handler.
 *
 * Registration
 *	$(document)
 *		.on('click', 'form[data-ajax] :submit, a[data-ajax]', $.handlers.ajaxPreparer)
 *		.on('change', 'input[data-ajax], select[data-ajax]', $.handlers.ajaxPreparer);
 *
 * Usage
 * http://jsfiddle.net/carylandholt/24gsA/
 * With the above suggested registration pattern, inputs and selects with the [data-ajax] attribute
 * will be handled on the change event.  Anchors and submits will be handled on the click event.
 * 
 *	<a href="/echo/html/"
 *		data-ajax="true"
 *		data-ajax-options='{"ajaxOptions" : {"data": {"html": "<div>My HTML</div>", "delay": 1}}}'>HTML</a>
 *
 *	<a
 *		href="/echo/json/"
 *		data-ajax="true"
 *		data-ajax-options='{"ajaxOptions" : {"type" : "post", "dataType" : "json", "data": "json={\"foo\" : \"bar\"}"}}'>JSON</a>
 *
 *	<form method="post" action="/echo/html/" data-ajax="true">
 *		<input type="text" name="FirstName" value="My First Name" data-ajax="true" />
 *		<input type="text" name="LastName" value="My Last Name" />
 *
 *		<select name="Gender" data-ajax="true">
 *			<option value="M">Male</option>
 *			<option value="F">Female</option>
 *		</select>
 *
 *		<input type="checkbox" name="IsActive" data-ajax="true" />
 *		<input type="hidden" name="IsActive" value="false" />
 *
 *		<input type="submit" value="Submit" />
 *	</form>
 */

/*global jQuery*/

(function ($, handlers) {
	'use strict';

	// only acceptable ajaxable trigger elements
	var validTagNames = ['A', 'INPUT', 'SELECT'];

	// gets ajax options from the element
	function getAjaxOptions(base) {
		var $form;

		// anchor was the trigger element
		if (base.el.tagName === 'A') {
			return {
				type: 'get',
				url: base.$el.prop('href')
			};
		}

		// form will be used for type, url and data
		$form = base.$el.parents('form');

		return {
			type: $form.prop('method'),
			url: $form.prop('action'),
			data: $form.serialize()
		};
	}

	handlers.ajaxPreparer = function (e, options) {
		// Prevent the default browser handler from firing.
		// Necessary for anchors and buttons.
		e.preventDefault();

		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this,
			ajaxOptions = {};

		// exit if there is no event
		if (!e) {
			return;
		}

		// Access to DOM version of the element
		base.el = e.target;
		// Access to jQuery version of the element
		base.$el = $(base.el);
		// Access to 
		base.handlerOptions = options;
		base.metadata = base.$el.data(handlers.ajaxPreparer.defaults.metadatakey);

		// Add a reverse reference to the DOM object
		base.$el.data(handlers.ajaxPreparer.defaults.dataStorageName, base);
		base.settings = $.extend(true, {}, handlers.ajaxPreparer.defaults, base.handlerOptions, base.metadata);

		// verify if the element's tagName is valid
		if ($.inArray(base.el.tagName, validTagNames) === -1) {
			base.$el.trigger(base.settings.invalidAjaxTagEventName, base.el.tagName);

			return;
		}

		$.extend(ajaxOptions, getAjaxOptions(base));

		// retain context throughout successive event calls
		ajaxOptions.context = base.el;
		$.extend(ajaxOptions, base.settings.ajaxOptions);
		base.$el.trigger(base.settings.ajaxRequestPreparedEventName, ajaxOptions);
	};

	handlers.ajaxPreparer.defaults = {
		metadatakey: 'ajax-options',
		dataStorageName: 'ajaxPreparer',
		ajaxRequestPreparedEventName: 'ajax-request-prepared',
		invalidAjaxTagEventName: 'invalid-ajax-tag'
	};
}(jQuery, jQuery.handlers = jQuery.handlers || {}));