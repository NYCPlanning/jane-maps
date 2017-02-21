import React from 'react';

const MapLayer = React.createClass({
  propTypes: {
    map: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired,
  },

  componentDidMount() {
    this.map = this.props.map.mapObject;
    this.map.addLayer(this.props.config);
  },

  componentWillUnmount() {
    this.map.removeLayer(this.props.config.id);
  },

  render() {
    return (
      null
    );
  },
});

export default MapLayer;
