/*!
 * jquery-preparer-handler
 * Version:  0.9.0
 */

/*global jQuery*/

(function ($, handlers) {
	'use strict';

	handlers.ajaxPreparer = function (e, options) {
		var base = this,
			ajaxOptions = {},
			$form;

		base.el = e.target;
		base.$el = $(base.el);
		base.options = options;
		base.metadata = base.$el.data(handlers.ajaxPreparer.defaults.metadatakey);
		base.$el.data('Conjax', base);
		base.settings = $.extend(true, {}, handlers.ajaxPreparer.defaults, base.options, base.metadata);

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

		$.extend(ajaxOptions, base.settings.ajaxOptions);

		base.$el.trigger(base.settings.ajaxRequestPreparedEventName, ajaxOptions);

		return false;
	};

	handlers.ajaxPreparer.defaults = {
		metadatakey: 'ajax-options',
		ajaxRequestPreparedEventName: 'ajax-request-prepared'
	};
}(jQuery, jQuery.handlers = jQuery.handlers || {}));

/*
$('body').delegate('form[data-ajax="true"] :submit', 'click', $.handlers.ajaxPreparer);

$('body').delegate('a[data-ajax="true"]', 'click', function (e) {
	return $.handlers.ajaxPreparer(e, {ajaxOptions: {foo: 'bar'}});
});

$('body').delegate('input[data-ajax="true"], select[data-ajax="true"]', 'change', $.handlers.ajaxPreparer);
*/