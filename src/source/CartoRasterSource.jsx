import React from 'react';

const CartoRasterSource = React.createClass({
  propTypes: {
    map: React.PropTypes.shape({
      mapObject: React.PropTypes.object,
    }).isRequired,
    source: React.PropTypes.shape({
      options: React.PropTypes.object,
      tiles: React.PropTypes.array,
      id: React.PropTypes.string,
      sql: React.PropTypes.string,
    }).isRequired,
    onLoaded: React.PropTypes.func.isRequired,
  },

  componentWillMount() {
    this.map = this.props.map.mapObject;
    // fetch data if necessary, add layer to map
    if (!this.props.source.tiles) {
      this.fetchData(this.props.source.sql);
    }
  },

  componentWillReceiveProps(nextProps) {
    // compare sql

    if (!(nextProps.source.sql === this.props.source.sql)) {
      this.fetchData(nextProps.source.sql);
    }
  },

  fetchData() {
    const { carto_domain, carto_user } = this.props.source.options;

    const mapConfig = {
      version: '1.3.0',
      layers: [{
        type: 'mapnik',
        options: {
          cartocss_version: '2.1.1',
          cartocss: this.props.source.options.cartocss,
          sql: this.props.source.options.sql,
        },
      }],
    };

    $.ajax({ // eslint-disable-line no-undef
      type: 'POST',
      data: JSON.stringify(mapConfig),
      url: `https://${carto_domain}/user/${carto_user}/api/v1/map`,
      dataType: 'text',
      contentType: 'application/json',
      success: (data) => {
        data = JSON.parse(data);
        const layergroupid = data.layergroupid;
        const template = `https://${carto_domain}/user/${carto_user}/api/v1/map/${layergroupid}/{z}/{x}/{y}.png`;
        this.addSource(template);
      },
    });
  },

  addSource(template) {
    if (this.map.getSource(this.props.source.id)) {
      this.map.removeSource(this.props.source.id);
    }

    this.map.addSource(this.props.source.id, {
      type: 'raster',
      tiles: [template],
    });

    this.props.onLoaded(this.map.getStyle().sources);
  },


  render() {
    return null;
  },
});

export default CartoRasterSource;
