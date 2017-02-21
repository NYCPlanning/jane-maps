(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Jane'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Jane'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Jane);
    global.index = mod.exports;
  }
})(this, function (exports, _Jane) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Jane2 = _interopRequireDefault(_Jane);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _Jane2.default;
});