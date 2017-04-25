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
    children: PropTypes.array,
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
      onZoomEnd: null,
      onDragEnd: null,
    };
  },

  getInitialState() {
    return ({
      poiFeature: this.props.poiFeature ? this.props.poiFeature : null,
      poiLabel: this.props.poiLabel ? this.props.poiLabel : null,
      mapLoaded: false,
      layerListExpanded: false,
      layerContentVisible: this.props.layerContentVisible,
      selectedFeatures: [],
    });
  },

  componentWillMount() {
    const mapConfig = {
      layers: [],
    };

    // parse all children component props, each becomes a layer object in mapConfig
    React.Children.forEach(this.props.children, (child) => {
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
          onMapLayerClick: child.props.onMapLayerClick,
          interactivityMapLayers: child.props.interactivityMapLayers,
          highlightPointLayers: child.props.highlightPointLayers,
          sources: child.props.sources,
          mapLayers: child.props.mapLayers,
          initialState: child.props.initialState,
        });
      }
    });

    this.setState({
      mapConfig,
    });
  },

  componentDidMount() {
    // pass dragend and zoomend up, handle click and mousemove
    // this.map is the GLMap Component, not the map object itself
    this.map.mapObject.on('zoomend', this.props.onZoomEnd);
    this.map.mapObject.on('dragend', this.props.onDragEnd);

    this.map.mapObject.on('click', this.handleMapLayerClick);
    this.map.mapObject.on('mousemove', this.handleMapMousemove);
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
    const visible = this.isLayerVisible(layerid);

    if (!this.state.layerContentVisible && visible) this.toggleLayerContent();

    // if selected layer was clicked, toggle second drawer, else make clicked layer selected
    if (this.state.mapConfig.selectedLayer !== layerid) {
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

  isLayerVisible(layerid) {
    // checks if layer with id of layerid is visible, returns boolean
    const thisLayer = this.state.mapConfig.layers.filter(layer => layer.id === layerid)[0];
    return thisLayer.visible;
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
    // const mapLayers = this.getLoadedMapLayers();
    // const features = this.map.mapObject.queryRenderedFeatures(e.point, { layers: mapLayers });
    // this.map.mapObject.getCanvas().style.cursor = (features.length > 0) ? 'pointer' : '';
  },

  handleLayerToggle(layerid) {
    const theLayer = this.state.mapConfig.layers.find((layer => layer.id === layerid));
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
      mapConfig: this.state.mapConfig,
    });
  },

  // keeps track of loaded sources in state,
  // used to figure out whether layers are ready to be added in render()

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
        const mapConfig = this.state.mapConfig;
        mapConfig.selectedLayer = '';
        this.setState({ mapConfig });
      }
    });
  },

  // handles updates to a layer's configuration
  handleLayerUpdate(layerid, updates) {
    // get the index in mapConfig.layers of the layer to be updated
    const layerIndex = this.state.mapConfig.layers.findIndex(layer => layer.id === layerid);

    // use setState with callback because multiple <Layer>s may want to update in the same render cycle
    this.setState(prevState => ({
      mapConfig: update(prevState.mapConfig, {
        layers: {
          [layerIndex]: {
            $merge: updates,
          },
        },
      }),
    }));
  },

  handleToggleExpanded() {
    this.setState({ layerListExpanded: !this.state.layerListExpanded });
  },

  render() {
    const mapConfig = this.state.mapConfig;

    // remove highlightPoints layer if it exists
    mapConfig.layers.forEach((layer, i) => {
      if (layer.id === 'highlightPoints') mapConfig.layers.splice(i, 1);
    });

    // add legendItems for each layer
    const legendItems = [];

    // TODO combine all these forEach() into one big one

    mapConfig.layers.forEach((layer) => {
      if (layer.visible && layer.legend) {
        legendItems.push(<div key={layer.id}>{layer.legend}</div>);
      }
    });

    // add highlighted points for each layer

    const highlightPointFeatures = [];

    mapConfig.layers.forEach((layer) => {
      if (layer.visible && layer.highlightPointLayers) {
        // get selected features
        const layerSelectedFeatures = this.state.selectedFeatures.filter(feature => layer.interactivityMapLayers.indexOf(feature.layer.id) > -1);


        layerSelectedFeatures.forEach((layerSelectedFeature) => {
          highlightPointFeatures.push({
            type: 'Feature',
            geometry: layerSelectedFeature.geometry,
            properties: {},
          });
        });
      }
    });

    const highlightPointFeatureCollection = {
      type: 'FeatureCollection',
      features: highlightPointFeatures,
    };

    mapConfig.layers.push({
      id: 'highlightPoints',
      visible: 'true',
      showInLayerList: false,
      sources: [{
        id: 'highlightPoints',
        type: 'geojson',
        data: highlightPointFeatureCollection,
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
          'circle-stroke-opacity': 0.8,
        },
      }],
    });


    let leftOffset = 36;
    if (this.state.layerListExpanded) leftOffset += 164;
    if (this.state.layerContentVisible) leftOffset += 320;

    const selectedLayer = this.state.mapConfig.selectedLayer;

    return (

      <div className="jane-container" style={this.props.style}>
        <div
          className="jane-map-container" style={{
            left: leftOffset,
          }}
        >
          {
            this.props.search && (
              <Search
                {...this.props.searchConfig}
                onGeocoderSelection={this.showPoiMarker}
                onClear={this.hidePoiMarker}
                selectionActive={this.state.poiFeature}
              />
            )
          }

          {
            legendItems.length > 0 && (
              <div className="jane-legend">
                {legendItems}
              </div>
            )
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
          layers={this.state.mapConfig.layers}
          selectedLayer={selectedLayer}
          onLayerReorder={this.handleLayerReorder}
          onLayerClick={this.handleLayerClick}
          onToggleExpanded={this.handleToggleExpanded}
          onLayerToggle={this.handleLayerToggle}
        />

        <LayerContent
          offset={this.state.layerListExpanded}
          visible={this.state.layerContentVisible}
          layers={this.state.mapConfig.layers}
          selectedLayer={selectedLayer}
          onLayerUpdate={this.handleLayerUpdate}
          onLayerToggle={this.handleLayerToggle}
          onClose={this.toggleLayerContent}
        />

        { this.state.mapLoaded && <MapHandler map={this.map} mapConfig={mapConfig} /> }
      </div>

    );
  },
});

export default Jane;
