import React from 'react';
import PropTypes from 'prop-types';

class MapLayer extends React.Component {
  componentDidMount() {
    this.map = this.props.map.mapObject;
    this.map.addLayer(this.props.config);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.config) !== JSON.stringify(nextProps.config)) {
      this.map.removeLayer(this.props.config.id);
      this.map.addLayer(nextProps.config);
    }
  }

  componentWillUnmount() {
    this.map.removeLayer(this.props.config.id);
  }

  render() {
    return null;
  }
}

MapLayer.propTypes = {
  map: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

const MapLayerWrapper = (props, context) => {
  if (!context.map) {
    return null;
  }

  return <MapLayer {...props} map={context.map}/>
};

MapLayerWrapper.contextTypes = {
  map: PropTypes.object
};

export default MapLayerWrapper;
