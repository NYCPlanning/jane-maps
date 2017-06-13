import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

const LAYER_TYPES = ['fill', 'line', 'symbol', 'circle', 'fill-extrusion', 'raster', 'background'];

class MapLayer extends React.Component {
  componentWillMount() {
    if (!this.props.janeLayer) {
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

  addLayer(props) {
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
      this.props.map.on('mousemove', this.onMouseMove);
      this.props.map.on('click', this.onClick);
    }
  }

  removeLayer() {
    this.props.map.removeLayer(this.props.id);

    if (this.props.onClick) {
      this.props.map.off('mousemove', this.onMouseMove);
      this.props.map.off('click', this.onClick);
    }
  }

  redrawLayer = (props) => {
    this.removeLayer();
    this.addLayer(props || this.props);
  };

  onMouseMove = (event) => {
    const layerFeatures = this.props.map.queryRenderedFeatures(event.point, { layers: [this.props.id] });
    this.props.map.getCanvas().style.cursor = (layerFeatures && layerFeatures.length > 0) ? 'pointer' : '';
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
  janeLayer: PropTypes.string,
  previousMapLayer: PropTypes.string,
  onClick: PropTypes.func,
  registerRedrawCallback: PropTypes.func.isRequired,
};

MapLayer.defaultProps = {
  map: {},
  registerRedrawCallback: () => null,
  previousMapLayer: null,
  janeLayer: null,
};

export default MapLayer;
