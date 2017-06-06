import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import _ from 'underscore';

import GLMap from './GLMap';
import LayerContent from './LayerContent';
import LayerList from './LayerList';
import PoiMarker from './PoiMarker';
import Search from './Search';
import MapHandler from './MapHandler';

class Jane extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      poiFeature: this.props.poiFeature || null,
      poiLabel: this.props.poiLabel || null,
      mapLoaded: false,
      layerListExpanded: false,
      layerContentVisible: this.props.layerContentVisible,
      disabledLayers: this.props.initialDisabledJaneLayers,
      selectedLayer: this.props.initialSelectedJaneLayer,
      mapConfig: {},
      layerOrder: [],
      layers: {}
    };

    this.layers = {};
  }

  getChildContext = () => ({
    registerLayer: this.registerLayer,
    unregisterLayer: this.unregisterLayer,
    updateLayer: this.handleLayerUpdate
  });

  static childContextTypes = {
    registerLayer: PropTypes.func,
    unregisterLayer: PropTypes.func,
    updateLayer: PropTypes.func
  };

  registerLayer = (layerId, layerConfig) => {
    this.layers = {
      ...this.layers,
      [layerId]: layerConfig
    };

    this.setState({ layers: this.layers });
    this.handleLayerUpdate(layerId, layerConfig);
  };

  unregisterLayer = (layerId) => {
    this.layers = {
      ...this.layers,
      [layerId]: undefined
    };

    this.setState({ layers: this.layers });
  };

  componentDidMount() {
    // // pass dragend and zoomend up, handle click and mousemove
    // // this.map is the GLMap Component, not the map object itself
    this.map.mapObject.on('zoomend', this.props.onZoomEnd);
    this.map.mapObject.on('dragend', this.props.onDragEnd);

    this.map.mapObject.on('click', this.handleMapLayerClick);
    this.map.mapObject.on('mousemove', this.handleMapMousemove);
  }

  componentDidUpdate(prevProps) {
    // fit map to fitBounds property if it is different from previous props
    if (JSON.stringify(prevProps.fitBounds) !== JSON.stringify(this.props.fitBounds)) {
      this.map.mapObject.fitBounds(this.props.fitBounds);
    }
  }

  onMapLoad = () => {
    this.setState({ mapLoaded: true });
  }

  handleLayerReorder = (layers) => {
    const layerOrder = layers.map(layer => layer.id);
    this.setState({ layerOrder });
  }

  handleLayerClick = (layerid) => {
    const { disabledLayers, layerContentVisible, selectedLayer } = this.state;
    const disabled = disabledLayers.indexOf(layerid) > -1;

    if (!layerContentVisible && !disabled) this.toggleLayerContent();

    // if selected layer was clicked, toggle second drawer, else make clicked layer selected
    if (selectedLayer !== layerid) {
      // if clicked layer is enabled (visible), make it active
      if (!disabled) {
        this.setState({ selectedLayer: layerid });
        return;
      }

      // otherwise expand the layerlist
      if (!this.state.layerListExpanded) this.setState({ layerListExpanded: true });
    }
  }

  handleMapLayerClick = (e) => {
    const { mapConfig, disabledLayers } = this.state;

    Object.keys(this.state.layers).map((layerId) => {
      const { id, onMapLayerClick } = this.state.layers[layerId];
      const disabled = disabledLayers.indexOf(id) > -1;

      if (!disabled && onMapLayerClick) {
        const mapLayerIds = mapConfig[id].mapLayers
          .map(mapLayer => mapLayer.id)
          .filter(mapLayerId => (this.map.mapObject.getLayer(mapLayerId) !== undefined));

        const features = this.map.mapObject.queryRenderedFeatures(e.point, { layers: mapLayerIds });
        // de-dup
        const uniqueFeatures = _.uniq(features, feature => feature.id);
        if (uniqueFeatures.length > 0) onMapLayerClick(uniqueFeatures);
      }
    });
  }

  handleMapMousemove = (e) => {
    const { mapConfig, disabledLayers, mapLoaded } = this.state;
    if (!mapLoaded) return;
    const features = [];

    Object.keys(this.state.layers).map((layerId) => {
      const { id, onMapLayerClick } = this.state.layers[layerId];
      const disabled = disabledLayers.indexOf(id) > -1;

      if (!disabled && onMapLayerClick) {
        const mapLayerIds = mapConfig[id].mapLayers
          .map(mapLayer => mapLayer.id)
          .filter(mapLayerId => (this.map.mapObject.getLayer(mapLayerId) !== undefined));

        const layerFeatures = this.map.mapObject.queryRenderedFeatures(e.point, { layers: mapLayerIds });
        layerFeatures.forEach((layerFeature) => {
          features.push(layerFeature);
        });
      }
    });

    this.map.mapObject.getCanvas().style.cursor = (features && features.length > 0) ? 'pointer' : '';
  }

  handleLayerToggle = (id) => {
    const { disabledLayers, layerContentVisible } = this.state;
    let { selectedLayer } = this.state;
    const i = disabledLayers.indexOf(id);

    if (i > -1) { // enable
      if (!layerContentVisible) this.toggleLayerContent();
      selectedLayer = id;
      disabledLayers.splice(i, 1);
    } else { // disable
      if (layerContentVisible && selectedLayer === id) this.toggleLayerContent();
      disabledLayers.push(id);
    }

    this.setState({
      disabledLayers,
      selectedLayer,
    });
  }

  hidePoiMarker = () => {
    this.setState({
      poiFeature: null,
      poiLabel: null,
    });
  }

  showPoiMarker = (feature, label) => {
    this.setState({
      poiFeature: feature,
      poiLabel: label,
    });
  }

  toggleLayerContent = () => {
    this.setState({
      layerContentVisible: !this.state.layerContentVisible,
    }, () => {
      if (!this.state.layerContentVisible) {
        const selectedLayer = null;
        this.setState({ selectedLayer });
      }
    });
  }

  // handles updates to a layer's configuration
  handleLayerUpdate = (layerid, config) => {
    const { mapConfig } = this.state;
    const oldConfig = mapConfig[layerid];

    const newConfig = {
      legend: config.legend,
      mapLayers: config.mapConfig.reduce((result, { mapLayers }) => result.concat(mapLayers), []),
      sources: config.mapConfig.reduce((result, { sources }) => result.concat(sources), [])
    };

    if (JSON.stringify(oldConfig) !== JSON.stringify(newConfig)) {
      mapConfig[layerid] = newConfig;
      this.setState({ mapConfig });
    }
  }

  handleToggleExpanded = () => {
    this.setState({ layerListExpanded: !this.state.layerListExpanded });
  }

  sort = (a, b) => {
    const { layerOrder } = this.state;
    return layerOrder.indexOf(a.id) > layerOrder.indexOf(b.id) ? 1 : -1;
  }

  render() {
    const { disabledLayers, mapConfig, mapLoaded, selectedLayer } = this.state;

    const mapConfigArray = Object.keys(this.state.layers).map((layerId) => {
      const childId = this.state.layers[layerId].id;
      const currentLayer = mapConfig[childId];

      const mapConfigObject = {
        id: childId,
        sources: currentLayer ? currentLayer.sources : [],
        mapLayers: currentLayer ? currentLayer.mapLayers : [],
      };

      // append legend
      if (currentLayer && currentLayer.legend) {
        mapConfigObject.legend = currentLayer.legend;
      }

      return mapConfigObject;
    })
    .filter((thisMapConfig) => disabledLayers.indexOf(thisMapConfig.id) == -1)
    .sort(this.sort);

    // throw error if selectedLayer is not in layerListObjects
    const match = Object.keys(this.state.layers).filter(layerId => layerId === selectedLayer);
    if (match.length < 1 && selectedLayer !== null) console.error(`jane-maps: the selectedLayer prop is '${selectedLayer}', but could not find a JaneLayer with this id`);

    // add legendItems for each layer
    const legendItems = mapConfigArray
      .filter((layer) => layer.legend)
      .map((layer) => (<div key={layer.id}>{layer.legend}</div>));

    let leftOffset = 0;
    if (this.state.layerListExpanded) leftOffset += 164;
    if (this.state.layerContentVisible) leftOffset += 320;

    const layerList = Object.keys(this.state.layers)
      .map((layerId) => this.state.layers[layerId]);

    return (
      <div className="jane-container" style={this.props.style}>
        <div className="jane-map-container">
          {
            this.props.search &&
            <Search
              {...this.props.searchConfig}
              onGeocoderSelection={this.showPoiMarker}
              onClear={this.hidePoiMarker}
              selectionActive={this.state.poiFeature}
              leftOffset={leftOffset}
            />
          }

          {
            legendItems.length > 0 &&
            <div className="jane-legend" style={{ left: leftOffset }}>
              {legendItems}
            </div>
          }

          <GLMap
            {...this.props.mapboxGLOptions}
            ref={(map) => { this.map = map; }}
            onLoad={this.onMapLoad}
          />
        </div>

        {
          (this.state.poiFeature && this.map) && (
            <PoiMarker
              feature={this.state.poiFeature}
              label={this.state.poiLabel}
              map={this.map}
            />
          )
        }

        <LayerList
          expanded={this.state.layerListExpanded}
          layers={layerList}
          disabledLayers={disabledLayers}
          selectedLayer={selectedLayer}
          onLayerReorder={this.handleLayerReorder}
          onLayerClick={this.handleLayerClick}
          onToggleExpanded={this.handleToggleExpanded}
          onLayerToggle={this.handleLayerToggle}
        />

        <LayerContent
          offset={this.state.layerListExpanded}
          visible={this.state.layerContentVisible}
          selectedLayer={selectedLayer}
          onLayerUpdate={this.handleLayerUpdate}
          onClose={this.toggleLayerContent}>
          { this.props.children }
        </LayerContent>

        { mapLoaded && <MapHandler map={this.map} mapConfig={mapConfigArray} /> }
      </div>

    );
  }
}

Jane.propTypes = {
  poiFeature: PropTypes.object,
  poiLabel: PropTypes.string,
  layerContentVisible: PropTypes.bool,
  mapboxGLOptions: PropTypes.object.isRequired,
  style: PropTypes.object,
  search: PropTypes.bool,
  searchConfig: PropTypes.object,
  fitBounds: PropTypes.array,
  onZoomEnd: PropTypes.func,
  onDragEnd: PropTypes.func,
  children: PropTypes.node,
  initialSelectedJaneLayer: PropTypes.string,
  initialDisabledJaneLayers: PropTypes.array,
};

Jane.defaultProps = {
  poiFeature: null,
  poiLabel: null,
  layerContentVisible: false,
  style: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  search: false,
  searchConfig: null,
  fitBounds: null,
  children: null,
  initialSelectedJaneLayer: null,
  initialDisabledJaneLayers: [],
  onZoomEnd: () => {},
  onDragEnd: () => {},
};

Jane.displayName = 'Jane';

export default Jane;
