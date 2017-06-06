// MapHandler - a component that figures out which sources and mapLayers should exist on the map,
// and renders appropriate components
import React from 'react';
import PropTypes from 'prop-types';

import MapLayer from './MapLayer';

class MapHandler extends React.Component {
  render() {
    // load all sources for visible layers
    const { mapConfig, map } = this.props;

    // check to see if all sources for visible layers are loaded
    let allSourcesLoaded = true;

    mapConfig.forEach((layer) => {
      if (layer.sources && layer.mapLayers) {
        layer.mapLayers.forEach((mapLayer) => {
          if (!Object.prototype.hasOwnProperty.call(this.props.loadedSources, mapLayer.source)) { allSourcesLoaded = false; }
        });
      }
    });

    // create <MapLayer> components for each visible layer, but only if all required sources are already loaded
    const mapLayers = [];

    if (allSourcesLoaded) {
      mapConfig.forEach((layer, index) => {
        // render layers in order
        if (layer.sources && layer.mapLayers) {
          layer.mapLayers.forEach((mapLayer) => {
            mapLayers.push(<MapLayer map={map} config={mapLayer} key={mapLayer.id + index} />);
          });
        }
      });
    }

    return (
      <div>
        {mapLayers}
      </div>
    );
  }
}

MapHandler.propTypes = {
  mapConfig: PropTypes.array.isRequired,
  map: PropTypes.object.isRequired,
  loadedSources: PropTypes.object.isRequired,
};

export default MapHandler;
