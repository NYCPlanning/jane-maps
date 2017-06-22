import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

const LAYER_TYPES = ['fill', 'line', 'symbol', 'circle', 'fill-extrusion', 'raster', 'background'];

class MapLayer extends React.Component {

  static displayName = 'MapLayer';

  componentWillMount() {
    if (!this.props.janeLayerId) {
      console.error(`<MapLayer /> has to be a direct child of <JaneLayer />. Check layer with id ${this.props.id}`);
    }

    this.props.registerRedrawCallback(this.redrawLayer);
  }

  componentDidMount() {
    this.addLayer(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.redrawLayer(nextProps)
    }
  }

  componentWillUnmount() {
    this.removeLayer();
  }

  layerExists() {
    return !!this.props.map.getLayer(this.props.id);
  }

  addLayer(props) {
    if (this.layerExists()) {
      return;
    }

    const config = _.pick(props,
      'id',
      'type',
      'metadata',
      'ref',
      'source',
      'sourceLayer',
      'minzoom',
      'maxzoom',
      'filter',
      'layout',
      'paint'
    );

    if (config.sourceLayer) {
      config['source-layer'] = config.sourceLayer;
      delete config.sourceLayer
    }

    this.props.map.addLayer(config, props.previousMapLayer);

    if (this.props.onClick) {
      this.props.map.__INTERNAL__hoverLayers[this.props.id] = true;
      this.props.map.on('click', this.onClick);
    }
  }

  removeLayer() {
    if (!this.layerExists()) {
      return;
    }

    this.props.map.removeLayer(this.props.id);

    if (this.props.onClick) {
      delete this.props.map.__INTERNAL__hoverLayers[this.props.id];
      this.props.map.off('click', this.onClick);
    }
  }

  redrawLayer = (props) => {
    if (!this.layerExists()) {
      return;
    }

    this.removeLayer();
    this.addLayer(props || this.props);
  };

  onClick = (event) => {
    const features = this.props.map.queryRenderedFeatures(event.point, { layers: [this.props.id] });
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
  type: PropTypes.oneOf(LAYER_TYPES),
  metadata: PropTypes.object,
  ref: PropTypes.string,
  source: PropTypes.string,
  sourceLayer: PropTypes.string,
  minzoom: PropTypes.number,
  maxzoom: PropTypes.number,
  filter: PropTypes.array,
  layout: PropTypes.object,
  paint: PropTypes.object,
  janeLayerId: PropTypes.string,
  previousMapLayer: PropTypes.string,
  order: PropTypes.number,
  onClick: PropTypes.func,
  registerRedrawCallback: PropTypes.func.isRequired,
};

MapLayer.defaultProps = {
  map: {},
  registerRedrawCallback: () => null,
  previousMapLayer: null,
  janeLayerId: null,
};

export default MapLayer;
