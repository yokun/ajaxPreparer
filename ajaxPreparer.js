/*!
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
*/
/*global define
*/
define(['jquery', 'publish'], function($, publish) {
  'use strict';
  var getAjaxOptions, getAjaxOptionsForAnchor, getAjaxOptionsForInput, getAjaxOptionsFromElement, getSettings, hasValidUrl, module, validTagNames;
  module = {};
  validTagNames = ['A', 'BUTTON', 'INPUT', 'SELECT'];
  hasValidUrl = function(url) {
    return url !== '' && url.indexOf('#') !== 0;
  };
  getAjaxOptionsForAnchor = function($el) {
    return {
      type: 'get',
      url: $el.prop('href')
    };
  };
  getAjaxOptionsForInput = function($el) {
    var $form;
    $form = $el.parents('form');
    return {
      type: $form.prop('method'),
      url: $form.prop('action'),
      data: $form.serialize()
    };
  };
  getAjaxOptionsFromElement = function($el, tagName) {
    if (tagName === 'A') return getAjaxOptionsForAnchor($el);
    return getAjaxOptionsForInput($el);
  };
  getAjaxOptions = function(el, $el, tagName, settings) {
    var ajaxOptions;
    ajaxOptions = getAjaxOptionsFromElement($el, tagName);
    ajaxOptions.context = el;
    return $.extend({}, ajaxOptions, settings.ajaxOptions);
  };
  getSettings = function($el, options, isValidTagName, tagName) {
    var $form, metadata, settings;
    $form = isValidTagName && tagName !== 'A' ? $el.parents('form') : null;
    settings = $.extend({}, module.defaults, options);
    metadata = ($form || $el).data(settings.metadatakey);
    return $.extend({}, settings, metadata);
  };
  module = function(e, options) {
    var $el, ajaxOptions, el, events, hasError, isValidTagName, isValidUrl, settings, tagName;
    e.preventDefault();
    el = e.target;
    $el = $(el);
    tagName = el.tagName;
    isValidTagName = $.inArray(tagName, validTagNames) !== -1;
    settings = getSettings($el, options, isValidTagName, tagName);
    events = settings.events;
    ajaxOptions = getAjaxOptions(el, $el, tagName, settings);
    publish(events.ajaxPreparerStarted, ajaxOptions);
    isValidUrl = hasValidUrl(ajaxOptions.url);
    hasError = !(isValidTagName && isValidUrl);
    if (!hasError) {
      publish(events.ajaxPreparerSuccess, ajaxOptions);
    } else {
      if (!isValidTagName) {
        publish(events.ajaxPreparerErrorInvalidTag, ajaxOptions);
      }
      if (!isValidUrl) publish(events.ajaxPreparerErrorMissingUrl, ajaxOptions);
      publish(events.ajaxPreparerError, ajaxOptions);
    }
    return publish(events.ajaxPreparerComplete, ajaxOptions);
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
