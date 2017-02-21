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
    global.GeoJsonSource = mod.exports;
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

  var GeoJsonSource = _react2.default.createClass({
    displayName: 'GeoJsonSource',

    propTypes: {
      map: _react2.default.PropTypes.object.isRequired,
      source: _react2.default.PropTypes.object.isRequired,
      onLoaded: _react2.default.PropTypes.func.isRequired
    },

    componentWillMount: function componentWillMount() {
      this.map = this.props.map.mapObject;
      // fetch data if necessary, add layer to map
      if (!this.props.source.data) {
        this.fetchData();
      } else {
        this.data = this.props.source.data;
        this.addSource();
      }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      // compare sql
      if (!(nextProps.source.data === this.props.source.data)) {
        this.data = nextProps.source.data;
        this.map.getSource(this.props.source.id).setData(this.data);
      }
    },
    fetchData: function fetchData() {
      var self = this;

      $.getJSON(this.props.source.source) // eslint-disable-line no-undef
      .then(function (data) {
        self.data = data;
        self.addSource();
      });
    },
    addSource: function addSource() {
      this.map.addSource(this.props.source.id, {
        type: 'geojson',
        data: this.data
      });

      this.props.onLoaded(this.map.getStyle().sources);
    },
    render: function render() {
      return null;
    }
  }); // source prop should have 'data' property with geoJSON, or 'source' property with URL to geojson

  exports.default = GeoJsonSource;
});