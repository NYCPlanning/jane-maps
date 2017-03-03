(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react/lib/update', './GLMap', './LayerContent', './LayerList', './PoiMarker', './Search', './SelectedFeaturesPane', './MapHandler'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react/lib/update'), require('./GLMap'), require('./LayerContent'), require('./LayerList'), require('./PoiMarker'), require('./Search'), require('./SelectedFeaturesPane'), require('./MapHandler'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.update, global.GLMap, global.LayerContent, global.LayerList, global.PoiMarker, global.Search, global.SelectedFeaturesPane, global.MapHandler);
    global.Jane = mod.exports;
  }
})(this, function (exports, _react, _update, _GLMap, _LayerContent, _LayerList, _PoiMarker, _Search, _SelectedFeaturesPane, _MapHandler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _update2 = _interopRequireDefault(_update);

  var _GLMap2 = _interopRequireDefault(_GLMap);

  var _LayerContent2 = _interopRequireDefault(_LayerContent);

  var _LayerList2 = _interopRequireDefault(_LayerList);

  var _PoiMarker2 = _interopRequireDefault(_PoiMarker);

  var _Search2 = _interopRequireDefault(_Search);

  var _SelectedFeaturesPane2 = _interopRequireDefault(_SelectedFeaturesPane);

  var _MapHandler2 = _interopRequireDefault(_MapHandler);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  // styles should be manually imported from whatever is using Jane for now
  // import './styles.scss'

  var Jane = _react2.default.createClass({
    displayName: 'Jane',

    propTypes: {
      poiFeature: _react2.default.PropTypes.object,
      poiLabel: _react2.default.PropTypes.string,
      layerContentVisible: _react2.default.PropTypes.bool,
      mapInit: _react2.default.PropTypes.object.isRequired,
      style: _react2.default.PropTypes.object,
      search: _react2.default.PropTypes.bool,
      searchConfig: _react2.default.PropTypes.object,
      fitBounds: _react2.default.PropTypes.array
    },

    getDefaultProps: function getDefaultProps() {
      return {
        poiFeature: null,
        poiLabel: null,
        layerContentVisible: false,
        style: {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: 'hidden'
        },
        search: false,
        searchConfig: null,
        fitBounds: null
      };
    },
    getInitialState: function getInitialState() {
      return {
        poiFeature: this.props.poiFeature ? this.props.poiFeature : null,
        poiLabel: this.props.poiLabel ? this.props.poiLabel : null,
        mapLoaded: false,
        layerListExpanded: false,
        layerContentVisible: this.props.layerContentVisible,
        selectedFeatures: []
      };
    },
    componentWillMount: function componentWillMount() {
      var mapConfig = {
        layers: []
      };

      _react2.default.Children.forEach(this.props.children, function (child) {
        if (child !== null && child.type.displayName === 'JaneLayer') {
          if (child.props.selected) {
            mapConfig.selectedLayer = child.props.id;
          }

          mapConfig.layers.push({
            id: child.props.id,
            name: child.props.name,
            icon: child.props.icon,
            visible: child.props.visible,
            component: child.props.component,
            listItem: child.props.listItem,
            interactivityMapLayers: child.props.interactivityMapLayers,
            highlightPointLayers: child.props.highlightPointLayers,
            sources: child.props.sources,
            mapLayers: child.props.mapLayers,
            initialState: child.props.initialState
          });
        }
      });

      this.setState({
        mapConfig: mapConfig
      });
    },
    componentDidMount: function componentDidMount() {
      // this.map is the GLMap Component, not the map object itself

      this.map.mapObject.on('zoomend', this.resetSelectedFeatures);
      this.map.mapObject.on('dragend', this.resetSelectedFeatures);

      this.map.mapObject.on('click', this.handleMapLayerClick);
      this.map.mapObject.on('mousemove', this.handleMapMousemove);
    },
    componentDidUpdate: function componentDidUpdate(prevProps) {
      // fit map to fitBounds property if it is different from previous props
      if (JSON.stringify(prevProps.fitBounds) !== JSON.stringify(this.props.fitBounds)) {
        this.map.mapObject.fitBounds(this.props.fitBounds);
      }
    },
    onMapLoad: function onMapLoad() {
      this.setState({ mapLoaded: true });
    },
    getLoadedMapLayers: function getLoadedMapLayers() {
      var _this = this;

      var mapLayers = [];

      this.state.mapConfig.layers.forEach(function (layer) {
        layer.mapLayers.forEach(function (mapLayer) {
          if (layer.visible && _this.map.mapObject.getLayer(mapLayer.id)) {
            mapLayers.push(mapLayer.id);
          }
        });
      });

      return mapLayers;
    },
    handleLayerReorder: function handleLayerReorder(layers) {
      this.state.mapConfig.layers = layers;

      this.setState({ mapConfig: this.state.mapConfig });
    },
    handleLayerClick: function handleLayerClick(layerid) {
      var visible = this.isLayerVisible(layerid);

      // open second drawer if closed
      if (!this.state.layerContentVisible && visible) this.toggleLayerContent();

      // if selected layer was clicked, toggle second drawer, else make clicked layer selected
      if (this.state.mapConfig.selectedLayer === layerid) {
        // this.toggleLayerContent();
      } else {
        // if clicked layer is enabled (visible), make it active
        if (visible) {
          this.state.mapConfig.selectedLayer = layerid;
          this.setState({ mapConfig: this.state.mapConfig });
          return;
        }

        // otherwise expand the layerlist
        if (!this.state.layerListExpanded) this.setState({ layerListExpanded: true });
      }
    },
    isLayerVisible: function isLayerVisible(layerid) {
      // checks if layer with id of layerid is visible, returns boolean
      var thisLayer = this.state.mapConfig.layers.filter(function (layer) {
        return layer.id === layerid;
      })[0];
      return thisLayer.visible;
    },
    handleMapLayerClick: function handleMapLayerClick(e) {
      var mapLayers = this.getLoadedMapLayers();

      var features = this.map.mapObject.queryRenderedFeatures(e.point, { layers: mapLayers });

      this.setState({
        selectedFeatures: features
      });
    },
    handleMapMousemove: function handleMapMousemove(e) {
      var mapLayers = this.getLoadedMapLayers();

      var features = this.map.mapObject.queryRenderedFeatures(e.point, { layers: mapLayers });

      this.map.mapObject.getCanvas().style.cursor = features.length > 0 ? 'pointer' : '';
    },
    handleLayerToggle: function handleLayerToggle(layerid) {
      var theLayer = this.state.mapConfig.layers.find(function (layer) {
        return layer.id === layerid;
      });
      theLayer.visible = !theLayer.visible;

      // clear selectedlayer
      if (this.state.mapConfig.selectedLayer === layerid) {
        this.state.mapConfig.selectedLayer = '';
        if (this.state.layerContentVisible) this.toggleLayerContent();
      } else {
        // if layer being turned on is not selected, select it
        this.state.mapConfig.selectedLayer = layerid;
      }

      // if a layer is being turned on, open the second drawer if it is not already open
      if (theLayer.visible && !this.state.layerContentVisible) this.toggleLayerContent();

      this.setState({
        mapConfig: this.state.mapConfig
      });
    },
    hidePoiMarker: function hidePoiMarker() {
      this.setState({
        poiFeature: null,
        poiLabel: null
      });
    },
    showPoiMarker: function showPoiMarker(feature, label) {
      this.setState({
        poiFeature: feature,
        poiLabel: label
      });
    },
    resetSelectedFeatures: function resetSelectedFeatures() {
      this.setState({
        selectedFeatures: []
      });
    },
    toggleLayerContent: function toggleLayerContent() {
      var _this2 = this;

      this.setState({
        layerContentVisible: !this.state.layerContentVisible
      }, function () {
        if (!_this2.state.layerContentVisible) {
          var mapConfig = _this2.state.mapConfig;
          mapConfig.selectedLayer = '';
          _this2.setState({ mapConfig: mapConfig });
        }
      });
    },
    handleLayerUpdate: function handleLayerUpdate(layerid, updates) {
      // get the index in mapConfig.layers of the layer to be updated
      var layerIndex = this.state.mapConfig.layers.findIndex(function (layer) {
        return layer.id === layerid;
      });

      // use setState with callback because multiple <Layer>s may want to update in the same render cycle
      this.setState(function (prevState) {
        return {
          mapConfig: (0, _update2.default)(prevState.mapConfig, {
            layers: _defineProperty({}, layerIndex, {
              $merge: updates
            })
          })
        };
      });
    },
    handleToggleExpanded: function handleToggleExpanded() {
      this.setState({ layerListExpanded: !this.state.layerListExpanded });
    },
    render: function render() {
      var _this3 = this;

      var mapConfig = this.state.mapConfig;

      // remove highlightPoints layer if it exists
      mapConfig.layers.forEach(function (layer, i) {
        if (layer.id === 'highlightPoints') mapConfig.layers.splice(i, 1);
      });

      // add legendItems for each layer
      var legendItems = [];

      // TODO combine all these forEach() into one big one

      mapConfig.layers.forEach(function (layer) {
        if (layer.visible && layer.legend) {
          legendItems.push(_react2.default.createElement(
            'div',
            { key: layer.id },
            layer.legend
          ));
        }
      });

      // add selected feature items for each layer
      var selectedFeatureItems = [];

      mapConfig.layers.forEach(function (layer, i) {
        if (layer.listItem && layer.visible && layer.interactivityMapLayers) {
          var SelectedFeatureItem = layer.listItem ? layer.listItem : null;
          var layerSelectedFeatures = _this3.state.selectedFeatures.filter(function (feature) {
            return layer.interactivityMapLayers.indexOf(feature.layer.id) > -1;
          });

          layerSelectedFeatures.forEach(function (layerSelectedFeature, j) {
            selectedFeatureItems.push(_react2.default.createElement(SelectedFeatureItem, { feature: layerSelectedFeature, key: i.toString() + j.toString() }));
          });
        }
      });

      // add highlighted points for each layer

      var highlightPointFeatures = [];

      mapConfig.layers.forEach(function (layer) {
        if (layer.visible && layer.highlightPointLayers) {
          // get selected features
          var layerSelectedFeatures = _this3.state.selectedFeatures.filter(function (feature) {
            return layer.interactivityMapLayers.indexOf(feature.layer.id) > -1;
          });

          layerSelectedFeatures.forEach(function (layerSelectedFeature) {
            highlightPointFeatures.push({
              type: 'Feature',
              geometry: layerSelectedFeature.geometry,
              properties: {}
            });
          });
        }
      });

      var highlightPointFeatureCollection = {
        type: 'FeatureCollection',
        features: highlightPointFeatures
      };

      mapConfig.layers.push({
        id: 'highlightPoints',
        visible: 'true',
        showInLayerList: false,
        sources: [{
          id: 'highlightPoints',
          type: 'geojson',
          data: highlightPointFeatureCollection
        }],
        mapLayers: [{
          id: 'highlightPoints',
          type: 'circle',
          source: 'highlightPoints',
          paint: {
            'circle-color': 'rgba(255, 255, 255, 1)',
            'circle-opacity': 0,
            'circle-radius': 10,
            'circle-stroke-width': 3,
            'circle-pitch-scale': 'map',
            'circle-stroke-color': 'rgba(217, 107, 39, 1)',
            'circle-stroke-opacity': 0.8
          }
        }]
      });

      var leftOffset = 36;
      if (this.state.layerListExpanded) leftOffset += 164;
      if (this.state.layerContentVisible) leftOffset += 320;

      var selectedLayer = this.state.mapConfig.selectedLayer;

      return _react2.default.createElement(
        'div',
        { className: 'jane-container', style: this.props.style },
        _react2.default.createElement(
          'div',
          {
            className: 'jane-map-container', style: {
              left: leftOffset
            }
          },
          this.props.search && _react2.default.createElement(_Search2.default, _extends({}, this.props.searchConfig, {
            onGeocoderSelection: this.showPoiMarker,
            onClear: this.hidePoiMarker,
            selectionActive: this.state.poiFeature
          })),
          legendItems.length > 0 && _react2.default.createElement(
            'div',
            { className: 'jane-legend' },
            legendItems
          ),
          _react2.default.createElement(_GLMap2.default, _extends({}, this.props.mapInit, {
            ref: function ref(map) {
              _this3.map = map;
            },
            onLoad: this.onMapLoad
          }))
        ),
        this.state.poiFeature && this.map && _react2.default.createElement(_PoiMarker2.default, {
          feature: this.state.poiFeature,
          label: this.state.poiLabel,
          map: this.map
        }),
        _react2.default.createElement(_LayerList2.default, {
          expanded: this.state.layerListExpanded,
          layers: this.state.mapConfig.layers,
          selectedLayer: selectedLayer,
          onLayerReorder: this.handleLayerReorder,
          onLayerClick: this.handleLayerClick,
          onToggleExpanded: this.handleToggleExpanded,
          onLayerToggle: this.handleLayerToggle
        }),
        _react2.default.createElement(_LayerContent2.default, {
          offset: this.state.layerListExpanded,
          visible: this.state.layerContentVisible,
          layers: this.state.mapConfig.layers,
          selectedLayer: selectedLayer,
          onLayerUpdate: this.handleLayerUpdate,
          onLayerToggle: this.handleLayerToggle,
          onClose: this.toggleLayerContent
        }),
        _react2.default.createElement(
          _SelectedFeaturesPane2.default,
          {
            style: {
              right: selectedFeatureItems.length > 0 ? 0 : -250
            }
          },
          selectedFeatureItems
        ),
        this.state.mapLoaded && _react2.default.createElement(_MapHandler2.default, { map: this.map, mapConfig: mapConfig })
      );
    }
  });

  exports.default = Jane;
});