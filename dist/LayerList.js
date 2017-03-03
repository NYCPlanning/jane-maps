(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react/lib/update', 'react-dnd', 'react-dnd-html5-backend', 'material-ui/IconButton', './ListItem'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react/lib/update'), require('react-dnd'), require('react-dnd-html5-backend'), require('material-ui/IconButton'), require('./ListItem'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.update, global.reactDnd, global.reactDndHtml5Backend, global.IconButton, global.ListItem);
    global.LayerList = mod.exports;
  }
})(this, function (exports, _react, _update, _reactDnd, _reactDndHtml5Backend, _IconButton, _ListItem) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _update2 = _interopRequireDefault(_update);

  var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

  var _IconButton2 = _interopRequireDefault(_IconButton);

  var _ListItem2 = _interopRequireDefault(_ListItem);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // This component keeps track of its own state for the order of the layers to implement drag and drop functionality
  // Once an item is dropped, we then pass the new layer order up to Jane to update the main state

  var LayerList = _react2.default.createClass({
    displayName: 'LayerList',

    propTypes: {
      layers: _react.PropTypes.array.isRequired,
      onLayerReorder: _react.PropTypes.func.isRequired,
      expanded: _react.PropTypes.bool.isRequired,
      onLayerClick: _react.PropTypes.func.isRequired,
      selectedLayer: _react.PropTypes.string,
      onToggleExpanded: _react.PropTypes.func.isRequired,
      onLayerToggle: _react.PropTypes.func.isRequired
    },

    getDefaultProps: function getDefaultProps() {
      return {
        selectedLayer: null
      };
    },
    getInitialState: function getInitialState() {
      return {
        layers: this.props.layers
      };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.setState({
        layers: nextProps.layers
      });
    },
    handleDrop: function handleDrop() {
      // on drop pass the current state up to Jane
      this.props.onLayerReorder(this.state.layers);
    },
    moveListItem: function moveListItem(dragIndex, hoverIndex) {
      var layers = this.state.layers;

      var dragLayer = layers[dragIndex];

      this.setState((0, _update2.default)(this.state, {
        layers: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragLayer]]
        }
      }));
    },
    render: function render() {
      var _this = this;

      var style = {
        fontIcon: {
          fontSize: '15px',
          margin: '7px 10px',
          height: '15px',
          width: '15px',
          color: '#5F5F5F',
          left: 0
        }
      };

      var layers = this.state.layers.map(function (layer, i) {
        var className = _this.props.selectedLayer === layer.id ? 'list-item selected' : 'list-item';
        if (!layer.visible) className += ' disabled';

        if (layer.showInLayerList !== false) {
          return _react2.default.createElement(_ListItem2.default, {
            className: className,
            expanded: _this.props.expanded,
            layer: layer,
            moveListItem: _this.moveListItem,
            index: i,
            onDrop: _this.handleDrop,
            key: layer.id,
            onClick: _this.props.onLayerClick,
            onLayerToggle: _this.props.onLayerToggle
          });
        }

        return null;
      });

      // reverse layers so the list reflects the map (first in array will be bottom on map)
      layers = layers.slice().reverse();

      return _react2.default.createElement(
        'div',
        { className: 'jane-drawer ' + (this.props.expanded ? 'expanded' : '') },
        _react2.default.createElement(
          'div',
          { className: 'jane-drawer-inner' },
          _react2.default.createElement(
            'div',
            { className: 'drawer-header' },
            'Layers',
            _react2.default.createElement(_IconButton2.default, {
              style: {
                width: 36,
                height: 36,
                padding: 0
              },
              iconClassName: this.props.expanded ? 'fa fa-chevron-left' : 'fa fa-list-ul',
              iconStyle: style.fontIcon,
              onTouchTap: this.props.onToggleExpanded
            })
          ),
          layers
        )
      );
    }
  });

  exports.default = (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default)(LayerList);
});