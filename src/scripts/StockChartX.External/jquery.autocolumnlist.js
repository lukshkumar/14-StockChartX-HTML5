/*!
 * jQuery AutoColumnList Plugin
 * http://neolot.com/narabotki/autocolumnlist-jquery-plugin-dlya-razdeleniya-spiskov-na-kolonki
 * Copyright (c) 2011 Yury Pokhylko aka Neolot
 * Version: 1.0.2 (03/29/2011)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.3.2 or later
 * Updated by mihdan (http://kobzarev.com/)
 */

(function($) {
  var defaults = {
    columns: 4,
    classname: "column",
    min: 1
  };

  $.fn.autocolumnlist = function(params) {
    var options = $.extend({}, defaults, params);

    return this.each(function() {
      var els = $(this).find("li");
      var dimension = els.length;

      if (dimension > 0) {
        var elCol = Math.ceil(dimension / options.columns);
        if (elCol < options.min) {
          elCol = options.min;
        }
        var start = 0;
        var end = elCol;

        for (i = 0; i < options.columns; i++) {
          // Add "last" class for last column
          if (i + 1 == options.columns) {
            els
              .slice(start, end)
              .wrapAll('<div class="' + options.classname + ' last" />');
          } else {
            els
              .slice(start, end)
              .wrapAll('<div class="' + options.classname + '" />');
          }
          start = start + elCol;
          end = end + elCol;
        }
      }
    });
  };
})(window.jQuery);
