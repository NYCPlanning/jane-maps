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
    global.PoiMarker = mod.exports;
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

  // eslint-disable-line

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
      // TODO entire marker should be config-driven
      // url reference breaks depending on how the site is hosted
      // so for now just reference the marker image on the production domain
      el.style.backgroundImage = 'url(//capitalplanning.nyc.gov/img/orange-marker.png)';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.zIndex = 10;

      this.marker = new mapboxgl.Marker(el, { // eslint-disable-line no-undef
        offset: [-16, -32]
      });

      this.label = new mapboxgl.Popup({ // eslint-disable-line no-undef
        offset: [6, 0],
        anchor: 'left',
        closeButton: false,
        closeOnClick: false
      });

      var _props = this.props,
          feature = _props.feature,
          label = _props.label;


      this.updateMarker(feature, label);
    },
    componentWillUpdate: function componentWillUpdate(nextProps) {
      if (JSON.stringify(nextProps.feature) !== JSON.stringify(this.props.feature)) {
        this.updateMarker(nextProps.feature, nextProps.label);
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      this.marker.remove();
      this.label.remove();
    },
    updateMarker: function updateMarker(feature, label) {
      var map = this.props.map;


      this.marker.setLngLat(feature.geometry.coordinates).addTo(map.mapObject);

      this.label.setLngLat(feature.geometry.coordinates).setHTML('<p>' + label + '</p>').addTo(map.mapObject);

      map.flyMap(feature);
    },
    render: function render() {
      return _react2.default.createElement('div', null);
    }
  });

  exports.default = PoiMarker;
});