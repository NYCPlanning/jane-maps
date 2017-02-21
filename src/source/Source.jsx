import React from 'react';

import GeoJsonSource from './GeoJsonSource';
import RasterSource from './RasterSource';
import CartoVectorSource from './CartoVectorSource';
import CartoRasterSource from './CartoRasterSource';


const Source = React.createClass({
  propTypes: {
    map: React.PropTypes.object.isRequired,
    source: React.PropTypes.object.isRequired,
    onLoaded: React.PropTypes.func.isRequired,
  },

  componentWillUnmount() {
    this.removeSource();
  },

  removeSource() {
    this.props.map.mapObject.removeSource(this.props.source.id);
    // let jane know what sources are still loaded
    this.props.onLoaded(this.props.map.mapObject.getStyle().sources);
  },

  render() {
    const source = this.props.source;

    if (source.type === 'geojson') return <GeoJsonSource {...this.props} />;
    if (source.type === 'raster') return <RasterSource {...this.props} />;
    if (source.type === 'cartovector' && source.options) return <CartoVectorSource {...this.props} />;
    if (source.type === 'cartoraster') return <CartoRasterSource {...this.props} />;

    return null;
  },
});

export default Source;
