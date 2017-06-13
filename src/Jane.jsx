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
    map: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchResultMarker: null,
      mapLoaded: false,
      layerListExpanded: false,
      selectedLayer: null,
      loadedSources: {},
      legend: [],
      layers: [],
    };

    this.layers = [];
  }

  getChildContext = () => ({
    registerLayer: this.registerLayer,
    unregisterLayer: this.unregisterLayer,
    loadedSources: this.state.loadedSources,
    selectedLayer: this.state.selectedLayer,
    getJaneLayer: janeLayerId => this.state.layers.find(({ id }) => id === janeLayerId),
    onSourceLoaded: this.handleSourceLoaded,
    onLayerClose: this.deselectLayer,
    addLegend: this.addLegend,
    removeLegend: this.removeLegend,
    map: this.state.mapLoaded ? this.map : null,
  });

  componentDidMount() {
    // // pass dragend and zoomend up, handle click and mousemove
    // // this.map is the GLMap Component, not the map object itself
    this.map.mapObject.on('zoomend', this.props.onZoomEnd);
    this.map.mapObject.on('dragend', this.props.onDragEnd);
  }

  componentDidUpdate(prevProps) {
    // fit map to fitBounds property if it is different from previous props
    if (!_.isEqual(prevProps.fitBounds, this.props.fitBounds)) {
      this.map.mapObject.fitBounds(this.props.fitBounds);
    }
  }

  componentWillUnmount() {
    this.map.mapObject.off('zoomend', this.props.onZoomEnd);
    this.map.mapObject.off('dragend', this.props.onDragEnd);
  }

  onMapLoad = () =>
    this.setState({ mapLoaded: true });

  removeLegend = (legend) =>
    this.setState({ legend: this.state.legend.filter(item => item !== legend) });

  addLegend = (legend) =>
    this.setState({ legend: this.state.legend.concat(legend) });

  unregisterLayer = (layerId) => {
    this.layers = this.layers.filter(layer => layer !== layerId);

    this.setState({ layers: this.layers });
  };

  registerLayer = (layerId, layerConfig, redrawChildren) => {
    this.selectedLayer = this.selectedLayer || null;

    const layer = {
      ...layerConfig,
      selected: layerConfig.defaultSelected || false,
      disabled: layerConfig.defaultDisabled || false,
      redrawChildren
    };

    this.layers.push(layer);

    const newState = { layers: this.layers };

    if (layer.selected) {
      if (this.selectedLayer) {
        console.error(`Multiple JaneLayers are initially selected, check defaultSelected prop on ${layer.id} JaneLayer`);
      }

      newState.selectedLayer = layer.id;
      this.selectedLayer = layer.id;
    }

    this.setState(newState);
  };

  handleSourceLoaded = (loadedSources) =>
    this.setState({ loadedSources });

  handleLayerReorder = (layers) => {
    this.layers = layers;

    this.setState({ layers: this.layers }, () => layers.forEach((layer) => layer.redrawChildren()));
  };

  selectLayer = (layerid) =>
    this.setState({ selectedLayer: layerid });

  handleLayerToggle = (layerId) => {
    const { selectedLayer, layers } = this.state;
    const disabled = layers.find(layer => layer.id).disabled;

    const updatedLayers = layers.map((layer) => {
      if (layer.id === layerId) return { ...layer, disabled: !layer.disabled };
      return layer;
    });

    const newSelectedLayer = disabled
      ? layerId
      : selectedLayer ? null : selectedLayer;

    this.setState({
      selectedLayer: newSelectedLayer,
      layers: updatedLayers,
    });
  };

  removeSearchResultMarker = () =>
    this.setState({ searchResultMarker: null });

  addSearchResultMarker = (feature, label) =>
    this.setState({ searchResultMarker: { feature, label } });

  deselectLayer = () =>
    this.setState({ selectedLayer: null });

  toggleList = () =>
    this.setState({ layerListExpanded: !this.state.layerListExpanded });

  componentDidUpdate(prevProps, prevState) {
    const prevDisabledCount = this.state.layers.reduce((acc, l) => l.disabled ? acc + 1 : acc, 0);
    const nextDisabledCount = prevState.layers.reduce((acc, l) => l.disabled ? acc + 1 : acc, 0);

    if (!prevDisabledCount !== nextDisabledCount) {
      prevState.layers.forEach((layer) => layer.redrawChildren());
    }
  }

  render() {
    let leftOffset = 0;
    if (this.state.layerListExpanded) leftOffset += 164;
    if (this.state.selectedLayer) leftOffset += 320;

    const drawerClassName = cx('second-drawer', { offset: this.state.layerListExpanded });
    const drawerStyle = {
      transform: this.state.selectedLayer ? 'translate(0px, 0px)' : 'translate(-320px, 0px)',
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
          layers={this.state.layers}
          selectedLayer={this.state.selectedLayer}
          onLayerReorder={this.handleLayerReorder}
          onLayerSelect={this.selectLayer}
          toggleList={this.toggleList}
          onLayerToggle={this.handleLayerToggle}
        />

        <div className={drawerClassName} style={drawerStyle}>
          { this.props.children }

          {
            this.state.searchResultMarker &&
            <JaneLayer id="searchResult" hidden >
              <Marker {...this.state.searchResultMarker} flyMap />
            </JaneLayer>
          }
        </div>
      </div>

    );
  }
}

Jane.propTypes = {
  mapboxGLOptions: PropTypes.object.isRequired,
  style: PropTypes.object,
  search: PropTypes.bool,
  searchConfig: PropTypes.object,
  fitBounds: PropTypes.array,
  onZoomEnd: PropTypes.func,
  onDragEnd: PropTypes.func,
  children: PropTypes.node.isRequired,
};

Jane.defaultProps = {
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
