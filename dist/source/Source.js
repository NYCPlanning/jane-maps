(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', './GeoJsonSource', './RasterSource', './CartoVectorSource', './CartoRasterSource'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('./GeoJsonSource'), require('./RasterSource'), require('./CartoVectorSource'), require('./CartoRasterSource'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.GeoJsonSource, global.RasterSource, global.CartoVectorSource, global.CartoRasterSource);
    global.Source = mod.exports;
  }
})(this, function (exports, _react, _GeoJsonSource, _RasterSource, _CartoVectorSource, _CartoRasterSource) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _GeoJsonSource2 = _interopRequireDefault(_GeoJsonSource);

  var _RasterSource2 = _interopRequireDefault(_RasterSource);

  var _CartoVectorSource2 = _interopRequireDefault(_CartoVectorSource);

  var _CartoRasterSource2 = _interopRequireDefault(_CartoRasterSource);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Source = _react2.default.createClass({
    displayName: 'Source',

    propTypes: {
      map: _react2.default.PropTypes.object.isRequired,
      source: _react2.default.PropTypes.object.isRequired,
      onLoaded: _react2.default.PropTypes.func.isRequired
    },

    componentWillUnmount: function componentWillUnmount() {
      this.removeSource();
    },
    removeSource: function removeSource() {
      this.props.map.mapObject.removeSource(this.props.source.id);
      // let jane know what sources are still loaded
      this.props.onLoaded(this.props.map.mapObject.getStyle().sources);
    },
    render: function render() {
      var source = this.props.source;

      if (source.type === 'geojson') return _react2.default.createElement(_GeoJsonSource2.default, this.props);
      if (source.type === 'raster') return _react2.default.createElement(_RasterSource2.default, this.props);
      if (source.type === 'cartovector' && source.options) return _react2.default.createElement(_CartoVectorSource2.default, this.props);
      if (source.type === 'cartoraster') return _react2.default.createElement(_CartoRasterSource2.default, this.props);

      return null;
    }
  });

  exports.default = Source;
});