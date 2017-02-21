// source prop should have 'data' property with geoJSON, or 'source' property with URL to geojson

import React from 'react';

const GeoJsonSource = React.createClass({
  propTypes: {
    map: React.PropTypes.object.isRequired,
    source: React.PropTypes.object.isRequired,
    onLoaded: React.PropTypes.func.isRequired,
  },

  componentWillMount() {
    this.map = this.props.map.mapObject;
    // fetch data if necessary, add layer to map
    if (!this.props.source.data) {
      this.fetchData();
    } else {
      this.data = this.props.source.data;
      this.addSource();
    }
  },

  componentWillReceiveProps(nextProps) {
    // compare sql
    if (!(nextProps.source.data === this.props.source.data)) {
      this.data = nextProps.source.data;
      this.map.getSource(this.props.source.id).setData(this.data);
    }
  },

  fetchData() {
    const self = this;

    $.getJSON(this.props.source.source) // eslint-disable-line no-undef
      .then((data) => {
        self.data = data;
        self.addSource();
      });
  },

  addSource() {
    this.map.addSource(this.props.source.id, {
      type: 'geojson',
      data: this.data,
    });

    this.props.onLoaded(this.map.getStyle().sources);
  },

  render() {
    return null;
  },
});

export default GeoJsonSource;
