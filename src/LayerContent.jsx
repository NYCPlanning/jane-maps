import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const LayerContent = React.createClass({
  propTypes: {
    onLayerToggle: React.PropTypes.func.isRequired,
    layers: React.PropTypes.array.isRequired,
    selectedLayer: React.PropTypes.string,
    onClose: React.PropTypes.func.isRequired,
    onLayerUpdate: React.PropTypes.func.isRequired,
    context: React.PropTypes.object,
    offset: React.PropTypes.bool.isRequired,
    visible: React.PropTypes.bool.isRequired,
  },

  getDefaultProps() {
    console.log(this.props);
    return {
      context: null,
      selectedLayer: null,
    };
  },

  handleToggle(layerid) {
    this.props.onLayerToggle(layerid);
  },

  render() {
    console.log(this.props)
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
    const components = layers.map((layer) => {
      const LayerComponent = layer.component;

      return (
        <div
          style={{
            display: layer.id === selectedLayer ? 'inline' : 'none',
          }}
          key={layer.id}
        >
          <div className="drawer-header" >
            <FontIcon className={`fa fa-${layer.icon}`} style={style.fontIcon} />
            {layer.name}
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
              layer.component && (
                <LayerComponent
                  layer={layer}
                  onUpdate={this.props.onLayerUpdate}
                  context={this.props.context}
                />
              )
            }

          {
              !layer.component && (
                <div className="sidebar-tab-content">
                  <h4>{layer.name}</h4>
                  <p>You can show and hide this layer using the toggle above </p>
                </div>
              )
            }
        </div>
      );
    });

    return (
      <div
        className={`second-drawer ${this.props.offset ? 'offset' : ''}`}
        style={{
          transform: this.props.visible ? 'translate(0px, 0px)' : 'translate(-320px, 0px)',
        }}
      >
        {components}
      </div>
    );
  },
});

export default LayerContent;
