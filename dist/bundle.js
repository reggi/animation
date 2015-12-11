/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _animation = __webpack_require__(2);

	var _animation2 = _interopRequireDefault(_animation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var animation = new _animation2.default({
	  'node': '#main',
	  'to': {
	    'margin': '30px'
	  },
	  'fps': 60
	});

	var $button = document.querySelectorAll('#action')[0];

	$button.onclick = function () {
	  console.log('Click event fired');
	  animation.run(300);
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Animation = Animation;
	var getDOMNode = exports.getDOMNode = function getDOMNode(selector, _window) {
	  _window = _window || window;
	  var $node = _window.document.querySelectorAll(selector);
	  if ($node.length === 0) throw new Error('missing DOM node ' + selector);
	  return $node[0];
	};

	var getStyle = exports.getStyle = function getStyle($node, style, _window) {
	  _window = _window || window;
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
	  if (typeof value !== 'string') return '';
	  return value.replace(/\d|\-|\./g, '');
	};

	var getCSSValue = exports.getCSSValue = function getCSSValue(value) {
	  if (typeof value !== 'string') return value;
	  var unit = getCSSUnit(value);
	  var strValue = value.replace(unit, '');
	  return parseFloat(strValue, 10);
	};

	var getNumberOfFrames = exports.getNumberOfFrames = function getNumberOfFrames(duration, fps) {
	  return duration / 1000 * fps;
	};

	var getInterval = exports.getInterval = function getInterval(duration, numberOfFrames) {
	  return duration / numberOfFrames;
	};

	var getIncrementStyles = exports.getIncrementStyles = function getIncrementStyles(fromStyles, toStyles, numberOfFrames) {
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

	var getNextFrame = exports.getNextFrame = function getNextFrame(fromStyles, incrementStyles, frame) {
	  var nextFrame = {};
	  Object.keys(fromStyles).forEach(function (style) {
	    var fromValue = fromStyles[style];
	    var incrementValue = incrementStyles[style];
	    var unit = getCSSUnit(fromValue);
	    var fromInt = getCSSValue(fromValue);
	    var incrementInt = getCSSValue(incrementValue);
	    var instanceStyleValue = fromInt + incrementInt * frame;
	    if (unit !== '') {
	      instanceStyleValue = instanceStyleValue + unit;
	    }
	    nextFrame[style] = instanceStyleValue;
	  });
	  return nextFrame;
	};

	var getFrameStyles = exports.getFrameStyles = function getFrameStyles(fromStyles, toStyles, numberOfFrames) {
	  var frameStyles = Array.from(new Array(Math.ceil(numberOfFrames)), function (x, i) {
	    return i;
	  });
	  var incrementStyles = getIncrementStyles(fromStyles, toStyles, numberOfFrames);
	  return frameStyles.map(function (frame) {
	    frame = frame + 1;
	    return getNextFrame(fromStyles, incrementStyles, frame);
	  });
	};

	var getFromStyles = exports.getFromStyles = function getFromStyles($node, fromStyles, toStyles, _window) {
	  _window = _window || window;
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
	    console.log(frame);
	    frame = frame + 1;
	    if (frameStyles.length <= frame) {
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

	exports.default = Animation;

/***/ }
/******/ ]);