import React from 'react';
import PropTypes from 'prop-types';

class RasterSource extends React.Component {

  static displayName = 'RasterSource';

  componentWillMount() {
    this.map = this.props.map;

    if (this.props.isLoaded && !this.props.source.nocache) {
      return;
    }

    // fetch data if necessary, add layer to map
    this.addSource();
  }

  componentWillUnmount() {
    if (this.props.source.nocache) {
      this.map.removeSource(this.props.source.id);
    }
  }

  addSource() {
    if (this.map.getSource(this.props.source.id)) {
      this.map.removeSource(this.props.source.id);
    }

    this.map.addSource(this.props.source.id, {
      type: 'raster',
      tiles: [this.props.source.tiles],
      tileSize: this.props.source.tileSize,
    });

    this.props.onLoaded(this.map.getStyle().sources);
  }

  render() {
    return null;
  }
}

RasterSource.propTypes = {
  map: PropTypes.object.isRequired,
  source: PropTypes.object.isRequired,
  onLoaded: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool,
  nocache: PropTypes.bool,
};

export default RasterSource;
