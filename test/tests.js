/*global require, module, test, ok, strictEqual, deepEqual*/

require(['jquery', 'subscribe', 'unsubscribe', 'ajaxPreparer', 'qunit'], function ($, subscribe, unsubscribe, ajaxPreparer) {
	'use strict';

	var $fixture = $('#qunit-fixture');

	module('anchors', {
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

	test('test for anchor with valid href', 12, function () {
		var	$a = $('<a/>', {
				'class': 'test',
				href: 'http://www.google.com/'
			}).appendTo($fixture);

		subscribe('click', 'a.test', ajaxPreparer);

		subscribe('/ajax/preparer/started', function (e, ajaxOptions) {
			ok(true, 'started event called');
			strictEqual(ajaxOptions.type, 'get', 'anchors should always be a get request');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0], 'verify context is set correctly');
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
			deepEqual(ajaxOptions.context, $a[0], 'verify context is set correctly');
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
			deepEqual(ajaxOptions.context, $a[0], 'verify context is set correctly');
		});

		subscribe('/ajax/preparer/error', function (e, ajaxOptions) {
			ok(true, 'error event called');
		});

		subscribe('/ajax/preparer/complete', function (e, ajaxOptions) {
			ok(true, 'complete event called');
			strictEqual(ajaxOptions.type, 'get', 'anchors should always be a get request');
			strictEqual(ajaxOptions.url, '', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0], 'verify context is set correctly');
		});

		$a.click();
	});

	test('test for anchor with meta options', 4, function () {
		var	$a = $('<a/>', {
				'class': 'test',
				href: 'http://www.google.com/',
				'data-ajax-options': '{"ajaxOptions": {"type": "post"}}'
			}).appendTo($fixture);

		subscribe('click', 'a.test', ajaxPreparer);

		subscribe('/ajax/preparer/started', function (e, ajaxOptions) {
			ok(true, 'started event called');
			strictEqual(ajaxOptions.type, 'post', 'ajaxOptions should override request type to post');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'verify url is gathered from the href attribute');
			deepEqual(ajaxOptions.context, $a[0], 'verify context is set correctly');
		});

		$a.click();
	});

	module('inputs', {
		teardown: function () {
			$fixture.empty();

			unsubscribe('change', 'input.test');
			unsubscribe('/ajax/preparer/started');
			unsubscribe('/ajax/preparer/success');
			unsubscribe('/ajax/preparer/error/invalidTag');
			unsubscribe('/ajax/preparer/error/missingUrl');
			unsubscribe('/ajax/preparer/error');
			unsubscribe('/ajax/preparer/complete');
		}
	});

	test('test for common input scenario', 12, function () {
		var $form = $('<form/>', {
				method: 'get',
				action: 'http://www.google.com/'
			}).appendTo($fixture),
			$input = $('<input/>', {
				'class': 'test',
				type: 'text'
			}).appendTo($form);

		subscribe('change', 'input.test', ajaxPreparer);

		subscribe('/ajax/preparer/started', function (e, ajaxOptions) {
			ok(true, 'started event called');
			strictEqual(ajaxOptions.type, 'get', 'request type should be retrieved from the form method');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'request action should be retrieved from the form action');
			deepEqual(ajaxOptions.context, $input[0], 'verify context is set correctly');
		});

		subscribe('/ajax/preparer/success', function (e, ajaxOptions) {
			ok(true, 'success event called');
			strictEqual(ajaxOptions.type, 'get', 'request type should be retrieved from the form method');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'request action should be retrieved from the form action');
			deepEqual(ajaxOptions.context, $input[0], 'verify context is set properly');
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
			strictEqual(ajaxOptions.type, 'get', 'request type should be retrieved from the form method');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'request action should be retrieved from the form action');
			deepEqual(ajaxOptions.context, $input[0], 'verify context is set properly');
		});

		$input.change();
	});

	test('test for change in method', 18, function () {
		var $form = $('<form/>', {
				method: 'post',
				action: 'http://www.google.com/',
				'data-ajax-options': '{"ajaxOptions": {"dataType": "json"}}'
			}).appendTo($fixture),
			$input = $('<input/>', {
				'class': 'test',
				name: 'FirstName',
				type: 'text',
				value: 'Cary'
			}).appendTo($form);

		subscribe('change', 'input.test', ajaxPreparer);

		subscribe('/ajax/preparer/started', function (e, ajaxOptions) {
			ok(true, 'started event called');
			strictEqual(ajaxOptions.type, 'post', 'request type should be retrieved from the form method');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'request action should be retrieved from the form action');
			deepEqual(ajaxOptions.context, $input[0], 'verify context is set correctly');
			strictEqual(ajaxOptions.data, 'FirstName=Cary', 'verify payload was gathered from form fields');
			strictEqual(ajaxOptions.dataType, 'json', 'ajaxOptions should be retrieved from the form');
		});

		subscribe('/ajax/preparer/success', function (e, ajaxOptions) {
			ok(true, 'success event called');
			strictEqual(ajaxOptions.type, 'post', 'request type should be retrieved from the form method');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'request action should be retrieved from the form action');
			deepEqual(ajaxOptions.context, $input[0], 'verify context is set properly');
			strictEqual(ajaxOptions.data, 'FirstName=Cary', 'verify payload was gathered from form fields');
			strictEqual(ajaxOptions.dataType, 'json', 'ajaxOptions should be retrieved from the form');
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
			strictEqual(ajaxOptions.type, 'post', 'request type should be retrieved from the form method');
			strictEqual(ajaxOptions.url, 'http://www.google.com/', 'request action should be retrieved from the form action');
			deepEqual(ajaxOptions.context, $input[0], 'verify context is set properly');
			strictEqual(ajaxOptions.data, 'FirstName=Cary', 'verify payload was gathered from form fields');
			strictEqual(ajaxOptions.dataType, 'json', 'ajaxOptions should be retrieved from the form');
		});

		$input.change();
	});
});