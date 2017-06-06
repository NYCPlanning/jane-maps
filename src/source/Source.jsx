import React from 'react';
import PropTypes from 'prop-types';

import GeoJsonSource from './GeoJsonSource';
import VectorSource from './VectorSource';
import CartoVectorSource from './CartoVectorSource';
import RasterSource from './RasterSource';
import CartoRasterSource from './CartoRasterSource';


class Source extends React.Component {
  static contextTypes = {
    map: PropTypes.object,
    onSourceLoaded: PropTypes.func
  };

  componentWillUnmount() {
    this.context.map.mapObject.removeSource(this.props.id);
    // let jane know what sources are still loaded
    this.context.onSourceLoaded(this.context.map.mapObject.getStyle().sources);
  }

  render() {
    if (!this.context.map) {
      return null;
    }

    const source = this.props;
    const onLoaded = this.context.onSourceLoaded;
    const map = this.context.map;

    if (source.type === 'geojson') return <GeoJsonSource map={map} source={source} onLoaded={onLoaded}/>;
    if (source.type === 'vector') return <VectorSource map={map} source={source} onLoaded={onLoaded}/>;
    if (source.type === 'cartovector' && source.options) return <CartoVectorSource map={map} source={source} onLoaded={onLoaded}/>;
    if (source.type === 'raster') return <RasterSource map={map} source={source} onLoaded={onLoaded}/>;
    if (source.type === 'cartoraster') return <CartoRasterSource map={map} source={source} onLoaded={onLoaded}/>;

    return null;
  }
}

Source.propTypes = {};

export default Source;
