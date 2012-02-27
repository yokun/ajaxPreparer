# AJAX PREPARER

Prepare ajax calls via convention-based configuration.
Ajaxify anchors (links), inputs, and selects.
This handler's sole responsibility is to prepare the ajax call.
Upon preparation an event will be fired for consumption by another handler.


## Usage

This handler unobtrusively wires up event handlers and prepares an ajax call.

### Links/Anchors

Clicking on the link in the following HTML will redirect the user to the url within the href attribute.

``` html
<a href="http://path/to/my/resource" data-ajax="true">Click me</a>
```

There are times; however, when the desired effect is not to redirect the browser but fetch the content via an ajax call.  To do so, simply configure as such (this example uses [RequireJS](http://requirejs.org/) and [subscribe](https://github.com/CaryLandholt/subscribe):

``` javascript
require(['subscribe', 'ajaxPreparer'], function (subscribe, ajaxPreparer) {
	subscribe('click', 'a[data-ajax]', ajaxPreparer);
});
```

For links, the http verb is "get"; however, this can be overridden via meta options.  For example:

``` html
<a href="http://path/to/my/resource" data-ajax="true" data-ajax-options='{"ajaxOptions" : {"type" : "post"}}'>Click me</a>
```


### Forms

A similar technique is used for forms and form elements.

``` html
<form method="get" action="http://path/to/my/resource" data-ajax="true">
	<label for="FirstName">First Name</label>
	<input id="FirstName" name="FirstName" value="Cary" />
	<input type="submit" value="Submit" />
</form>
```

Then configure:

``` javascript
require(['subscribe', 'ajaxPreparer'], function (subscribe, ajaxPreparer) {
	subscribe('click', 'form[data-ajax] :submit', ajaxPreparer);
});
```

The form method, action, and serialized fields will be used to prepare the ajax call.  Additional options may be provided via the `data-ajax-options` attribute as was demonstrated earlier with the link example.


## Versioning

For transparency and insight into our release cycle, and for striving to maintain backwards compatibility, this module will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on SemVer, please visit http://semver.org/.


## Bug tracker

Have a bug?  Please create an issue here on GitHub!

https://github.com/CaryLandholt/ajaxPreparer/issues


## Author

**Cary Landholt**

+ http://twitter.com/CaryLandholt
+ http://github.com/CaryLandholt


## License

Copyright 2012 Cary Landholt

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.