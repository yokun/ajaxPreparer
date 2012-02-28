/*!
 * pubsub
 * Version:  1.3.0
 * Source:  https://github.com/CaryLandholt/pubsub
 *
 * Copyright (c) 2012 Cary Landholt
 * https://github.com/CaryLandholt
 * https://twitter.com/CaryLandholt
 *
 * Description
 * A simple pub/sub implementation
 *
 * Dependencies
 * https://github.com/CaryLandholt/doc
 * https://github.com/jquery/jquery
 * https://github.com/jrburke/requirejs
 * https://github.com/CaryLandholt/win
*/
/*global define
*/
define(['jquery', 'doc', 'win'], function($, $doc, $win) {
  'use strict';
  var $o, publish, subscribe, unsubscribe;
  $o = $({});
  subscribe = function(topic, selector, handler) {
    var normalizedTopic;
    normalizedTopic = topic.toLowerCase();
    if (arguments.length === 3) {
      if (normalizedTopic === 'ready') {
        $doc.on(topic, function() {
          return $(selector).each(handler);
        });
        return;
      }
      if (normalizedTopic === 'resize') {
        $win.on(topic, function() {
          return $(selector).each(handler);
        });
        return;
      }
    }
    $doc.on.apply($doc, arguments);
    return $o.on.apply($o, arguments);
  };
  unsubscribe = function() {
    $doc.off.apply($doc, arguments);
    return $o.off.apply($o, arguments);
  };
  publish = function() {
    return $o.trigger.apply($o, arguments);
  };
  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    publish: publish
  };
});
