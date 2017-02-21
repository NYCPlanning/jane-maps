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
    global.RasterSource = mod.exports;
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

  var RasterSource = _react2.default.createClass({
    displayName: 'RasterSource',


    propTypes: {
      map: _react2.default.PropTypes.object.isRequired,
      source: _react2.default.PropTypes.object.isRequired,
      onLoaded: _react2.default.PropTypes.func.isRequired
    },

    componentWillMount: function componentWillMount() {
      this.map = this.props.map.mapObject;
      // fetch data if necessary, add layer to map
      this.addSource(this.props.source.tiles);
    },
    addSource: function addSource(tiles) {
      if (this.map.getSource(this.props.source.id)) {
        this.map.removeSource(this.props.source.id);
      }

      this.map.addSource(this.props.source.id, {
        type: 'raster',
        tiles: [tiles]
      });

      this.props.onLoaded(this.map.getStyle().sources);
    },
    render: function render() {
      return null;
    }
  });

  exports.default = RasterSource;
});