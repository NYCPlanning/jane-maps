(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', '../Carto'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('../Carto'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.Carto);
    global.CartoVectorSource = mod.exports;
  }
})(this, function (exports, _react, _Carto) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _Carto2 = _interopRequireDefault(_Carto);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var CartoVectorSource = _react2.default.createClass({
    displayName: 'CartoVectorSource',

    propTypes: {
      map: _react2.default.PropTypes.shape({
        mapObject: _react2.default.PropTypes.object
      }).isRequired,
      source: _react2.default.PropTypes.shape({
        options: _react2.default.PropTypes.object,
        tiles: _react2.default.PropTypes.array,
        id: _react2.default.PropTypes.string
      }).isRequired,
      onLoaded: _react2.default.PropTypes.func.isRequired
    },

    componentWillMount: function componentWillMount() {
      this.map = this.props.map.mapObject;
      // fetch data if necessary, add layer to map
      if (!this.props.source.tiles) {
        this.fetchData(this.props.source.options.sql, this.addSource);
      }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      // compare sql
      if (!(nextProps.source.options.sql === this.props.source.options.sql)) {
        this.fetchData(nextProps.source.options.sql, this.updateSource);
      }
    },
    fetchData: function fetchData(sqlArray, cb) {
      var mapConfig = {
        version: '1.3.0',
        layers: []
      };

      sqlArray.forEach(function (sql) {
        mapConfig.layers.push({
          type: 'mapnik',
          options: {
            cartocss_version: '2.1.1',
            cartocss: '#layer { polygon-fill: #FFF; }',
            sql: sql
          }
        });
      });

      _Carto2.default.getVectorTileTemplate(mapConfig, this.props.source.options).then(function (template) {
        cb(template);
      });
    },
    addSource: function addSource(template) {
      if (this.map.getSource(this.props.source.id)) {
        this.map.removeSource(this.props.source.id);
      }

      this.map.addSource(this.props.source.id, {
        type: 'vector',
        tiles: [template]
      });

      this.props.onLoaded(this.map.getStyle().sources);
    },
    updateSource: function updateSource(template) {
      var newStyle = this.map.getStyle();
      newStyle.sources[this.props.source.id].tiles = [template];
      this.map.setStyle(newStyle);
    },
    render: function render() {
      return null;
    }
  });

  exports.default = CartoVectorSource;
});