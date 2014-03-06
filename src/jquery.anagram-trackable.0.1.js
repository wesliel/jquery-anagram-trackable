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

oldErrorHandler =  window.onerror;

(function($) {
  $.fn.anagramTrackable = function(options) {
    /************************************************************************************
     * Plugin defaults and globals
     ***********************************************************************************/
    var
      DEFAULTS = {},
      GA_SEND = 'send',
      GA_EVENT = 'event',
      GA_EXCEPTION = 'exception',
      GA_EXCEPTION_DESCRIPTION = 'exDescription',
      GA_NO_HIT = 'nonInteraction',
      GA_PAGE = 'page';

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

      if (oldErrorHandler) {
        oldErrorHandler.apply(window, arguments);
      }

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
       * Event handler methods
       ***********************************************************************************/

      /**
       * Event handler for trigger a GA event
       * @param {event} event The jQuery event object triggered.
       */
      function _gaEventHandler(event) {
        var
          $this = $(this),
          gaData = {},
          gaArguments = [];

        if ($this.is('[data-no-hit]')) { gaData[GA_NO_HIT] = 1; }
        if ($this.is('[data-hit]')) { gaData[GA_PAGE] = $this.data('hit'); }

        // Required arguments
        gaArguments.push('send', 'event', $this.data('category'), event.type);

        if ($this.data('label')) { gaArguments.push($this.data('label')); }
        if ($this.data('value') && !isNaN(parseInt($this.data('value'), 10))) { gaArguments.push(parseInt($this.data('value'), 10)); }
        if (Object.keys(gaData).length > 0) { gaArguments.push(gaData); }

        ga.apply(window, gaArguments);
      }

      /***********************************************************************************/

      var _settings = $.extend(true, DEFAULTS, options);

      $context.find('[data-trackable]').each(function() {
        var $this = $(this);
        $this.on($this.data('event'), _gaEventHandler);
      });

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