(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'mapbox-gl/dist/mapbox-gl'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('mapbox-gl/dist/mapbox-gl'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.mapboxGl);
    global.GLMap = mod.exports;
  }
})(this, function (exports, _react, _mapboxGl) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var GLMap = _react2.default.createClass({
    displayName: 'GLMap',

    propTypes: {
      mapbox_accessToken: _react2.default.PropTypes.string.isRequired,
      mapStyle: _react2.default.PropTypes.string.isRequired,
      zoom: _react2.default.PropTypes.number.isRequired,
      minZoom: _react2.default.PropTypes.number,
      center: _react2.default.PropTypes.array.isRequired,
      pitch: _react2.default.PropTypes.number,
      hash: _react2.default.PropTypes.bool,
      navigationControl: _react2.default.PropTypes.bool.isRequired
    },

    getDefaultProps: function getDefaultProps() {
      return {
        minZoom: null,
        pitch: null,
        hash: null
      };
    },
    componentDidMount: function componentDidMount() {
      this.initializeMap();
    },
    componentDidUpdate: function componentDidUpdate() {
      var _this = this;

      // TODO this is a hack to get the GL map to resize to its container after changing the container size.  Need to find a less hacky way to do this
      setTimeout(function () {
        return _this.mapObject && _this.mapObject.resize();
      }, 500);
    },
    initializeMap: function initializeMap() {
      var self = this;

      _mapboxGl2.default.accessToken = this.props.mapbox_accessToken;

      this.mapObject = new _mapboxGl2.default.Map({
        container: this.container,
        style: this.props.mapStyle,
        zoom: this.props.zoom,
        minZoom: this.props.minZoom,
        center: this.props.center,
        pitch: this.props.pitch,
        hash: this.props.hash
      });

      var map = this.mapObject;

      this.mapObject.on('load', function () {
        self.props.onLoad(self.mapObject.getStyle());
      });

      if (this.props.navigationControl) map.addControl(new _mapboxGl2.default.NavigationControl(), 'bottom-right');
    },
    flyMap: function flyMap(feature) {
      var zoom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;

      this.mapObject.flyTo({
        center: feature.geometry.coordinates,
        zoom: zoom
      });
    },
    render: function render() {
      var _this2 = this;

      return _react2.default.createElement('div', {
        className: 'gl-map',
        ref: function ref(x) {
          _this2.container = x;
        }
      });
    }
  });

  GLMap.defaultProps = {
    mapStyle: 'mapbox://styles/mapbox/light-v9',
    center: [0, 0],
    zoom: 2,
    minZoom: null,
    maxZoom: null,
    pitch: 0,
    hash: false,
    navigationControl: true,
    navigationControlPosition: 'top-right'
  };

  exports.default = GLMap;
});