import React from 'react';
import PropTypes from 'prop-types';

import GeoJsonSource from './GeoJsonSource';
import RasterSource from './RasterSource';
import CartoVectorSource from './CartoVectorSource';
import CartoRasterSource from './CartoRasterSource';


class Source extends React.Component {
  componentWillUnmount() {
    this.removeSource();
  }

  removeSource() {
    this.props.map.mapObject.removeSource(this.props.source.id);
    // let jane know what sources are still loaded
    this.props.onLoaded(this.props.map.mapObject.getStyle().sources);
  }

  render() {
    const source = this.props.source;

    if (source.type === 'geojson') return <GeoJsonSource {...this.props} />;
    if (source.type === 'raster') return <RasterSource {...this.props} />;
    if (source.type === 'cartovector' && source.options) return <CartoVectorSource {...this.props} />;
    if (source.type === 'cartoraster') return <CartoRasterSource {...this.props} />;

    return null;
  }
}

Source.propTypes = {
  map: PropTypes.object.isRequired,
  source: PropTypes.object.isRequired,
  onLoaded: PropTypes.func.isRequired,
};

export default Source;
