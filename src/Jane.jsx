import React, { PropTypes } from 'react'; // eslint-disable-line
import update from 'react/lib/update'; // eslint-disable-line
import _ from 'underscore';

import GLMap from './GLMap';
import LayerContent from './LayerContent';
import LayerList from './LayerList';
import PoiMarker from './PoiMarker';
import Search from './Search';
import MapHandler from './MapHandler';

const Jane = React.createClass({
  propTypes: {
    poiFeature: PropTypes.object,
    poiLabel: PropTypes.string,
    layerContentVisible: PropTypes.bool,
    mapInit: PropTypes.object.isRequired,
    style: PropTypes.object,
    search: PropTypes.bool,
    searchConfig: PropTypes.object,
    fitBounds: PropTypes.array,
    onZoomEnd: PropTypes.func,
    onDragEnd: PropTypes.func,
  },

  getDefaultProps() {
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
        overflow: 'hidden',
      },
      search: false,
      searchConfig: null,
      fitBounds: null,
      children: null,
      onZoomEnd: () => {},
      onDragEnd: () => {},
    };
  },

  getInitialState() {
    return ({
      poiFeature: this.props.poiFeature ? this.props.poiFeature : null,
      poiLabel: this.props.poiLabel ? this.props.poiLabel : null,
      mapLoaded: false,
      layerListExpanded: false,
      layerContentVisible: this.props.layerContentVisible,
      disabledLayers: [],
      selectedLayer: this.props.initialSelectedJaneLayer,
      mapConfig: {},
    });
  },

  componentDidMount() {
    // // pass dragend and zoomend up, handle click and mousemove
    // // this.map is the GLMap Component, not the map object itself
    // this.map.mapObject.on('zoomend', this.props.onZoomEnd);
    // this.map.mapObject.on('dragend', this.props.onDragEnd);
    //
    // this.map.mapObject.on('click', this.handleMapLayerClick);
    // this.map.mapObject.on('mousemove', this.handleMapMousemove);
  },

  componentDidUpdate(prevProps) {
    // fit map to fitBounds property if it is different from previous props
    if (JSON.stringify(prevProps.fitBounds) !== JSON.stringify(this.props.fitBounds)) {
      this.map.mapObject.fitBounds(this.props.fitBounds);
    }
  },

  onMapLoad() {
    this.setState({ mapLoaded: true });
  },

  handleLayerReorder(layers) {
    this.state.mapConfig.layers = layers;
    this.setState({ mapConfig: this.state.mapConfig });
  },

  handleLayerClick(layerid) {
    const { disabledLayers, layerContentVisible, selectedLayer } = this.state;
    const disabled = disabledLayers.indexOf(layerid) > -1;

    if (!layerContentVisible && !disabled) this.toggleLayerContent();

    // if selected layer was clicked, toggle second drawer, else make clicked layer selected
    if (selectedLayer !== layerid) {
      // if clicked layer is enabled (visible), make it active
      if (!disabled) {
        const newSelectedLayer = layerid;
        this.setState({ selectedLayer: newSelectedLayer });
        return;
      }

      // otherwise expand the layerlist
      if (!this.state.layerListExpanded) this.setState({ layerListExpanded: true });
    }
  },

  handleMapLayerClick(e) {
    this.state.mapConfig.layers.forEach((layer) => {
      if (layer.visible && layer.onMapLayerClick) {
        const mapLayerIds = layer.mapLayers.map(mapLayer => mapLayer.id);

        const features = this.map.mapObject.queryRenderedFeatures(e.point, { layers: mapLayerIds });
        // de-dup
        const uniqueFeatures = _.uniq(features, feature => feature.id);
        if (uniqueFeatures.length > 0) layer.onMapLayerClick(uniqueFeatures);
      }
    });
  },

  handleMapMousemove(e) {
    this.state.mapConfig.layers.forEach((layer) => {
      if (layer.visible && layer.onMapLayerClick) {
        const mapLayerIds = layer.mapLayers
          .map(mapLayer => mapLayer.id)
          .filter(mapLayerId => (this.map.mapObject.getLayer(mapLayerId) !== undefined));

        const features = this.map.mapObject.queryRenderedFeatures(e.point, { layers: mapLayerIds });
        this.map.mapObject.getCanvas().style.cursor = (features && features.length > 0) ? 'pointer' : '';
      }
    });
  },

  handleLayerToggle(id) {
    const { disabledLayers } = this.state;
    const i = disabledLayers.indexOf(id);

    if (i > -1) {
      disabledLayers.splice(i, 1);
    } else {
      disabledLayers.push(id);
    }

    this.setState({ disabledLayers });
  },

  hidePoiMarker() {
    this.setState({
      poiFeature: null,
      poiLabel: null,
    });
  },

  showPoiMarker(feature, label) {
    this.setState({
      poiFeature: feature,
      poiLabel: label,
    });
  },

  toggleLayerContent() {
    this.setState({
      layerContentVisible: !this.state.layerContentVisible,
    }, () => {
      if (!this.state.layerContentVisible) {
        const selectedLayer = '';
        this.setState({ selectedLayer });
      }
    });
  },

  // handles updates to a layer's configuration
  handleLayerUpdate(layerid, config) {
    const { mapConfig } = this.state;
    const oldConfig = mapConfig[layerid];

    if (JSON.stringify(oldConfig) !== JSON.stringify(config)) {
      mapConfig[layerid] = config;
      this.setState({ mapConfig });
    }
  },

  handleToggleExpanded() {
    this.setState({ layerListExpanded: !this.state.layerListExpanded });
  },

  render() {
    const { disabledLayers, mapConfig, mapLoaded } = this.state;

    const layerListObjects = React.Children.map(this.props.children, (child) => {
      return child.props;
    });


    const mapConfigArray = React.Children.map(this.props.children, (child) => {
      const thisMapConfig = mapConfig[child.props.id];

      return {
        id: child.props.id,
        sources: thisMapConfig ? thisMapConfig.sources : [],
        mapLayers: thisMapConfig ? thisMapConfig.mapLayers : [],
      };
    });

    // // add legendItems for each layer
    // const legendItems = [];
    // mapConfig.layers.forEach((layer) => {
    //   if (layer.visible && layer.legend) {
    //     legendItems.push(<div key={layer.id}>{layer.legend}</div>);
    //   }
    // });

    let leftOffset = 0;
    if (this.state.layerListExpanded) leftOffset += 164;
    if (this.state.layerContentVisible) leftOffset += 320;

    const { selectedLayer } = this.state;

    return (

      <div className="jane-container" style={this.props.style}>
        <div
          className="jane-map-container"
        >
          {
            this.props.search && (
              <Search
                {...this.props.searchConfig}
                onGeocoderSelection={this.showPoiMarker}
                onClear={this.hidePoiMarker}
                selectionActive={this.state.poiFeature}
                leftOffset={leftOffset}
              />
            )
          }

          { /*
            legendItems.length > 0 && (
              <div
                className="jane-legend"
                style={{ left: leftOffset }}
              >
                {legendItems}
              </div>
            ) */
          }

          <GLMap
            {...this.props.mapInit}
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
          layers={layerListObjects}
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
          layers={this.props.children}
          disabledLayers={disabledLayers}
          selectedLayer={selectedLayer}
          onLayerUpdate={this.handleLayerUpdate}
          onLayerToggle={this.handleLayerToggle}
          onClose={this.toggleLayerContent}
        />

      { mapLoaded && <MapHandler map={this.map} mapConfig={mapConfigArray} /> }
      </div>

    );
  },
});

export default Jane;
