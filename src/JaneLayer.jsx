import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

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
  closeIcon: {
    width: 36,
    height: 36,
    padding: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  closeIconMaterial: {
    fontSize: '15px',
    margin: '8px',
    height: '15px',
    width: '15px',
    float: 'right',
    color: '#5F5F5F',
  },
  blockerStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    mouseEvents: 'none',
    position: 'absolute',
    top: 0,
    height: 2000,
    left: 0,
    right: 0,
    paddingTop: 35,
    zIndex: 1000000,
  },
};

class JaneLayer extends React.Component {

  static contextTypes = {
    registerLayer: PropTypes.func,
    unregisterLayer: PropTypes.func,
    loadedSources: PropTypes.object,
    selectedLayer: PropTypes.string,
    onSourceLoaded: PropTypes.func,
    getJaneLayer: PropTypes.func,
    onLayerClose: PropTypes.func,
    map: PropTypes.object,
  };

  constructor() {
    super();

    this.redrawCallbacks = [];
  }

  componentDidMount() {
    if (!this.props.hidden) {
      this.context.registerLayer(this.props.id, this.props, this.redrawChildren);
    }
  }

  componentWillUnmount() {
    if (!this.props.hidden) {
      this.context.unregisterLayer(this.props.id);
    }
  }

  registerRedrawCallback = (redrawMapLayerCallback) =>
    this.redrawCallbacks.push(redrawMapLayerCallback);

  redrawChildren = () => {
    const janeLayer = this.context.getJaneLayer(this.props.id);

    if (janeLayer && !janeLayer.disabled) {
      this.redrawCallbacks.forEach(cb => cb());
    }
  };

  renderChildren() {
    const { map, loadedSources, onSourceLoaded, getJaneLayer } = this.context;
    const janeLayer = getJaneLayer(this.props.id);

    if (!map || (janeLayer && janeLayer.disabled)) {
      return null;
    }

    let previousMapLayer = null;

    return React.Children.map(this.props.children, (child) => {
      if (!child || !child.type) {
        return child;
      }

      switch (child.type.name) {
        case 'MapLayer': // eslint-disable-line
          const mapLayerProps = {
            janeLayerId: this.props.id,
            registerRedrawCallback: this.registerRedrawCallback,
            map,
            previousMapLayer
          };

          const modifiedLayer = loadedSources[child.props.source]
            ? React.cloneElement(child, mapLayerProps)
            : null;

          previousMapLayer = child.props.id;

          return modifiedLayer;

        case 'Source':
          return React.cloneElement(child, { map, onSourceLoaded });

        case 'Marker':
          return React.cloneElement(child, { map });

        default:
          return child;
      }
    });
  }

  render() {
    const SidebarComponent = this.props.component;
    const janeLayer = this.context.getJaneLayer(this.props.id);

    return (
      <div style={{ display: this.props.id === this.context.selectedLayer ? 'inline' : 'none' }}>
        <div className="drawer-header">
          <FontIcon className={`fa fa-${this.props.icon}`} style={style.fontIcon} />
          {this.props.name}
          <IconButton
            iconClassName={'fa fa-times'}
            style={style.closeIcon}
            iconStyle={style.closeIconMaterial}
            onTouchTap={this.context.onLayerClose}
          />
        </div>

        <div style={{ position: 'relative', height: '100%' }}>
          { janeLayer && janeLayer.disabled && <div style={style.blockerStyle} /> }
          { SidebarComponent }
        </div>

        { this.renderChildren() }
      </div>
    );
  }
}

JaneLayer.propTypes = {
  id: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  name: PropTypes.string,
  icon: PropTypes.string,
  component: PropTypes.object,
  children: PropTypes.any,
};

JaneLayer.defaultProps = {
  defaultDisabled: false,
  hidden: false,
  name: null,
  icon: null,
  component: null,
  children: null,
};

export default JaneLayer;
