(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-dom', 'react-dnd', 'material-ui/FontIcon', 'material-ui/Toggle', 'react-bootstrap'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-dom'), require('react-dnd'), require('material-ui/FontIcon'), require('material-ui/Toggle'), require('react-bootstrap'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactDom, global.reactDnd, global.FontIcon, global.Toggle, global.reactBootstrap);
    global.ListItem = mod.exports;
  }
})(this, function (exports, _react, _reactDom, _reactDnd, _FontIcon, _Toggle, _reactBootstrap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _FontIcon2 = _interopRequireDefault(_FontIcon);

  var _Toggle2 = _interopRequireDefault(_Toggle);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var listItemSource = {
    beginDrag: function beginDrag(props) {
      return {
        id: props.layer.id,
        index: props.index
      };
    }
  };

  var listItemTarget = {
    hover: function hover(props, monitor, component) {
      var dragIndex = monitor.getItem().index;
      var hoverIndex = props.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      var hoverBoundingRect = (0, _reactDom.findDOMNode)(component).getBoundingClientRect(); // eslint-disable-line react/no-find-dom-node

      // Get vertical middle
      var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      var clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      var hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      props.moveListItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    },
    drop: function drop(props) {
      props.onDrop();
    }
  };

  var ListItem = _react2.default.createClass({
    displayName: 'ListItem',


    propTypes: {
      connectDragSource: _react.PropTypes.func.isRequired,
      connectDropTarget: _react.PropTypes.func.isRequired,
      layer: _react.PropTypes.object.isRequired,
      onClick: _react.PropTypes.func.isRequired,
      className: _react.PropTypes.string.isRequired,
      expanded: _react.PropTypes.bool.isRequired,
      onLayerToggle: _react.PropTypes.func.isRequired
    },

    handleClick: function handleClick(layer, e) {
      if (e.target.type !== 'checkbox') this.props.onClick(layer.id);
    },
    handleToggle: function handleToggle(layerid) {
      this.props.onLayerToggle(layerid);
    },
    render: function render() {
      var style = {
        fontIcon: {
          fontSize: '15px',
          margin: '8px 9px 8px 9px',
          height: '15px',
          width: '15px',
          color: '#5F5F5F',
          left: 0,
          textAlign: 'center'
        },
        track: {
          backgroundColor: '#9c9c9c'
        },
        thumbSwitched: {
          backgroundColor: '#d96b27'
        },
        trackSwitched: {
          backgroundColor: 'rgba(217, 107, 39, 0.48)'
        }
      };

      var _props = this.props,
          connectDragSource = _props.connectDragSource,
          connectDropTarget = _props.connectDropTarget,
          layer = _props.layer;


      return connectDragSource(connectDropTarget(_react2.default.createElement(
        'div',
        { className: this.props.className, onClick: this.handleClick.bind(this, layer) },
        _react2.default.createElement(
          'div',
          { className: 'toggle-container' },
          _react2.default.createElement(_Toggle2.default, {
            trackStyle: style.track,
            thumbSwitchedStyle: style.thumbSwitched,
            trackSwitchedStyle: style.trackSwitched,
            toggled: layer.visible,
            onToggle: this.handleToggle.bind(this, layer.id)
          })
        ),
        _react2.default.createElement(
          'span',
          { className: 'name' },
          layer.name
        ),
        !this.props.expanded && _react2.default.createElement(
          _reactBootstrap.OverlayTrigger,
          {
            placement: 'right',
            overlay: _react2.default.createElement(
              _reactBootstrap.Tooltip,
              { id: layer.name },
              layer.name
            ),
            delayShow: 500
          },
          _react2.default.createElement(_FontIcon2.default, { className: 'fa fa-' + layer.icon, style: style.fontIcon })
        ),
        this.props.expanded && _react2.default.createElement(_FontIcon2.default, { className: 'fa fa-' + layer.icon, style: style.fontIcon })
      )));
    }
  });

  ListItem = (0, _reactDnd.DragSource)('listItem', listItemSource, function (connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  })(ListItem);

  ListItem = (0, _reactDnd.DropTarget)('listItem', listItemTarget, function (connect) {
    return {
      connectDropTarget: connect.dropTarget()
    };
  })(ListItem);

  var exportListItem = ListItem;
  exports.default = exportListItem;
});