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
    global.PoiMarker = mod.exports;
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

  var PoiMarker = _react2.default.createClass({
    displayName: 'PoiMarker',

    propTypes: {
      feature: _react2.default.PropTypes.object.isRequired,
      map: _react2.default.PropTypes.object.isRequired,
      label: _react2.default.PropTypes.string.isRequired
    },

    componentDidMount: function componentDidMount() {
      var el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(/img/orange-marker.png)';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.zIndex = 10;

      this.marker = new _mapboxGl2.default.Marker(el, {
        offset: [-16, -32]
      });

      this.label = new _mapboxGl2.default.Popup({
        offset: [6, 0],
        anchor: 'left',
        closeButton: false,
        closeOnClick: false
      });

      this.updateMarker(this.props.feature);
    },
    componentWillUpdate: function componentWillUpdate(nextProps) {
      if (JSON.stringify(nextProps.feature) !== JSON.stringify(this.props.feature)) {
        this.updateMarker(nextProps.feature);
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      this.marker.remove();
      this.label.remove();
    },
    updateMarker: function updateMarker(feature) {
      this.marker.setLngLat(feature.geometry.coordinates).addTo(this.props.map.mapObject);
      this.label.setLngLat(feature.geometry.coordinates).setHTML('<p>' + this.props.label + '</p>').addTo(this.props.map.mapObject);

      this.props.map.flyMap(feature);
    },
    render: function render() {
      return _react2.default.createElement('div', null);
    }
  });

  exports.default = PoiMarker;
});