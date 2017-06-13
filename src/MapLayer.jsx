import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

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

    if (!_.isEqual(this.props.config, nextProps.config)) {
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
      source: props.source,
    };

    this.props.map.mapObject.addLayer(config, props.previousMapLayer);

    if (this.props.onClick) {
      this.props.map.mapObject.on('mousemove', this.onMouseMove);
      this.props.map.mapObject.on('click', this.onClick);
    }
  }

  removeLayer() {
    this.props.map.mapObject.removeLayer(this.props.id);

    if (this.props.onClick) {
      this.props.map.mapObject.off('mousemove', this.onMouseMove);
      this.props.map.mapObject.off('click', this.onClick);
    }
  }

  onMouseMove = (event) => {
    const layerFeatures = this.props.map.mapObject.queryRenderedFeatures(event.point, { layers: [this.props.id] });
    this.props.map.mapObject.getCanvas().style.cursor = (layerFeatures && layerFeatures.length > 0) ? 'pointer' : '';
  };

  onClick = (event) => {
    const features = this.props.map.mapObject.queryRenderedFeatures(event.point, { layers: [this.props.id] });
    const uniqueFeatures = _.uniq(features, feature => feature.id);

    if (uniqueFeatures.length > 0) {
      this.props.onClick(uniqueFeatures);
    }
  };

  render() {
    return null;
  }
}

MapLayer.propTypes = {
  map: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  janeLayer: PropTypes.string,
  previousMapLayer: PropTypes.string,
  onClick: PropTypes.func,
};

MapLayer.defaultProps = {
  map: {},
  previousMapLayer: null,
  janeLayer: null,
};

export default MapLayer;
