/*global require*/

require(['jquery', 'publish', 'subscribe', 'unsubscribe', 'ajaxPreparer', 'doc', 'qunit'], function ($, publish, subscribe, unsubscribe, ajaxPreparer, $doc, window) {
	'use strict';

	test('test for common scenario anchor clicks', 12, function () {
		var	$fixture = $('#qunit-fixture'),
			$a = $('<a/>', {
				'class': 'test',
				'href': 'http://www.google.com/'
			}).appendTo($fixture);

		subscribe('click', 'a.test', ajaxPreparer);

		subscribe('/ajax/preparer/started', function (e, ajaxOptions) {
			ok(true, 'started event called');
			strictEqual(ajaxOptions.type, 'get', 'anchors should always be a get request');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0]);
		});

		subscribe('/ajax/preparer/success', function (e, ajaxOptions) {
			ok(true, 'success event called');
			strictEqual(ajaxOptions.type, 'get', 'anchors should always be a get request');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0], 'verify context is set properly');
		});

		// this event should not fire, there should be no errors
		subscribe('/ajax/preparer/error/invalidTag', function (e, ajaxOptions) {
			ok(true, 'invalidTag event called');
		});

		// this event should not fire, there should be no errors
		subscribe('/ajax/preparer/error/missingUrl', function (e, ajaxOptions) {
			ok(true, 'missingUrl event called');
		});

		// this event should not fire, there should be no errors
		subscribe('/ajax/preparer/error', function (e, ajaxOptions) {
			ok(true, 'error event called');
		});

		subscribe('/ajax/preparer/complete', function (e, ajaxOptions) {
			ok(true, 'complete event called');
			strictEqual(ajaxOptions.type, 'get', 'anchors should always be a get request');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0], 'verify context is set properly');
		});

		$a.click();

		unsubscribe('click', 'a.test', ajaxPreparer);
		unsubscribe('/ajax/preparer/started');
		unsubscribe('/ajax/preparer/success');
		unsubscribe('/ajax/preparer/error/invalidTag');
		unsubscribe('/ajax/preparer/error/missingUrl');
		unsubscribe('/ajax/preparer/error');
		unsubscribe('/ajax/preparer/complete');

		$fixture.empty();
	});

	test('test for anchor without valid href', 4, function () {
		var	$fixture = $('#qunit-fixture'),
			$a = $('<a/>', {
				'class': 'test'
			}).appendTo($fixture);
		
		subscribe('click', 'a.test', ajaxPreparer);

		subscribe('/ajax/preparer/started', function (e, ajaxOptions) {
			ok(true, 'started event called');
			strictEqual(ajaxOptions.type, 'get', 'anchors should always be a get request');
			strictEqual(ajaxOptions.url, '', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0]);
		});

		subscribe('/ajax/preparer/success', function (e, ajaxOptions) {
			ok(true, 'success event called');
		});

		$a.click();
	});

	/*test('console is equal to window.console', function () {
		strictEqual(window.console, console, 'window.console === console');
		ok(console.log, 'console.log exists');
		strictEqual(window.console.log, console.log, 'window.console.log === console.log');
		strictEqual(console.cary, undefined, 'console.cary is undefined');
		raises(function () {
			console.cary('this should raise an exception');
		}, 'console.cary raises an exception');
	});*/
});