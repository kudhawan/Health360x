/**
 * Created by hale on 2016/12/29.
 */

;(function ($, window, document, undefined) {
  
  var Gauge = function (el) {
    this.$element = el,
      this.defaults = {},
      this.options = $.extend({}, this.defaults, {})
  };
  
  Gauge.prototype = {
      colors: ['gauge-red', 'gauge-yellow' , 'gauge-green', 'gauge-orange', 'gauge-red'],
    partSize: 0,
    initParams: function () {
        var colorLen = Gauge.prototype.colors.length;
      Gauge.prototype.partSize = 100.0 / colorLen;
    },
    createGauge: function (elArray) {
      elArray.each(function () {
        Gauge.prototype.updateGauge($(this));
      });
      
      //添加updateGauge事件 更新百分比
      elArray.bind('updateGauge', function (e, num) {
        $(this).data('percentage', num);
        Gauge.prototype.updateGauge($(this));
      });
    },
    updateGauge: function (el) {
      Gauge.prototype.initParams();
      var percentage = el.data('percentage');
      percentage = (percentage > 100) ? 100 : (percentage < 0) ? 0 : percentage;

      var color;
      
      if (percentage <= 16)
          color = Gauge.prototype.colors[0];
      else if (percentage > 16 && (percentage <= 22))
          color = Gauge.prototype.colors[1];
      else if (percentage > 22 && (percentage <= 45))
          color = Gauge.prototype.colors[2];
      else if (percentage > 45 && (percentage <= 66))
          color = Gauge.prototype.colors[1];
      else if (percentage > 66)
          color = Gauge.prototype.colors[4];

      color = color || Gauge.prototype.colors[Gauge.prototype.colors.length - 1];

      el.css('transform', 'rotate(' + ((1.8 * percentage) - 90) + 'deg)');
      el.parent()
        .removeClass(Gauge.prototype.colors.join(' '))
        .addClass(color);
    }
  };
  
  $.fn.cmGauge = function () {
    var gauge = new Gauge(this);
    return gauge.createGauge(this);
  }
  
})(jQuery, window, document);