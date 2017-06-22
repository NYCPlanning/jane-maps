import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import _ from 'underscore';

class Marker extends React.Component {

  static displayName = 'Marker';

  componentDidMount() {
    const el = document.createElement('div');
    el.className = 'marker';
    // TODO entire marker should be config-driven
    // url reference breaks depending on how the site is hosted
    // so for now just reference the marker image on the production domain
    el.style.backgroundImage = 'url(//capitalplanning.nyc.gov/img/orange-marker.png)';
    el.style.width = '32px';
    el.style.height = '32px';

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
    if (!_.isEqual(nextProps.feature, this.props.feature)) {
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
      .addTo(map);

    this.label
      .setLngLat(feature.geometry.coordinates)
      .setHTML(`<p>${label}</p>`)
      .addTo(map);

    if (this.props.flyTo) {
      map.flyTo({
        center: feature.geometry.coordinates,
        zoom: 15,
      });
    }
  }

  render() {
    return null;
  }
}

Marker.propTypes = {
  flyTo: PropTypes.bool,
  feature: PropTypes.object.isRequired,
  map: PropTypes.object,
  label: PropTypes.string.isRequired,
};

Marker.defaultProps = {
  flyTo: false,
  map: {},
};


export default Marker;
