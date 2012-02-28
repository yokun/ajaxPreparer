/*!
 * qunit-module-patch
 * Version:  1.1.0
 * Source:  https://github.com/CaryLandholt/qunit-module-patch
 *
 * Copyright (c) 2012 Cary Landholt
 * https://github.com/CaryLandholt
 * https://twitter.com/CaryLandholt
 *
 * Description
 * A module wrapper around QUnit for use with AMD providers
 *
 * Dependencies
 * https://github.com/jquery/qunit
 * https://github.com/jrburke/requirejs
 */

/*global window, define*/

(function (window) {
	'use strict';

	define(['qunit-official'], function () {

		return window.QUnit;
	});
}(window));