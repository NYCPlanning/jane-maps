import React, { PropTypes } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import IconButton from 'material-ui/IconButton';


import ListItem from './ListItem';

// This component keeps track of its own state for the order of the layers to implement drag and drop functionality
// Once an item is dropped, we then pass the new layer order up to Jane to update the main state

const LayerList = React.createClass({
  propTypes: {
    layers: PropTypes.array.isRequired,
    onLayerReorder: PropTypes.func.isRequired,
    expanded: PropTypes.bool.isRequired,
    onLayerClick: PropTypes.func.isRequired,
    selectedLayer: PropTypes.string,
    onToggleExpanded: PropTypes.func.isRequired,
    onLayerToggle: PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      selectedLayer: null,
    };
  },

  getInitialState() {
    return ({
      layers: this.props.layers,
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      layers: nextProps.layers,
    });
  },

  handleDrop() {
    // on drop pass the current state up to Jane
    this.props.onLayerReorder(this.state.layers);
  },

  moveListItem(dragIndex, hoverIndex) {
    const { layers } = this.state;
    const dragLayer = layers[dragIndex];

    this.setState(update(this.state, {
      layers: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragLayer],
        ],
      },
    }));
  },

  render() {
    const { disabledLayers } = this.props;

    const style = {
      fontIcon: {
        fontSize: '15px',
        margin: '7px 10px',
        height: '15px',
        width: '15px',
        color: '#5F5F5F',
        left: 0,
      },
    };

    let layers = this.state.layers.map((layer, i) => {
      const disabled = disabledLayers.indexOf(layer.id) > -1 ? true : false;
      console.log(layer.name, disabled)

      let className = this.props.selectedLayer === layer.id ? 'list-item selected' : 'list-item';
      if (disabled) className += ' disabled';

      if (layer.showInLayerList !== false) {
        return (
          <ListItem
            className={className}
            expanded={this.props.expanded}
            disabled={disabled}
            layer={layer}
            moveListItem={this.moveListItem}
            index={i}
            onDrop={this.handleDrop}
            key={layer.id}
            onClick={this.props.onLayerClick}
            onLayerToggle={this.props.onLayerToggle}
          />
        );
      }

      return null;
    });

    // reverse layers so the list reflects the map (first in array will be bottom on map)
    layers = layers.slice().reverse();

    return (
      <div className={`jane-drawer ${this.props.expanded ? 'expanded' : ''}`}>
        <div className={'jane-drawer-inner'}>
          <div className="drawer-header" >
            Layers
            <IconButton
              style={{
                width: 36,
                height: 36,
                padding: 0,
              }}
              iconClassName={this.props.expanded ? 'fa fa-chevron-left' : 'fa fa-list-ul'}
              iconStyle={style.fontIcon}
              onTouchTap={this.props.onToggleExpanded}
            />
          </div>
          {layers}
        </div>
      </div>
    );
  },
});

export default DragDropContext(HTML5Backend)(LayerList);
