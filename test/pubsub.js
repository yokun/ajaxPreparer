/*!
 * pubsub
 * Version:  1.2.1
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
 */

/*global define*/

define(['jquery', 'doc'], function ($, $doc) {
	'use strict';

	// treat topics with a preceeding slash as a custom event
	function isCustomEvent(topic) {
		return topic.charAt(0) === '/';
	}

	var $o = $({}),
		slice = [].slice,
		module = {
			subscribe: function (topic) {
				if (!isCustomEvent(topic)) {
					if (arguments.length >= 3) {
						$doc.on.apply($doc, arguments);
					} else {
						$doc.on(topic, function () {
							module.publish.apply(this, [topic, slice.call(arguments, 1)]);
						});
					}
				}

				$o.on.apply($o, arguments);
			},

			unsubscribe: function (topic) {
				if (!isCustomEvent(topic)) {
					$doc.off.apply($doc, arguments);
				}

				$o.off.apply($o, arguments);
			},

			publish: function () {
				$o.trigger.apply($o, arguments);
			}
		};

	return module;
});