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

  componentDidMount() {
    if (!this.props.hidden) {
      this.context.registerLayer(this.props.id, this.props);
    }
  }

  componentWillUnmount() {
    if (!this.props.hidden) {
      this.context.unregisterLayer(this.props.id);
    }
  }

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
          const modifiedLayer = loadedSources[child.props.source]
            ? React.cloneElement(child, { janeLayer: this.props.id, map, previousMapLayer })
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

        { SidebarComponent }
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
  children: PropTypes.array,
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
