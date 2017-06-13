import React from 'react';
import PropTypes from 'prop-types';

import GeoJsonSource from './GeoJsonSource';
import VectorSource from './VectorSource';
import CartoVectorSource from './CartoVectorSource';
import RasterSource from './RasterSource';
import CartoRasterSource from './CartoRasterSource';


class Source extends React.Component {
  componentWillUnmount() {
    this.props.map.removeSource(this.props.id);
    // let jane know what sources are still loaded
    this.props.onSourceLoaded(this.props.map.getStyle().sources);
  }

  render() {
    const source = this.props;
    const onLoaded = this.props.onSourceLoaded;
    const map = this.props.map;

    if (source.type === 'geojson') return <GeoJsonSource map={map} source={source} onLoaded={onLoaded} />;
    if (source.type === 'vector') return <VectorSource map={map} source={source} onLoaded={onLoaded} />;
    if (source.type === 'cartovector' && source.options) return <CartoVectorSource map={map} source={source} onLoaded={onLoaded} />;
    if (source.type === 'raster') return <RasterSource map={map} source={source} onLoaded={onLoaded} />;
    if (source.type === 'cartoraster') return <CartoRasterSource map={map} source={source} onLoaded={onLoaded} />;

    return null;
  }
}

Source.propTypes = {
  id: PropTypes.string.isRequired,
  map: PropTypes.object,
  onSourceLoaded: PropTypes.func,
};

Source.defaultProps = {
  map: null,
  onSourceLoaded: null,
};

export default Source;
