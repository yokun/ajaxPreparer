/*!
 * jquery-ajaxPreparer-handler
 * Version:  0.9.4
 * Source:  https://github.com/CaryLandholt/jquery-ajaxPreparer-handler
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

		// form will be used as the trigger element
		$form = base.$el.parents('form');

		return {
			type: $form.prop('method'),
			url: $form.prop('action'),
			data: $form.serialize()
		};
	}

	handlers.ajaxPreparer = function (e, options) {
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this,
			ajaxOptions = {};

		// prevent the default browser handler from firing
		// necessary for anchors and buttons
		e.preventDefault();

		// Access to DOM and jQuery versions of the element
		base.el = e.target;
		base.$el = $(base.el);

		// verify if the elements tagName is valid
		if ($.inArray(base.el.tagName, validTagNames) === -1) {
			base.$el.trigger(base.settings.invalidAjaxTagEventName, base.el.tagName);

			return false;
		}

		base.handlerOptions = options;
		base.metadata = base.$el.data(handlers.ajaxPreparer.defaults.metadatakey);

		// Add a reverse reference to the DOM object
		base.$el.data(handlers.ajaxPreparer.defaults.dataStorageName, base);
		base.settings = $.extend(true, {}, handlers.ajaxPreparer.defaults, base.handlerOptions, base.metadata);

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

/*
$(document).on('click', 'form[data-ajax="true"] :submit', $.handlers.ajaxPreparer);

$(document).on('click', 'a[data-ajax="true"]', function (e) {
	return $.handlers.ajaxPreparer(e, {ajaxOptions: {foo: 'bar'}});
});

$(document).on('change', 'input[data-ajax="true"], select[data-ajax="true"]', $.handlers.ajaxPreparer);
*/