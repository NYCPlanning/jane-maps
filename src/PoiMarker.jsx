import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';

class PoiMarker extends React.Component {

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

    const { feature, label } = this.props;

    this.updateMarker(feature, label);
  }

  componentWillUpdate(nextProps) {
    if (JSON.stringify(nextProps.feature) !== JSON.stringify(this.props.feature)) {
      this.updateMarker(nextProps.feature, nextProps.label);
    }
  }

  componentWillUnmount() {
    this.marker.remove();
    this.label.remove();
  }

  updateMarker(feature, label) {
    const { map } = this.props;

    this.marker
      .setLngLat(feature.geometry.coordinates)
      .addTo(map.mapObject);

    this.label
      .setLngLat(feature.geometry.coordinates)
      .setHTML(`<p>${label}</p>`)
      .addTo(map.mapObject);

    map.flyMap(feature);
  }

  render() {
    return (<div />);
  }
}

PoiMarker.propTypes = {
  feature: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
};


export default PoiMarker;
