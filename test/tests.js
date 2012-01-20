/*global require*/

require(['jquery', 'publish', 'subscribe', 'unsubscribe', 'ajaxPreparer', 'doc', 'qunit'], function ($, publish, subscribe, unsubscribe, ajaxPreparer, $doc, window) {
	'use strict';

	var $fixture = $('#qunit-fixture');

	module('core', {
		teardown: function () {
			$fixture.empty();

			unsubscribe('click', 'a.test');
			unsubscribe('/ajax/preparer/started');
			unsubscribe('/ajax/preparer/success');
			unsubscribe('/ajax/preparer/error/invalidTag');
			unsubscribe('/ajax/preparer/error/missingUrl');
			unsubscribe('/ajax/preparer/error');
			unsubscribe('/ajax/preparer/complete');
		}
	});

	test('test for common scenario anchor clicks', 12, function () {
		var	$a = $('<a/>', {
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

		subscribe('/ajax/preparer/error/invalidTag', function (e, ajaxOptions) {
			ok(false, 'invalidTag event should not fire');
		});

		subscribe('/ajax/preparer/error/missingUrl', function (e, ajaxOptions) {
			ok(false, 'missingUrl event should not fire');
		});

		subscribe('/ajax/preparer/error', function (e, ajaxOptions) {
			ok(false, 'error event should not fire');
		});

		subscribe('/ajax/preparer/complete', function (e, ajaxOptions) {
			ok(true, 'complete event called');
			strictEqual(ajaxOptions.type, 'get', 'anchors should always be a get request');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0], 'verify context is set properly');
		});

		$a.click();
	});

	test('test for anchor without valid href', 13, function () {
		var	$a = $('<a/>', {
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
			ok(false, 'success event should not fire');
		});

		subscribe('/ajax/preparer/error/invalidTag', function (e, ajaxOptions) {
			ok(false, 'invalidTag event should not fire');
		});
		
		subscribe('/ajax/preparer/error/missingUrl', function (e, ajaxOptions) {
			ok(true, 'missingUrl event called');
			strictEqual(ajaxOptions.type, 'get', 'anchors should always be a get request');
			strictEqual(ajaxOptions.url, '', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0]);
		});

		subscribe('/ajax/preparer/error', function (e, ajaxOptions) {
			ok(true, 'error event called');
		});

		subscribe('/ajax/preparer/complete', function (e, ajaxOptions) {
			ok(true, 'complete event called');
			strictEqual(ajaxOptions.type, 'get', 'anchors should always be a get request');
			strictEqual(ajaxOptions.url, '', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0]);
		});

		$a.click();
	});
});