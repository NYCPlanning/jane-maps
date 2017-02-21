import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

const GLMap = React.createClass({
  propTypes: {
    mapbox_accessToken: React.PropTypes.string.isRequired,
    mapStyle: React.PropTypes.string.isRequired,
    zoom: React.PropTypes.number.isRequired,
    minZoom: React.PropTypes.number,
    center: React.PropTypes.array.isRequired,
    pitch: React.PropTypes.number,
    hash: React.PropTypes.bool,
    navigationControl: React.PropTypes.bool.isRequired,
  },

  getDefaultProps() {
    return {
      minZoom: null,
      pitch: null,
      hash: null,
    };
  },

  componentDidMount() {
    this.initializeMap();
  },

  componentDidUpdate() {
    // TODO this is a hack to get the GL map to resize to its container after changing the container size.  Need to find a less hacky way to do this
    setTimeout(() => this.mapObject && this.mapObject.resize(), 500);
  },

  initializeMap() {
    const self = this;

    mapboxgl.accessToken = this.props.mapbox_accessToken;

    this.mapObject = new mapboxgl.Map({
      container: this.container,
      style: this.props.mapStyle,
      zoom: this.props.zoom,
      minZoom: this.props.minZoom,
      center: this.props.center,
      pitch: this.props.pitch,
      hash: this.props.hash,
    });

    const map = this.mapObject;

    this.mapObject.on('load', () => {
      self.props.onLoad(self.mapObject.getStyle());
    });

    if (this.props.navigationControl) map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  },

  flyMap(feature, zoom = 15) {
    this.mapObject.flyTo({
      center: feature.geometry.coordinates,
      zoom,
    });
  },

  render() {
    return (
      <div
        className="gl-map"
        ref={(x) => { this.container = x; }}
      />
    );
  },
});

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

