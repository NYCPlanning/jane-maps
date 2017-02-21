import React from 'react';
import Carto from '../Carto';

const CartoVectorSource = React.createClass({
  propTypes: {
    map: React.PropTypes.shape({
      mapObject: React.PropTypes.object,
    }).isRequired,
    source: React.PropTypes.shape({
      options: React.PropTypes.object,
      tiles: React.PropTypes.array,
      id: React.PropTypes.string,
    }).isRequired,
    onLoaded: React.PropTypes.func.isRequired,
  },

  componentWillMount() {
    this.map = this.props.map.mapObject;
    // fetch data if necessary, add layer to map
    if (!this.props.source.tiles) {
      this.fetchData(this.props.source.options.sql, this.addSource);
    }
  },

  componentWillReceiveProps(nextProps) {
    // compare sql
    if (!(nextProps.source.options.sql === this.props.source.options.sql)) {
      this.fetchData(nextProps.source.options.sql, this.updateSource);
    }
  },

  fetchData(sqlArray, cb) {
    const mapConfig = {
      version: '1.3.0',
      layers: [],
    };

    sqlArray.forEach((sql) => {
      mapConfig.layers.push({
        type: 'mapnik',
        options: {
          cartocss_version: '2.1.1',
          cartocss: '#layer { polygon-fill: #FFF; }',
          sql,
        },
      });
    });


    Carto.getVectorTileTemplate(mapConfig, this.props.source.options)
      .then((template) => {
        cb(template);
      });
  },

  addSource(template) {
    if (this.map.getSource(this.props.source.id)) {
      this.map.removeSource(this.props.source.id);
    }

    this.map.addSource(this.props.source.id, {
      type: 'vector',
      tiles: [template],
    });

    this.props.onLoaded(this.map.getStyle().sources);
  },

  updateSource(template) {
    const newStyle = this.map.getStyle();
    newStyle.sources[this.props.source.id].tiles = [template];
    this.map.setStyle(newStyle);
  },

  render() {
    return null;
  },
});

export default CartoVectorSource;
