import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

class GLMap extends React.Component {
  componentDidMount() {
    this.initializeMap();
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props, nextProps);
  }

  componentDidUpdate() {
    // TODO this is a hack to get the GL map to resize to its container after changing the container size.  Need to find a less hacky way to do this
    setTimeout(() => this.map && this.map.resize(), 500);
  }

  initializeMap() {
    mapboxgl.accessToken = this.props.mapbox_accessToken;

    this.map = new mapboxgl.Map({
      container: this.container,
      style: this.props.mapStyle,
      zoom: this.props.zoom,
      minZoom: this.props.minZoom,
      center: this.props.center,
      pitch: this.props.pitch,
      hash: this.props.hash,
    });

    this.map.on('load', () => {
      this.props.onLoad(this.map.getStyle());
    });

    if (this.props.navigationControl) this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  }

  flyMap(feature, zoom = 15) {
    this.map.flyTo({
      center: feature.geometry.coordinates,
      zoom,
    });
  }

  render() {
    return (
      <div className="gl-map" ref={(node) => { this.container = node; }}/>
    );
  }
}

GLMap.propTypes = {
  mapbox_accessToken: PropTypes.string.isRequired,
  mapStyle: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired,
  minZoom: PropTypes.number,
  center: PropTypes.array.isRequired,
  pitch: PropTypes.number,
  hash: PropTypes.bool,
  navigationControl: PropTypes.bool.isRequired,
};

GLMap.defaultProps = {
  mapStyle: 'mapbox://styles/mapbox/light-v9',
  center: [0, 0],
  zoom: 2,
  minZoom: null,
  maxZoom: null,
  pitch: 0,
  hash: false,
  navigationControl: true,
  navigationControlPosition: 'top-right',
};

export default GLMap;
