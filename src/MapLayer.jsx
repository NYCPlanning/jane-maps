import React from 'react';
import PropTypes from 'prop-types';

class MapLayer extends React.Component {
  componentWillMount() {
    if (!this.props.janeLayer) {
      console.error(`<MapLayer /> has to be a direct child of <JaneLayer />. Check layer with id ${this.props.id}`);
    }
  }

  componentDidMount() {
    this.addLayer(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.previousMapLayer !== nextProps.previousMapLayer) {
      this.removeLayer();
      this.addLayer(nextProps);
      return;
    }

    if (JSON.stringify(this.props.config) !== JSON.stringify(nextProps.config)) {
      this.removeLayer();
      this.addLayer(nextProps);
    }
  }

  componentWillUnmount() {
    this.removeLayer();
  }

  addLayer(props) {
    const config = {
      ...props.config,
      id: props.id,
      source: props.source
    };

    this.props.map.mapObject.addLayer(config, props.previousMapLayer);
  }

  removeLayer() {
    this.props.map.mapObject.removeLayer(this.props.id);
  }

  render() {
    return null;
  }
}

MapLayer.propTypes = {
  map: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  janeLayer: PropTypes.string,
  previousMapLayer: PropTypes.string
};

export default MapLayer;
