/*!
 * jQuery Mag Glass Plugin v0.0.1
 * https://github.com/rainum/jquery-mag-glass
 *
 * Copyright 2014, Vazha Omanashvili
 * http://rainum.me
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * 2014-07-04
 */

(function ($) {
  'use strict';

  var MagGlass = function (element, options) {
    this.options = $.extend({}, MagGlass.DEFAULTS, options);
    this.$element = $(element);
    this.getImageSize(this.createLens);
  };

  MagGlass.DEFAULTS = {
    lensPosition: {
      top: 50,
      left: 20
    },
    lensSize: {
      width: 260,
      height: 260
    },
    lensClass: 'mag-glass',
    lensResetTimeout: 700,
    lensResetSpeed: 500
  };

  MagGlass.prototype.createLens = function () {
    this.$lens = $('<div/>', {
      class: this.options.lensClass
    }).css({
          width: this.options.lensSize.width,
          height: this.options.lensSize.height,
          display: 'none',
          position: 'absolute',
          backgroundImage: 'url(' + this.$element.attr('src') + ')'
        }).appendTo('body');

    this.resetLensPosition();
    this.handleEvents();
  };

  MagGlass.prototype.getImageSize = function (callback) {
    var _this = this;

    $('<img />')
        .attr('src', this.$element.attr('src'))
        .on('load', function () {
          _this.aspectRatio = {
            width: this.width / _this.$element.width(),
            height: this.height / _this.$element.height()
          };

          callback.call(_this);
        });
  };

  MagGlass.prototype.handleEvents = function () {
    this.$lens.mousemove($.proxy(this.setLensPosition, this));
    this.$element.mousemove($.proxy(this.setLensPosition, this));
  };

  MagGlass.prototype.resetLensPosition = function (animate) {
    this.setLensPosition(
        null,
        this.$element.offset().left + this.options.lensPosition.left,
        this.$element.offset().top + this.options.lensPosition.top,
        animate
    );
  };

  MagGlass.prototype.setLensPosition = function (e, pageX, pageY, animate) {
    pageX = e ? e.pageX : pageX;
    pageY = e ? e.pageY : pageY;

    var leftPos = parseInt(pageX - this.$element.offset().left);
    var topPos = parseInt(pageY - this.$element.offset().top);
    var _this = this;

    clearTimeout(this.lensResetTimeout);

    if (leftPos < 0 || topPos < 0 || leftPos > this.$element.width() || topPos > this.$element.height()) {
      this.lensResetTimeout = setTimeout(function () {
        _this.resetLensPosition(true);
      }, this.options.lensResetTimeout);
    } else {
      var lensStyle = {
        backgroundPositionX: -((leftPos) * this.aspectRatio.width - this.$lens.width() / 2),
        backgroundPositionY: -((topPos) * this.aspectRatio.height - this.$lens.height() / 2),
        left: pageX - this.$lens.width() / 2,
        top: pageY - this.$lens.height() / 2
      };

      this.$lens.fadeIn(500);

      if (animate) {
        this.$lens
            .stop(true, true, true)
            .animate(lensStyle, this.options.lensResetSpeed);
      } else {
        this.$lens.css(lensStyle);
      }
    }
  };

  MagGlass.prototype.showLens = function (show) {
    return show ? this.$lens.fadeIn() : this.$lens.hide();
  };

  // Plugin definition
  // =======================

  var old = $.fn.magGlass;

  $.fn.magGlass = function (option, value) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('magGlass');
      var options = $.extend({}, MagGlass.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) $this.data('magGlass', (data = new MagGlass(this, options)));
      if (typeof option === 'string') data[option](value);
    });
  };

  $.fn.magGlass.Constructor = MagGlass;

  // Plugin no conflict
  // =================

  $.fn.magGlass.noConflict = function () {
    $.fn.magGlass = old;
    return this;
  };

  $(window).on('resize', function () {
    $(':data(magGlass)').each(function () {
      var magGlass = $(this).data('magGlass');
      magGlass.resetLensPosition();
    });
  });
})(jQuery);