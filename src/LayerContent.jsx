import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

class LayerContent extends React.Component {

  handleToggle(layerid) {
    this.props.onLayerToggle(layerid);
  }

  render() {
    const { layers, selectedLayer } = this.props;

    const style = {
      fontIcon: {
        fontSize: '18px',
        margin: '8px',
        height: '18px',
        width: '18px',
        color: '#5F5F5F',
        left: 0,
      },
      toggle: {
        position: 'absolute',
        display: 'initial',
        width: 'auto',
        right: '28px',
        top: '7px',
      },
    };

    // if the layer has a component, mount it
    const content = layers.map(layer => (
      <div
        style={{
          display: layer.props.id === selectedLayer ? 'inline' : 'none',
        }}
        key={layer.props.id}
      >
        <div className="drawer-header" >
          <FontIcon className={`fa fa-${layer.props.icon}`} style={style.fontIcon} />
          {layer.props.name}
          <IconButton
            iconClassName={'fa fa-times'}
            style={{
              width: 36,
              height: 36,
              padding: 0,
              position: 'absolute',
              right: 0,
              top: 0,
            }}
            iconStyle={{
              fontSize: '15px',
              margin: '8px',
              height: '15px',
              width: '15px',
              float: 'right',
              color: '#5F5F5F',
            }}
            onTouchTap={this.props.onClose}
          />
        </div>

        {
          React.cloneElement(layer.props.component, {
            onUpdate: this.props.onLayerUpdate.bind(null, layer.props.id),
          })
        }
      </div>
    ));

    return ( // render() return
      <div
        className={`second-drawer ${this.props.offset ? 'offset' : ''}`}
        style={{
          transform: this.props.visible ? 'translate(0px, 0px)' : 'translate(-320px, 0px)',
        }}
      >
        {content}
      </div>
    );
  }
}

LayerContent.propTypes = {
  onLayerToggle: PropTypes.func.isRequired,
  onLayerUpdate: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  selectedLayer: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  offset: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
};

LayerContent.defaultProps = {
  selectedLayer: null,
};

export default LayerContent;
