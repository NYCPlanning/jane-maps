(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'material-ui/FontIcon', 'material-ui/IconButton'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('material-ui/FontIcon'), require('material-ui/IconButton'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.FontIcon, global.IconButton);
    global.LayerContent = mod.exports;
  }
})(this, function (exports, _react, _FontIcon, _IconButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _FontIcon2 = _interopRequireDefault(_FontIcon);

  var _IconButton2 = _interopRequireDefault(_IconButton);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // eslint-disable-line
  var LayerContent = _react2.default.createClass({
    displayName: 'LayerContent',

    propTypes: {
      onLayerToggle: _react2.default.PropTypes.func.isRequired,
      layers: _react2.default.PropTypes.array.isRequired,
      selectedLayer: _react2.default.PropTypes.string,
      onClose: _react2.default.PropTypes.func.isRequired,
      offset: _react2.default.PropTypes.bool.isRequired,
      visible: _react2.default.PropTypes.bool.isRequired
    },

    getDefaultProps: function getDefaultProps() {
      return {
        selectedLayer: null
      };
    },
    handleToggle: function handleToggle(layerid) {
      this.props.onLayerToggle(layerid);
    },
    render: function render() {
      var _this = this;

      var _props = this.props,
          layers = _props.layers,
          selectedLayer = _props.selectedLayer;


      var style = {
        fontIcon: {
          fontSize: '18px',
          margin: '8px',
          height: '18px',
          width: '18px',
          color: '#5F5F5F',
          left: 0
        },
        toggle: {
          position: 'absolute',
          display: 'initial',
          width: 'auto',
          right: '28px',
          top: '7px'
        }
      };

      // if the layer has a component, mount it
      var components = layers.map(function (layer) {
        return _react2.default.createElement(
          'div',
          {
            style: {
              display: layer.id === selectedLayer ? 'inline' : 'none'
            },
            key: layer.id
          },
          _react2.default.createElement(
            'div',
            { className: 'drawer-header' },
            _react2.default.createElement(_FontIcon2.default, { className: 'fa fa-' + layer.icon, style: style.fontIcon }),
            layer.name,
            _react2.default.createElement(_IconButton2.default, {
              iconClassName: 'fa fa-times',
              style: {
                width: 36,
                height: 36,
                padding: 0,
                position: 'absolute',
                right: 0,
                top: 0
              },
              iconStyle: {
                fontSize: '15px',
                margin: '8px',
                height: '15px',
                width: '15px',
                float: 'right',
                color: '#5F5F5F'
              },
              onTouchTap: _this.props.onClose
            })
          ),
          layer.children,
          !layer.children && _react2.default.createElement(
            'div',
            { className: 'second-drawer-content' },
            _react2.default.createElement(
              'h4',
              null,
              'This layer has no content'
            )
          )
        );
      });

      return (// render() return
        _react2.default.createElement(
          'div',
          {
            className: 'second-drawer ' + (this.props.offset ? 'offset' : ''),
            style: {
              transform: this.props.visible ? 'translate(0px, 0px)' : 'translate(-320px, 0px)'
            }
          },
          components
        )
      );
    }
  });

  exports.default = LayerContent;
});