###!
 * ajaxPreparer
 * Version:  1.3.2
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
###

###global define###

define ['jquery', 'publish'], ($, publish) ->
	'use strict'

	module = {}
	# only acceptable ajaxable trigger elements
	validTagNames = ['A', 'BUTTON', 'INPUT', 'SELECT']

	hasValidUrl = (url) ->
		url isnt '' and url.indexOf('#') isnt 0

	getAjaxOptionsForAnchor = ($el) ->
		type: 'get'
		url: $el.prop 'href'

	getAjaxOptionsForInput = ($el) ->
		$form = $el.parents 'form'

		type: $form.prop 'method'
		url: $form.prop 'action'
		data: $form.serialize()

	# gets ajax options from the element
	getAjaxOptionsFromElement = ($el, tagName) ->
		# anchor was the trigger element
		return getAjaxOptionsForAnchor $el if tagName is 'A'

		# form will be used for type, url, and data
		getAjaxOptionsForInput $el

	getAjaxOptions = (el, $el, tagName, settings) ->
		ajaxOptions = getAjaxOptionsFromElement $el, tagName

		# retain context throughout successive event calls
		ajaxOptions.context = el

		$.extend {}, ajaxOptions, settings.ajaxOptions

	# merge defaults, options, and meta options in that order
	getSettings = ($el, options, isValidTagName, tagName) ->
		# if the element is an input, get the options from the form
		$form = if isValidTagName and tagName isnt 'A' then $el.parents 'form' else null
		settings = $.extend {}, module.defaults, options
		metadata = ($form or $el).data settings.metadatakey

		$.extend {}, settings, metadata

	module = (e, options) ->
		e.preventDefault()

		el = e.target
		$el = $ el
		tagName = el.tagName
		isValidTagName = $.inArray(tagName, validTagNames) isnt -1
		settings = getSettings $el, options, isValidTagName, tagName
		events = settings.events
		ajaxOptions = getAjaxOptions el, $el, tagName, settings

		publish events.ajaxPreparerStarted, ajaxOptions

		isValidUrl = hasValidUrl ajaxOptions.url
		hasError = not (isValidTagName and isValidUrl)

		if not hasError
			publish events.ajaxPreparerSuccess, ajaxOptions
		else
			publish events.ajaxPreparerErrorInvalidTag, ajaxOptions if not isValidTagName
			publish events.ajaxPreparerErrorMissingUrl, ajaxOptions if not isValidUrl
			publish events.ajaxPreparerError, ajaxOptions

		publish events.ajaxPreparerComplete, ajaxOptions

	module.defaults =
		metadatakey: 'ajax-options'
		events:
			ajaxPreparerStarted: '/ajax/preparer/started'
			ajaxPreparerSuccess: '/ajax/preparer/success'
			ajaxPreparerErrorInvalidTag: '/ajax/preparer/error/invalidTag'
			ajaxPreparerErrorMissingUrl: '/ajax/preparer/error/missingUrl'
			ajaxPreparerError: '/ajax/preparer/error'
			ajaxPreparerComplete: '/ajax/preparer/complete'

	module