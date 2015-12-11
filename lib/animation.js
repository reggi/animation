'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Animation = Animation;
var getDOMNode = exports.getDOMNode = function getDOMNode(selector, _window) {
  _window = _window ? _window : window;
  var $node = _window.document.querySelectorAll(selector);
  if ($node.length === 0) throw new Error('missing DOM node ' + selector);
  return $node[0];
};

var getStyle = exports.getStyle = function getStyle($node, style, _window) {
  _window = _window ? _window : window;
  if ($node.currentStyle) {
    return $node.currentStyle[style];
  } else if (_window.getComputedStyle) {
    return _window.document.defaultView.getComputedStyle($node, null).getPropertyValue(style);
  }
};

var setStyle = exports.setStyle = function setStyle($node, style, value) {
  $node.style[style] = value;
  return $node.style[style] === value;
};

var setStyles = exports.setStyles = function setStyles($node, styles) {
  return Object.keys(styles).map(function (style) {
    var value = styles[style];
    return setStyle($node, style, value);
  });
};

var getCSSUnit = exports.getCSSUnit = function getCSSUnit(value) {
  if (typeof value !== 'string') return "";
  return value.replace(/\d|\-/g, '');
};

var getCSSValue = exports.getCSSValue = function getCSSValue(value) {
  if (typeof value !== 'string') return value;
  var unit = getCSSUnit(value);
  var strValue = value.replace(unit, '');
  return parseInt(strValue, 10);
};

var getNumberOfFrames = exports.getNumberOfFrames = function getNumberOfFrames(duration, fps) {
  return duration / 1000 * fps;
};

var getInterval = exports.getInterval = function getInterval(duration, numberOfFrames) {
  return duration / numberOfFrames;
};

var getIncrementStyles = exports.getIncrementStyles = function getIncrementStyles(fromStyles, toStyles, numberOfFrames) {
  var frameStyles = [];
  var increments = {};
  Object.keys(toStyles).forEach(function (style) {
    var toStylesValue = toStyles[style];
    var fromStylesValue = fromStyles[style];
    var toUnit = getCSSUnit(toStylesValue);
    var fromUnit = getCSSUnit(fromStylesValue);
    if (toUnit !== fromUnit) throw Error('incompatable units for ' + style + ': to uses \'' + toUnit + '\' and from uses \'' + fromUnit + '\'\'');
    var toInt = getCSSValue(toStylesValue);
    var fromInt = getCSSValue(fromStylesValue);
    var distance = Math.abs(toInt - fromInt);
    var increment = distance / numberOfFrames;
    if (toUnit !== '') {
      increments[style] = increment + toUnit;
    } else {
      increments[style] = increment;
    }
  });
  return increments;
};

// fromInt + (Math.abs(toInt - fromInt) / numberOfFrames) * (frame + 1)

var getFrameStyles = exports.getFrameStyles = function getFrameStyles(fromStyles, toStyles, numberOfFrames) {
  var frameStyles = Array.from(new Array(numberOfFrames), function (x, i) {
    return i;
  });
  var incrementStyles = getIncrementStyles(fromStyles, toStyles, numberOfFrames);
  return frameStyles.map(function (empty, frame) {
    var instance = {};
    Object.keys(toStyles).forEach(function (style) {
      var fromValue = fromStyles[style];
      var incrementValue = incrementStyles[style];
      var fromUnit = getCSSUnit(fromValue);
      var fromInt = getCSSValue(fromValue);
      var incrementInt = getCSSValue(incrementValue);
      var instanceStyleValue = fromInt + incrementInt * (frame + 1);
      if (fromUnit !== '') {
        instanceStyleValue = instanceStyleValue + fromUnit;
      }
      instance[style] = instanceStyleValue;
    });
    return instance;
  });
};

var getFromStyles = exports.getFromStyles = function getFromStyles($node, fromStyles, toStyles, _window) {
  _window = _window ? _window : window;
  var styles = {};
  Object.keys(toStyles).forEach(function (style) {
    if (typeof fromStyles[style] !== 'undefined') {
      styles[style] = fromStyles[style];
    } else {
      var DOMStyle = getStyle($node, style, _window);
      if (DOMStyle !== '') {
        styles[style] = DOMStyle;
      } else {
        var unit = getCSSUnit(toStyles[style]);
        if (unit !== '') {
          styles[style] = 0 + unit;
        } else {
          styles[style] = 0;
        }
      }
    }
  });
  return styles;
};

var runAnimation = exports.runAnimation = function runAnimation(nodeSelector, duration) {
  var rawFromStyles = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var toStyles = arguments[3];
  var fps = arguments[4];
  var _window = arguments[5];

  if (!nodeSelector) throw new Error('missing node property');
  var $node = getDOMNode(nodeSelector, _window);
  var fromStyles = getFromStyles($node, rawFromStyles, toStyles, _window);
  var numberOfFrames = getNumberOfFrames(duration, fps);
  var interval = getInterval(duration, numberOfFrames);
  var frameStyles = getFrameStyles(fromStyles, toStyles, numberOfFrames);
  var frame = 0;
  var intervalEvent = setInterval(function () {
    setStyles($node, frameStyles[frame]);
    frame = frame + 1;
    if (frameStyles.length - 1 <= frame) {
      clearInterval(intervalEvent);
    }
  }, interval);
};

function Animation(obj, _window) {
  var _this = this;

  this.run = function (duration) {
    runAnimation(obj.node, duration, obj.from, obj.to, obj.fps || 30, _window);
    return _this;
  };
  return this;
}

exports.default = exports.Animation = Animation = Animation;