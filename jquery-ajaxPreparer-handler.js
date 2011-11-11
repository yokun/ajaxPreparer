/*!
 * jquery-ajaxPreparer-handler
 * Version:  1.0.1
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
 * Dependencies
 * https://github.com/CaryLandholt/jquery-pubsub
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

	function getAjaxOptionsForAnchor($el) {
		return {
			type: 'get',
			url: $el.prop('href')
		};
	}

	function getAjaxOptionsForInput($el) {
		var $form = $el.parents('form');

		return {
			type: $form.prop('method'),
			url: $form.prop('action'),
			data: $form.serialize()
		};
	}

	// gets ajax options from the element
	function getAjaxOptionsFromElement($el, tagName) {
		// anchor was the trigger element
		if (tagName === 'A') {
			return getAjaxOptionsForAnchor($el);
		}

		// form will be used for type, url, and data
		return getAjaxOptionsForInput($el);
	}

	function getAjaxOptions(el, $el, tagName, settings) {
		var ajaxOptions = getAjaxOptionsFromElement($el, tagName);

		// retain context throughout successive event calls
		ajaxOptions.context = el;

		return $.extend({}, ajaxOptions, settings.ajaxOptions);
	}

	// merge defaults, options, and meta options in that order
	function getSettings($el, options) {
		var settings = $.extend({}, handlers.ajaxPreparer.defaults, options),
			metadata = $el.data(settings.metadatakey);

		return $.extend({}, settings, metadata);
	}

	handlers.ajaxPreparer = function (e, options) {
		e.preventDefault();

		var el = e.target,
			$el = $(el),
			settings = getSettings($el, options),
			events = settings.events,
			tagName = el.tagName,
			isValidTagName = $.inArray(tagName, validTagNames) !== -1,
			ajaxOptions = isValidTagName ? getAjaxOptions(el, $el, tagName, settings) : {};

		$.publish(events.ajaxPrepared, ajaxOptions);

		if (isValidTagName) {
			$.publish(events.ajaxPreparedSuccess, ajaxOptions);
		} else {
			$.publish(events.ajaxPreparedErrorInvalidTag, tagName);
			$.publish(events.ajaxPreparedError, ajaxOptions);
		}

		$.publish(events.ajaxPreparedComplete, ajaxOptions);
	};

	handlers.ajaxPreparer.defaults = {
		metadatakey: 'ajax-options',
		events: {
			ajaxPrepared: '/ajax/prepared',
			ajaxPreparedSuccess: '/ajax/prepared/success',
			ajaxPreparedErrorInvalidTag: '/ajax/prepared/error/invalidtag',
			ajaxPreparedError: '/ajax/prepared/error',
			ajaxPreparedComplete: '/ajax/prepared/complete'
		}
	};
}(jQuery, jQuery.handlers = jQuery.handlers || {}));