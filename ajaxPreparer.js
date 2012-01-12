/*!
 * ajaxPreparer
 * Version:  1.3.0
 * Source:  https://github.com/CaryLandholt/ajaxPreparer
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
 * https://github.com/jrburke/requirejs
 * https://github.com/jquery/jquery
 * https://github.com/CaryLandholt/publish
 *
 * Registration
 * subscribe('click', 'form[data-ajax] :submit, a[data-ajax]', callback)
 * subscribe('change', 'input[data-ajax], select[data-ajax]', callback);
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

/*global define*/

define(['jquery', 'publish'], function ($, publish) {
	'use strict';

	// only acceptable ajaxable trigger elements
	var module = {},
		validTagNames = ['A', 'INPUT', 'SELECT'];

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
		var settings = $.extend({}, module.defaults, options),
			metadata = $el.data(settings.metadatakey);

		return $.extend({}, settings, metadata);
	}

	module = function (e, options) {
		e.preventDefault();

		var el = e.target,
			$el = $(el),
			settings = getSettings($el, options),
			events = settings.events,
			tagName = el.tagName,
			isValidTagName = $.inArray(tagName, validTagNames) !== -1,
			ajaxOptions = isValidTagName ? getAjaxOptions(el, $el, tagName, settings) : {};

		publish(events.ajaxPreparerStarted, ajaxOptions);

		if (isValidTagName) {
			publish(events.ajaxPreparerSuccess, ajaxOptions);
		} else {
			publish(events.ajaxPreparerErrorInvalidTag, tagName);
			publish(events.ajaxPreparerError, ajaxOptions);
		}

		publish(events.ajaxPreparerComplete, ajaxOptions);
	};

	module.defaults = {
		metadatakey: 'ajax-options',
		events: {
			ajaxPreparerStarted: '/ajax/preparer/started',
			ajaxPreparerSuccess: '/ajax/preparer/success',
			ajaxPreparerErrorInvalidTag: '/ajax/preparer/error/invalidTag',
			ajaxPreparerError: '/ajax/preparer/error',
			ajaxPreparerComplete: '/ajax/preparer/complete'
		}
	};

	return module;
});