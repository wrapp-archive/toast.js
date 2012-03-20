Toast.js
========
Toast.js is an animated graphic element used to display short messages to the user.
This is based on toasts in Android.

Features
========
* No dependencies
* No images
* Uses CSS3 for animation
* Highly customizable through CSS and Javascript
* Works in all major browsers including IE7 (and possibly IE6)
* Graceful degradation
* Small JS footprint (≈2.2K gzipped, ≈7.5K minified)
* Small CSS footprint (≈0.5K gzipped, ≈2.9K minified)
* Object oriented
* MIT License

Building
========
You can skip this if you just want the latest stable version.
The master branch always has up to date builds.

Prerequisites
-------------
* [Rake](http://rake.rubyforge.org/)
* [Bundler](http://gembundler.com/)

Initializing submodules
-----------------------
 - `git submodule init`
 - `git submodule update`

Running the build
-----------------
- `bundle install`
- `rake build` or just `rake`

Cleaning
--------
There is a `rake clean` command which simply removes the build directory.

Installation
============
If you want the coffeescript and/or SCSS the source is in the `src/{coffeescripts,scss}` directories.

Otherwise just take the `build/javascripts/toast-min.js` (or the non minified version) and include it in your application.
If you'd like to use the default styles also take the `build/stylesheets/toast.css` file and include that.

An important note is that if you use your own styles and those styles does not contain CSS animations make sure to set `animate` to false. This way the timings become accurate.

Usage
=====
Here is a basic example:

    new Toast().show({content: 'Hello, toast!', duration: 'long'})

Examples
--------
An example can be found in the examples directory or at [the example site](http://wrapp.github.com/toast.js).

Instance variables
------------------
Changing any of these will be reflected the next time the toast is shown.

* `element` - The toast element. Will be a `div` element.
* `content` - The content of the toast. Can either be a `string` or a `function`.
* `duration` - The duration of the toast in ms, other values are `short` (2s), `medium` (4s), `long`(6s) or `infinite`. Default is `medium`.
* `allowHTML` - A flag indicating if HTML is escaped in the content or not. Default is `false`.
* `id` - The ID of the toast.
* `className` - Any additional class(es) of the toast separated by a space.
* `animate` - A flag to indicate whether to apply the `animate` class. Make sure to set this to false if you remove the CSS animations.

Constructor options
-------------------
All of the instance variables except the element can be set in the constructor.

Public methods
--------------
* `show([options])` - Shows the toast. The options are the same as the constructor.
* `hide([options])` - Hides the toast, useful if duration is `infinite`. The options include an `animate` parameter which is useful when you need to hide it straight away.
* `isShowing` - Returns `true` if the toast is showing. While the toast is in the process of being hidden this will return `false`.

Contact
=======
To report any problems or suggestions please use the [GitHub issue tracker](https://github.com/wrapp/toast.js/issues).

License
=======
This project is licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).

Changelist
==========
### 1.0.1
* Bump the version of transition-callbacks.js
* Add some clearer instructions to the README.

### 1.0
* Initial release.
