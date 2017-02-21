import React from 'react';
import update from 'react/lib/update';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';


import GLMap from './GLMap';
import LayerContent from './LayerContent';
import LayerList from './LayerList';
import PoiMarker from './PoiMarker';
import Search from './Search';
import SelectedFeaturesPane from './SelectedFeaturesPane';
import MapHandler from './MapHandler';

// styles should be manually imported from whatever is using Jane for now
// import './styles.scss'

const Jane = React.createClass({
  propTypes: {
    poiFeature: React.PropTypes.object,
    poiLabel: React.PropTypes.string,
    mapConfig: React.PropTypes.object.isRequired,
    layerContentVisible: React.PropTypes.bool,
    mapInit: React.PropTypes.object.isRequired,
    style: React.PropTypes.object,
    context: React.PropTypes.object,
    search: React.PropTypes.bool,
    searchConfig: React.PropTypes.object,
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
      context: null,
      search: false,
      searchConfig: null,
    };
  },

  getInitialState() {
    const defaultMapConfig = {
      layers: [],
    };

    return ({
      poiFeature: this.props.poiFeature ? this.props.poiFeature : null,
      poiLabel: this.props.poiLabel ? this.props.poiLabel : null,
      mapLoaded: false,
      mapConfig: this.props.mapConfig ? this.props.mapConfig : defaultMapConfig,
      layerListExpanded: false,
      layerContentVisible: this.props.layerContentVisible,
      selectedFeatures: [],
    });
  },

  componentDidMount() {
    // this.map is the GLMap Component, not the map object itself

    this.map.mapObject.on('zoomend', this.resetSelectedFeatures);
    this.map.mapObject.on('dragend', this.resetSelectedFeatures);

    this.map.mapObject.on('click', this.handleMapLayerClick);
    this.map.mapObject.on('mousemove', this.handleMapMousemove);
  },

  onMapLoad() {
    this.setState({ mapLoaded: true });
  },

  // return an array of all loaded mapLayers
  getLoadedMapLayers() {
    const mapLayers = [];

    this.state.mapConfig.layers.forEach((layer) => {
      layer.mapLayers.forEach((mapLayer) => {
        if (layer.visible && this.map.mapObject.getLayer(mapLayer.id)) {
          mapLayers.push(mapLayer.id);
        }
      });
    });

    return mapLayers;
  },

  handleLayerReorder(layers) {
    this.state.mapConfig.layers = layers;

    this.setState({ mapConfig: this.state.mapConfig });
  },

  handleLayerClick(layerid) {
    const visible = this.isLayerVisible(layerid);

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

  isLayerVisible(layerid) {
    // checks if layer with id of layerid is visible, returns boolean
    const thisLayer = this.state.mapConfig.layers.filter(layer => layer.id === layerid)[0];
    return thisLayer.visible;
  },

  handleMapLayerClick(e) {
    const mapLayers = this.getLoadedMapLayers();

    const features = this.map.mapObject.queryRenderedFeatures(e.point, { layers: mapLayers });

    this.setState({
      selectedFeatures: features,
    });
  },

  handleMapMousemove(e) {
    const mapLayers = this.getLoadedMapLayers();

    const features = this.map.mapObject.queryRenderedFeatures(e.point, { layers: mapLayers });

    this.map.mapObject.getCanvas().style.cursor = (features.length > 0) ? 'pointer' : '';
  },

  handleLayerToggle(layerid) {
    const theLayer = this.state.mapConfig.layers.find((layer => layer.id === layerid));
    theLayer.visible = !theLayer.visible;

    // clear selectedlayer
    if (this.state.mapConfig.selectedLayer === layerid) {
      this.state.mapConfig.selectedLayer = '';
      if (this.state.layerContentVisible) this.toggleLayerContent();
    }

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

  resetSelectedFeatures() {
    this.setState({
      selectedFeatures: [],
    });
  },

  highlightFeature(feature) {
    const map = this.map.mapObject;
    try {
      map.removeLayer('highlighted');
      map.removeSource('highlighted');
    } catch (err) {
      // ignore
    }

    map.addSource('highlighted', {
      type: 'geojson',
      data: feature,
    });

    map.addLayer({
      id: 'highlighted',
      type: 'circle',
      source: 'highlighted',
      paint: {
        'circle-radius': 14,
        'circle-color': 'steelblue',
        'circle-opacity': 0.5,
      },
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

    // add legendItems for each layer
    const legendItems = [];

    mapConfig.layers.forEach((layer) => {
      if (layer.visible && layer.legend) {
        legendItems.push(<div key={layer.id}>{layer.legend}</div>);
      }
    });

    // add selected feature items for each layer
    const selectedFeatureItems = [];

    mapConfig.layers.forEach((layer, i) => {
      if (layer.listItem && layer.visible && layer.interactivityMapLayers) {
        const SelectedFeatureItem = layer.listItem ? layer.listItem : null;
        const layerSelectedFeatures = this.state.selectedFeatures.filter(feature => layer.interactivityMapLayers.indexOf(feature.layer.id) > -1);

        layerSelectedFeatures.forEach((layerSelectedFeature, j) => {
          selectedFeatureItems.push(<SelectedFeatureItem feature={layerSelectedFeature} key={i.toString() + j.toString()} />);
        });
      }
    });


    let leftOffset = 36;
    if (this.state.layerListExpanded) leftOffset += 164;
    if (this.state.layerContentVisible) leftOffset += 320;

    const selectedLayer = this.state.mapConfig.selectedLayer;

    return (

      <MuiThemeProvider>
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
            context={this.props.context}
          />

          <SelectedFeaturesPane
            style={{
              right: (selectedFeatureItems.length > 0) ? 0 : -250,
            }}
          >
            {selectedFeatureItems}
          </SelectedFeaturesPane>

          { this.state.mapLoaded && <MapHandler map={this.map} mapConfig={mapConfig} /> }
        </div>
      </MuiThemeProvider>

    );
  },
});

export default Jane;
