/*!
 * ajaxPreparer
 * Version:  1.3.1
 * Source:  https://github.com/CaryLandholt/ajaxPreparer
 *
 * Copyright (c) 2012 Cary Landholt
 * https://github.com/CaryLandholt
 * https://twitter.com/CaryLandholt
 *
 * Description
 * Prepare ajax calls through conventions.  Ajaxify anchors (links), inputs, and selects.
 * This handler's sole responsibility is to prepare the ajax call.
 * Upon preparation an event will be fired for consumption by another handler.
 *
 * Dependencies
 * https://github.com/jquery/jquery
 * https://github.com/CaryLandholt/publish
 * https://github.com/jrburke/requirejs
 */

/*global define*/

define(['jquery', 'publish'], function ($, publish) {
	'use strict';

	var module = {},
		// only acceptable ajaxable trigger elements
		validTagNames = ['A', 'INPUT', 'SELECT'];

	function hasValidUrl(url) {
		return url !== '' && url.indexOf('#') !== 0;
	}

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
	function getSettings($el, options, isValidTagName, tagName) {
		// if the element is an input, get the options from the form
		var $form = isValidTagName && tagName !== 'A' ? $el.parents('form') : null,
			settings = $.extend({}, module.defaults, options),
			metadata = ($form || $el).data(settings.metadatakey);

		return $.extend({}, settings, metadata);
	}

	module = function (e, options) {
		e.preventDefault();

		var el = e.target,
			$el = $(el),
			tagName = el.tagName,
			isValidTagName = $.inArray(tagName, validTagNames) !== -1,
			settings = getSettings($el, options, isValidTagName, tagName),
			events = settings.events,
			ajaxOptions = getAjaxOptions(el, $el, tagName, settings),
			isValidUrl = hasValidUrl(ajaxOptions.url),
			hasError = !(isValidTagName && isValidUrl);

		publish(events.ajaxPreparerStarted, ajaxOptions);

		if (!hasError) {
			publish(events.ajaxPreparerSuccess, ajaxOptions);
		} else {
			if (!isValidTagName) {
				publish(events.ajaxPreparerErrorInvalidTag, ajaxOptions);
			}

			if (!isValidUrl) {
				publish(events.ajaxPreparerErrorMissingUrl, ajaxOptions);
			}

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
			ajaxPreparerErrorMissingUrl: '/ajax/preparer/error/missingUrl',
			ajaxPreparerError: '/ajax/preparer/error',
			ajaxPreparerComplete: '/ajax/preparer/complete'
		}
	};

	return module;
});