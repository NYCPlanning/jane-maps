(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', './MapLayer', './source/Source'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('./MapLayer'), require('./source/Source'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.MapLayer, global.Source);
    global.MapHandler = mod.exports;
  }
})(this, function (exports, _react, _MapLayer, _Source) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _MapLayer2 = _interopRequireDefault(_MapLayer);

  var _Source2 = _interopRequireDefault(_Source);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var MapHandler = _react2.default.createClass({
    displayName: 'MapHandler',

    propTypes: {
      mapConfig: _react.PropTypes.object.isRequired,
      map: _react.PropTypes.object.isRequired
    },

    getInitialState: function getInitialState() {
      return {
        loadedSources: {}
      };
    },
    handleSourceLoaded: function handleSourceLoaded(loadedSources) {
      this.setState({ loadedSources: loadedSources });
    },
    render: function render() {
      var _this = this;

      // load all sources for visible layers
      var sources = [];
      var _props = this.props,
          mapConfig = _props.mapConfig,
          map = _props.map;


      mapConfig.layers.forEach(function (layer) {
        if (layer.sources && layer.visible) {
          layer.sources.forEach(function (source) {
            sources.push(_react2.default.createElement(_Source2.default, { map: map, source: source, onLoaded: _this.handleSourceLoaded, key: source.id }));
          });
        }
      });

      // check to see if all sources for visible layers are loaded
      var allSourcesLoaded = true;

      mapConfig.layers.forEach(function (layer) {
        if (layer.visible && layer.sources && layer.mapLayers) {
          layer.mapLayers.forEach(function (mapLayer) {
            if (!Object.prototype.hasOwnProperty.call(_this.state.loadedSources, mapLayer.source)) {
              allSourcesLoaded = false;
            }
          });
        }
      });

      // create <MapLayer> components for each visible layer, but only if all required sources are already loaded
      var mapLayers = [];

      if (allSourcesLoaded) {
        this.order = 0;
        mapConfig.layers.forEach(function (layer) {
          // render layers in order
          if (layer.visible && layer.sources && layer.mapLayers) {
            layer.mapLayers.forEach(function (mapLayer) {
              mapLayers.push(_react2.default.createElement(_MapLayer2.default, { map: map, config: mapLayer, key: mapLayer.id + _this.order }));
            });

            _this.order = _this.order + 1;
          }
        });
      }

      return _react2.default.createElement(
        'div',
        null,
        sources,
        mapLayers
      );
    }
  }); // MapHandler - a component that figures out which sources and mapLayers should exist on the map,
  // and renders appropriate components
  exports.default = MapHandler;
});