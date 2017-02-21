// MapHandler - a component that figures out which sources and mapLayers should exist on the map,
// and renders appropriate components
import React, { PropTypes } from 'react';

import MapLayer from './MapLayer';
import Source from './source/Source';

const MapHandler = React.createClass({
  propTypes: {
    mapConfig: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      loadedSources: {},
    };
  },

  handleSourceLoaded(loadedSources) {
    this.setState({ loadedSources });
  },

  render() {
    // load all sources for visible layers
    const sources = [];
    const { mapConfig, map } = this.props;

    mapConfig.layers.forEach((layer) => {
      if (layer.sources && layer.visible) {
        layer.sources.forEach((source) => {
          sources.push(
            <Source map={map} source={source} onLoaded={this.handleSourceLoaded} key={source.id} />,
          );
        });
      }
    });

    // check to see if all sources for visible layers are loaded
    let allSourcesLoaded = true;

    mapConfig.layers.forEach((layer) => {
      if (layer.visible && layer.sources && layer.mapLayers) {
        layer.mapLayers.forEach((mapLayer) => {
          if (!Object.prototype.hasOwnProperty.call(this.state.loadedSources, mapLayer.source)) { allSourcesLoaded = false; }
        });
      }
    });

    // create <MapLayer> components for each visible layer, but only if all required sources are already loaded
    const mapLayers = [];

    if (allSourcesLoaded) {
      this.order = 0;
      mapConfig.layers.forEach((layer) => {
        // render layers in order
        if (layer.visible && layer.sources && layer.mapLayers) {
          layer.mapLayers.forEach((mapLayer) => {
            mapLayers.push(<MapLayer map={map} config={mapLayer} key={mapLayer.id + this.order} />);
          });

          this.order = this.order + 1;
        }
      });
    }

    return (
      <div>
        {sources}
        {mapLayers}
      </div>
    );
  },
});

export default MapHandler;
