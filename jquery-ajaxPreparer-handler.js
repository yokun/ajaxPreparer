/*!
 * jquery-ajaxPreparer-handler
 * Version:  0.9.2
 * Source:  https://github.com/CaryLandholt/jquery-ajaxPreparer-handler
 */

/*global jQuery*/

(function ($, handlers) {
	'use strict';

	handlers.ajaxPreparer = function (e, options) {
		var base = this,
			validTagNames = ['A', 'INPUT', 'SELECT'],
			ajaxOptions = {},
			$form;

		base.el = e.target;
		base.$el = $(base.el);
		base.handlerOptions = options;
		base.metadata = base.$el.data(handlers.ajaxPreparer.defaults.metadatakey);
		base.$el.data(handlers.ajaxPreparer.defaults.dataStorageName, base);
		base.settings = $.extend(true, {}, handlers.ajaxPreparer.defaults, base.handlerOptions, base.metadata);

		if ($.inArray(base.el.tagName, validTagNames) === -1) {
			base.$el.trigger(base.settings.invalidAjaxTagEventName, base.el.tagName);

			return false;
		}

		if (base.el.tagName === 'A') {
			$.extend(ajaxOptions, {
				type: 'get',
				url: base.el.href
			});
		} else {
			$form = base.$el.parents('form');

			$.extend(ajaxOptions, {
				type: $form.attr('method'),
				url: $form.attr('action'),
				data: $form.serialize()
			});
		}

		// retain context throughout successive event calls
		ajaxOptions.context = base.el;
		$.extend(ajaxOptions, base.settings.ajaxOptions);
		base.$el.trigger(base.settings.ajaxRequestPreparedEventName, ajaxOptions);

		return false;
	};

	handlers.ajaxPreparer.defaults = {
		metadatakey: 'ajax-options',
		dataStorageName: 'ajaxPreparer',
		ajaxRequestPreparedEventName: 'ajax-request-prepared',
		invalidAjaxTagEventName: 'invalid-ajax-tag'
	};
}(jQuery, jQuery.handlers = jQuery.handlers || {}));

/*
$('body').delegate('form[data-ajax="true"] :submit', 'click', $.handlers.ajaxPreparer);

$('body').delegate('a[data-ajax="true"]', 'click', function (e) {
	return $.handlers.ajaxPreparer(e, {ajaxOptions: {foo: 'bar'}});
});

$('body').delegate('input[data-ajax="true"], select[data-ajax="true"]', 'change', $.handlers.ajaxPreparer);
*/