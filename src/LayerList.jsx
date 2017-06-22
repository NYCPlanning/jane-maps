import React from 'react';
import PropTypes from 'prop-types';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import IconButton from 'material-ui/IconButton';
import _ from 'underscore';
import cx from 'classnames';

const style = {
  fontIcon: {
    fontSize: '15px',
    margin: '7px 10px',
    height: '15px',
    width: '15px',
    color: '#5F5F5F',
    left: 0,
  },
  drawerIcon: {
    width: 36,
    height: 36,
    padding: 0,
  }
};

import ListItem from './ListItem';

// This component keeps track of its own state for the order of the layers to implement drag and drop functionality
// Once an item is dropped, we then pass the new layer order up to Jane to update the main state

class LayerList extends React.Component {

  static displayName = 'LayerList';
  _displayName = 'LayerList';

  constructor(props) {
    super(props);

    this.state = {
      layers: this.props.layers,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) ||
           !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ layers: nextProps.layers });
  }

  handleDrop = () => {
    // on drop pass the current state up to Jane
    this.props.onLayerReorder(this.state.layers);
  };

  moveListItem = (dragIndex, hoverIndex) => {
    const dragLayer = this.state.layers[dragIndex];

    this.setState(update(this.state, {
      layers: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragLayer],
        ],
      },
    }));
  };

  render() {
    const drawerClassName = cx('jane-drawer', { expanded: this.props.expanded });
    const drawerIconClassName = cx('fa', this.props.expanded ? 'fa-chevron-left' : 'fa-list-ul');

    const layers = this.state.layers
      // reverse layers so the list reflects the map (first in array will be bottom on map)
      .map((layer, i) => {
        const className = cx('list-item', {
          selected: this.props.selectedLayer === layer.id,
          disabled: layer.disabled,
        });

        return (
          <ListItem
            className={className}
            expanded={this.props.expanded}
            disabled={layer.disabled}
            layer={layer}
            moveListItem={this.moveListItem}
            index={i}
            onDrop={this.handleDrop}
            key={layer.id}
            onClick={this.props.onLayerSelect}
            toggleLayer={this.props.toggleLayer}
          />
        );
      });

    return (
      <div className={drawerClassName}>
        <div className="jane-drawer-inner">
          <div className="drawer-header">
            Layers
            <IconButton
              style={style.drawerIcon}
              iconClassName={drawerIconClassName}
              iconStyle={style.fontIcon}
              onTouchTap={this.props.toggleList}
            />
          </div>
          { layers.slice().reverse() }
        </div>
      </div>
    );
  }
}

LayerList.propTypes = {
  layers: PropTypes.array.isRequired,
  onLayerReorder: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  onLayerSelect: PropTypes.func.isRequired,
  selectedLayer: PropTypes.string,
  toggleList: PropTypes.func.isRequired,
  toggleLayer: PropTypes.func.isRequired,
};

LayerList.defaultProps = {
  selectedLayer: null,
};

export default DragDropContext(HTML5Backend)(LayerList);
