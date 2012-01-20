/*global require*/

(function (require) {
	'use strict';

	require.config({
		paths: {
			ajaxPreparer: '../ajaxPreparer',
			doc: 'doc/doc',
			document: 'document/document',
			jquery: 'jquery-build/dist/jquery',
			publish: 'publish/publish',
			pubsub: 'pubsub/pubsub',
			'qunit-official': 'qunit/qunit/qunit',
			qunit: 'qunit-module-patch/qunit-module-patch',
			subscribe: 'subscribe/subscribe',
			unsubscribe: 'unsubscribe/unsubscribe',
			window: 'window/window'
		}
	});

	require(['tests']);
}(require));