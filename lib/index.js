'use strict';

var _animation = require('./animation');

var _animation2 = _interopRequireDefault(_animation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var animation = new _animation2.default({
  'node': '#main',
  'to': {
    'margin': '30px'
  }
});

var $button = document.querySelectorAll('#action')[0];

$button.onclick = function () {
  console.log('Click event fired');
  animation.run(300);
};