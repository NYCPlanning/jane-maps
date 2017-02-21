(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.CartoRasterSource = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var CartoRasterSource = _react2.default.createClass({
    displayName: 'CartoRasterSource',

    propTypes: {
      map: _react2.default.PropTypes.shape({
        mapObject: _react2.default.PropTypes.object
      }).isRequired,
      source: _react2.default.PropTypes.shape({
        options: _react2.default.PropTypes.object,
        tiles: _react2.default.PropTypes.array,
        id: _react2.default.PropTypes.string,
        sql: _react2.default.PropTypes.string
      }).isRequired,
      onLoaded: _react2.default.PropTypes.func.isRequired
    },

    componentWillMount: function componentWillMount() {
      this.map = this.props.map.mapObject;
      // fetch data if necessary, add layer to map
      if (!this.props.source.tiles) {
        this.fetchData(this.props.source.sql);
      }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      // compare sql

      if (!(nextProps.source.sql === this.props.source.sql)) {
        this.fetchData(nextProps.source.sql);
      }
    },
    fetchData: function fetchData() {
      var _this = this;

      var _props$source$options = this.props.source.options,
          carto_domain = _props$source$options.carto_domain,
          carto_user = _props$source$options.carto_user;


      var mapConfig = {
        version: '1.3.0',
        layers: [{
          type: 'mapnik',
          options: {
            cartocss_version: '2.1.1',
            cartocss: this.props.source.options.cartocss,
            sql: this.props.source.options.sql
          }
        }]
      };

      $.ajax({ // eslint-disable-line no-undef
        type: 'POST',
        data: JSON.stringify(mapConfig),
        url: 'https://' + carto_domain + '/user/' + carto_user + '/api/v1/map',
        dataType: 'text',
        contentType: 'application/json',
        success: function success(data) {
          data = JSON.parse(data);
          var layergroupid = data.layergroupid;
          var template = 'https://' + carto_domain + '/user/' + carto_user + '/api/v1/map/' + layergroupid + '/{z}/{x}/{y}.png';
          _this.addSource(template);
        }
      });
    },
    addSource: function addSource(template) {
      if (this.map.getSource(this.props.source.id)) {
        this.map.removeSource(this.props.source.id);
      }

      this.map.addSource(this.props.source.id, {
        type: 'raster',
        tiles: [template]
      });

      this.props.onLoaded(this.map.getStyle().sources);
    },
    render: function render() {
      return null;
    }
  });

  exports.default = CartoRasterSource;
});