(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.MapLayer = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var MapLayer = _react2.default.createClass({
    displayName: 'MapLayer',

    propTypes: {
      map: _react2.default.PropTypes.object.isRequired,
      config: _react2.default.PropTypes.object.isRequired
    },

    componentDidMount: function componentDidMount() {
      this.map = this.props.map.mapObject;
      this.map.addLayer(this.props.config);
    },
    componentWillUnmount: function componentWillUnmount() {
      this.map.removeLayer(this.props.config.id);
    },
    render: function render() {
      return null;
    }
  });

  exports.default = MapLayer;
});