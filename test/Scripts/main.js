/*global require*/

(function (require) {
	'use strict';

	require.config({
		paths: {
			ajaxPreparer: '../../ajaxPreparer',
			doc: 'core/doc',
			document: 'core/document',
			jquery: 'libs/jquery',
			publish: 'core/publish',
			pubsub: 'core/pubsub',
			'qunit-official': 'libs/qunit',
			qunit: 'libs/qunit-module-patch',
			subscribe: 'core/subscribe',
			unsubscribe: 'core/unsubscribe',
			window: 'core/window'
		}
	});

	require(['tests']);
}(require));