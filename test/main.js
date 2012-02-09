/*global require*/

(function (require) {
	'use strict';

	require.config({
		paths: {
			ajaxPreparer: '../ajaxPreparer',
			'qunit-official': 'qunit',
			qunit: 'qunit-module-patch'
		}
	});

	require(['tests']);
}(require));