(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Jane', './JaneLayer'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Jane'), require('./JaneLayer'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Jane, global.JaneLayer);
    global.index = mod.exports;
  }
})(this, function (exports, _Jane, _JaneLayer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.JaneLayer = exports.Jane = undefined;

  var _Jane2 = _interopRequireDefault(_Jane);

  var _JaneLayer2 = _interopRequireDefault(_JaneLayer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.Jane = _Jane2.default;
  exports.JaneLayer = _JaneLayer2.default;
});