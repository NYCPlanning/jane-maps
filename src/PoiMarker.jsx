import React from 'react';

const PoiMarker = React.createClass({
  propTypes: {
    feature: React.PropTypes.object.isRequired,
    map: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
  },

  componentDidMount() {
    const el = document.createElement('div');
    el.className = 'marker';
    // TODO entire marker should be config-driven
    // url reference breaks depending on how the site is hosted
    // so for now just reference the marker image on the production domain
    el.style.backgroundImage = 'url(//capitalplanning.nyc.gov/img/orange-marker.png)';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.zIndex = 10;

    this.marker = new mapboxgl.Marker(el, { // eslint-disable-line no-undef
      offset: [-16, -32],
    });


    this.label = new mapboxgl.Popup({ // eslint-disable-line no-undef
      offset: [6, 0],
      anchor: 'left',
      closeButton: false,
      closeOnClick: false,
    });

    this.updateMarker(this.props.feature);
  },

  componentWillUpdate(nextProps) {
    if (JSON.stringify(nextProps.feature) !== JSON.stringify(this.props.feature)) {
      this.updateMarker(nextProps.feature);
    }
  },

  componentWillUnmount() {
    this.marker.remove();
    this.label.remove();
  },

  updateMarker(feature) {
    this.marker
      .setLngLat(feature.geometry.coordinates)
      .addTo(this.props.map.mapObject);
    this.label
      .setLngLat(feature.geometry.coordinates)
      .setHTML(`<p>${this.props.label}</p>`)
      .addTo(this.props.map.mapObject);

    this.props.map.flyMap(feature);
  },

  render() {
    return (<div />);
  },
});

export default PoiMarker;
