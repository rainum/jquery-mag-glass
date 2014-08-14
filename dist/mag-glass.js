/*!
 * jQuery Mag Glass Plugin v0.0.8
 * https://github.com/rainum/jquery-mag-glass
 *
 * Copyright 2014, Vazha Omanashvili
 * http://rainum.me
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * 2014-08-14
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
    $(document).on('mousemove', $.proxy(this.setLensPosition, this));
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
        backgroundPosition: -((leftPos) * this.aspectRatio.width - this.$lens.width() / 2) + 'px ' +
                            -((topPos) * this.aspectRatio.height - this.$lens.height() / 2) + 'px',
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

  // Fix backgroundPosition animation in Gecko.
  // Thanks to Alexander Farkas
  // =================

  $.extend($.fx.step, {
    backgroundPosition: function (fx) {
      if (fx.pos === 0 && typeof fx.end == 'string') {
        var start = $.css(fx.elem, 'backgroundPosition');
        start = toArray(start);
        fx.start = [start[0], start[2]];
        var end = toArray(fx.end);
        fx.end = [end[0], end[2]];
        fx.unit = [end[1], end[3]];
      }
      var nowPosX = [];
      nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
      nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
      fx.elem.style.backgroundPosition = nowPosX[0] + ' ' + nowPosX[1];

      function toArray(strg) {
        strg = strg.replace(/left|top/g, '0px');
        strg = strg.replace(/right|bottom/g, '100%');
        strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g, "$1px$2");
        var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
        return [parseFloat(res[1], 10), res[2], parseFloat(res[3], 10), res[4]];
      }
    }
  });

  // TODO implement data-api
})(jQuery);