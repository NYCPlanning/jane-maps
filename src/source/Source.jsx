import React from 'react';
import PropTypes from 'prop-types';

import GeoJsonSource from './GeoJsonSource';
import VectorSource from './VectorSource';
import CartoVectorSource from './CartoVectorSource';
import RasterSource from './RasterSource';
import CartoRasterSource from './CartoRasterSource';


class Source extends React.Component {
  render() {
    const source = this.props;
    const onLoaded = this.props.onSourceLoaded;
    const map = this.props.map;
    const isLoaded = !!this.context.loadedSources[this.props.id];

    if (source.type === 'geojson') return <GeoJsonSource map={map} source={source} onLoaded={onLoaded} isLoaded={isLoaded}/>;
    if (source.type === 'vector') return <VectorSource map={map} source={source} onLoaded={onLoaded} isLoaded={isLoaded} />;
    if (source.type === 'cartovector' && source.options) return <CartoVectorSource map={map} source={source} onLoaded={onLoaded} isLoaded={isLoaded} />;
    if (source.type === 'raster') return <RasterSource map={map} source={source} onLoaded={onLoaded} isLoaded={isLoaded} />;
    if (source.type === 'cartoraster') return <CartoRasterSource map={map} source={source} onLoaded={onLoaded} isLoaded={isLoaded} />;

    return null;
  }
}

Source.contextTypes = {
  loadedSources: PropTypes.object,
};

Source.propTypes = {
  id: PropTypes.string.isRequired,
  map: PropTypes.object,
  onSourceLoaded: PropTypes.func,
  nocache: PropTypes.bool,
};

Source.defaultProps = {
  map: null,
  onSourceLoaded: null,
  nocache: false,
};

export default Source;
