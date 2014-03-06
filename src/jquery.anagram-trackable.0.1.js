/**
 * Anagram Trackable jQuery Plugin v0.1
 *
 * The purpose of this plugin is enable Google Analytics custom events tracking through data attributes, and automatic error logging.
 * For usage, please refer to the Jasmine test suite and fixture.
 *
 * Copyright 2014 Anagram Inc.
 * Released under the MIT License
 *
 * Date: 2014-03-06T08:29:27Z
 */
(function($) {
	$.fn.anagramTrackable = function(options) {
		/************************************************************************************
		 * Plugin defaults and globals
		 ***********************************************************************************/
		var
			GA_SEND = 'send',
			GA_EVENT = 'event',
			GA_EXCEPTION = 'exception',
			GA_EXCEPTION_DESCRIPTION = 'exDescription',
			GA_NO_HIT = 'nonInteraction',
			GA_PAGE = 'page',
			oldErrorHandler = window.onerror;

		/**
		 * Global error handler to send JavaScript error logs to Google Analytics
		 * @param {string} message The error message
		 * @param {string} url The source URL that threw the exception
		 * @param {number} line The line number
		 * @return {boolean} Always returns false to propagate to other error handlers
		 */
		window.onerror = function(message, url, line) {
			var gaData = {};

			if (typeof ga !== 'undefined') {
				gaData[GA_EXCEPTION_DESCRIPTION] = url + ':' + line + ':' + message;
				ga('send', GA_EXCEPTION, gaData);
			}

			oldErrorHandler.apply(window, arguments);
			return false;
		};

		/************************************************************************************
		 * Class definition
		 ***********************************************************************************/

		/**
		 * Class trackable object.
		 * @param {object} $context The jQuery DOM object.
		 * @param {object} options The options which would over-ride the default settings.
		 */
		function AnagramTrackable($context, options) {

			/************************************************************************************
			 * Private methods
			 ***********************************************************************************/

			/**
			 * Inspect an element's data attributes and resolve the event it need.
			 * @param {string} str The master string containing possible placeholder strings.
			 * @param {object} mapObj Mapping of searching strings as keys, with a replacement string as its value.
			 * @return {string} This returns the replaced string.
			 */
			function _resolveCustomEvent() {
			}

			/***********************************************************************************/

			var _settings = $.extend(true, DEFAULTS, options);

			$context.find('[data-trackable]').each(_resolveCustomEvent);

			return this;
		}

		// Ensuring if context is a collection of forms, each one is initialized with its own AnagramTrackable instance.
		// Returning the jQuery context for further chaining.
		return this.each(function() {
			if (!$(this).data('anagram-trackable-object')) {
				$(this).data('anagram-trackable-object', new AnagramTrackable($(this), options));
			}
		});
	};
}(jQuery));