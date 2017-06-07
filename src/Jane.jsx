import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import _ from 'underscore';
import cx from 'classnames';

import GLMap from './GLMap';
import LayerList from './LayerList';
import JaneLayer from './JaneLayer';
import Marker from './Marker';
import Search from './Search';

class Jane extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchResultMarker: null,
      mapLoaded: false,
      layerListExpanded: false,
      layerContentVisible: this.props.layerContentVisible,
      selectedLayer: null,
      mapConfig: {},
      loadedSources: {},
      layerOrder: [],
      legend: [],
      layers: []
    };

    this.layers = [];
  }

  getChildContext = () => ({
    registerLayer: this.registerLayer,
    unregisterLayer: this.unregisterLayer,
    loadedSources: this.state.loadedSources,
    selectedLayer: this.state.selectedLayer,
    getJaneLayer: (janeLayerId) => this.state.layers.find(({ id }) => id === janeLayerId),
    onSourceLoaded: this.handleSourceLoaded,
    onLayerClose: this.toggleLayerContent,
    addLegend: this.addLegend,
    removeLegend: this.removeLegend,
    map: this.state.mapLoaded ? this.map : null
  });

  static childContextTypes = {
    registerLayer: PropTypes.func,
    unregisterLayer: PropTypes.func,
    onSourceLoaded: PropTypes.func,
    loadedSources: PropTypes.object,
    selectedLayer: PropTypes.string,
    getJaneLayer: PropTypes.func,
    onLayerClose: PropTypes.func,
    addLegend: PropTypes.func,
    removeLegend: PropTypes.func,
    map: PropTypes.object
  };

  registerLayer = (layerId, layerConfig) => {
    const layer = {
      ...layerConfig,
      selected: layerConfig.defaultSelected || false,
      disabled: layerConfig.defaultDisabled || false
    };

    this.layers.push(layer);

    const newState = { layers: this.layers };

    if (layer.selected) {
      newState.selectedLayer = layer.id
    }

    this.setState(newState);
  };

  unregisterLayer = (layerId) => {
    this.layers = this.layers.filter(layer => layer !== layerId);

    this.setState({ layers: this.layers });
  };

  addLegend = (legend) => {
    this.setState({
      legend: this.state.legend.concat(legend)
    })
  };

  removeLegend = (legend) => {
    this.setState({
      legend: this.state.legend.filter((item) => item !== legend)
    })
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
  };

  handleSourceLoaded = (loadedSources) => {
    this.setState({ loadedSources });
  };

  handleLayerReorder = (layers) => {
    const layerOrder = layers.map(layer => layer.id);
    this.setState({ layerOrder });
  };

  handleLayerClick = (layerid) => {
    const { layerContentVisible, selectedLayer } = this.state;
    const { disabled } = this.state.layers.find(layer => layer.id);

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
  };

  handleMapLayerClick = (e) => {
    const { mapConfig } = this.state;

    this.state.layers.forEach((layer) => {
      const { id, onMapLayerClick, disabled } = layer;

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
  };

  handleMapMousemove = (e) => {
    const { mapConfig, mapLoaded } = this.state;
    if (!mapLoaded) return;
    const features = [];

    this.state.layers.forEach((layer) => {
      const { id, onMapLayerClick, disabled } = layer;

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
  };

  handleLayerToggle = (layerId) => {
    const { layerContentVisible, selectedLayer, layers } = this.state;
    const disabled = layers.find(layer => layer.id).disabled;

    const updatedLayers = layers.map((layer) => layer.id === layerId
      ? { ...layer, disabled: !layer.disabled }
      : layer
    );

    if (disabled) { // enable
      if (!layerContentVisible) this.toggleLayerContent();
      this.setState({
        selectedLayer: layerId,
        layers: updatedLayers
      });
    } else {
      if (layerContentVisible && selectedLayer === layerId) this.toggleLayerContent();
      this.setState({
        layers: updatedLayers
      });
    }
  };

  removeSearchResultMarker = () => {
    this.setState({ searchResultMarker: null });
  };

  addSearchResultMarker = (feature, label) => {
    this.setState({ searchResultMarker: { feature, label }});
  };

  toggleLayerContent = () => {
    this.setState({
      layerContentVisible: !this.state.layerContentVisible,
    }, () => {
      if (!this.state.layerContentVisible) {
        const selectedLayer = null;
        this.setState({ selectedLayer });
      }
    });
  };

  handleToggleExpanded = () => {
    this.setState({ layerListExpanded: !this.state.layerListExpanded });
  };

  sort = (a, b) => {
    const { layerOrder } = this.state;
    return layerOrder.indexOf(a.id) > layerOrder.indexOf(b.id) ? 1 : -1;
  };

  render() {
    let leftOffset = 0;
    if (this.state.layerListExpanded) leftOffset += 164;
    if (this.state.layerContentVisible) leftOffset += 320;

    const drawerClassName = cx('second-drawer', { offset: this.state.layerListExpanded });
    const drawerStyle = {
      transform: this.state.layerContentVisible ? 'translate(0px, 0px)' : 'translate(-320px, 0px)'
    };

    return (
      <div className="jane-container" style={this.props.style}>
        <div className="jane-map-container">
          {
            this.props.search &&
            <Search
              {...this.props.searchConfig}
              onGeocoderSelection={this.addSearchResultMarker}
              onClear={this.removeSearchResultMarker}
              selectionActive={!!this.state.searchResultMarker}
              leftOffset={leftOffset}
            />
          }

          {
            this.state.legend.length > 0 &&
            <div className="jane-legend" style={{ left: leftOffset }}>
              { this.state.legend }
            </div>
          }

          <GLMap
            {...this.props.mapboxGLOptions}
            ref={(map) => { this.map = map; }}
            onLoad={this.onMapLoad}
          />
        </div>

        <LayerList
          expanded={this.state.layerListExpanded}
          layers={this.state.layers.sort(this.sort)}
          selectedLayer={this.state.selectedLayer}
          onLayerReorder={this.handleLayerReorder}
          onLayerClick={this.handleLayerClick}
          onToggleExpanded={this.handleToggleExpanded}
          onLayerToggle={this.handleLayerToggle}/>

        <div className={drawerClassName} style={drawerStyle}>
          { this.props.children }

          {
            this.state.searchResultMarker &&
            <JaneLayer id="searchResult" hidden={true}>
              <Marker {...this.state.searchResultMarker} flyMap={true}/>
            </JaneLayer>
          }
        </div>
      </div>

    );
  }
}

Jane.propTypes = {
  layerContentVisible: PropTypes.bool,
  mapboxGLOptions: PropTypes.object.isRequired,
  style: PropTypes.object,
  search: PropTypes.bool,
  searchConfig: PropTypes.object,
  fitBounds: PropTypes.array,
  onZoomEnd: PropTypes.func,
  onDragEnd: PropTypes.func,
  children: PropTypes.node,
};

Jane.defaultProps = {
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
  onZoomEnd: () => {},
  onDragEnd: () => {},
};

export default Jane;
