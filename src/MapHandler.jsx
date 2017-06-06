// MapHandler - a component that figures out which sources and mapLayers should exist on the map,
// and renders appropriate components
import React from 'react';
import PropTypes from 'prop-types';

import MapLayer from './MapLayer';
import Source from './source/Source';

class MapHandler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadedSources: {},
    };
  }

  handleSourceLoaded = (loadedSources) => {
    this.setState({ loadedSources });
  };

  render() {
    // load all sources for visible layers
    const { mapConfig, map } = this.props;

    const sources = mapConfig
      .reduce((result, layer) => result.concat(layer.sources), [])
      .map((source) => (
        <Source map={map} source={source} onLoaded={this.handleSourceLoaded} key={source.id} />
      ));

    // check to see if all sources for visible layers are loaded
    let allSourcesLoaded = true;

    mapConfig.forEach((layer) => {
      if (layer.sources && layer.mapLayers) {
        layer.mapLayers.forEach((mapLayer) => {
          if (!Object.prototype.hasOwnProperty.call(this.state.loadedSources, mapLayer.source)) { allSourcesLoaded = false; }
        });
      }
    });

    // create <MapLayer> components for each visible layer, but only if all required sources are already loaded
    const mapLayers = [];

    if (allSourcesLoaded) {
      this.order = 0;
      mapConfig.forEach((layer) => {
        // render layers in order
        if (layer.sources && layer.mapLayers) {
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
  }
}

MapHandler.propTypes = {
  mapConfig: PropTypes.array.isRequired,
  map: PropTypes.object.isRequired,
};

export default MapHandler;
