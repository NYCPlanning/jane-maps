(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.SelectedFeaturesPane = mod.exports;
  }
})(this, function (exports, _react) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var SelectedFeauturesPane = function SelectedFeauturesPane(props) {
    return _react2.default.createElement(
      "div",
      { className: "jane-selected-features", style: props.style },
      props.children
    );
  };

  SelectedFeauturesPane.propTypes = {
    children: _react2.default.PropTypes.array.isRequired,
    style: _react2.default.PropTypes.shape().isRequired
  };

  exports.default = SelectedFeauturesPane;
});