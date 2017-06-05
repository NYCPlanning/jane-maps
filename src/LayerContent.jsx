import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';

class LayerContent extends React.Component {

  handleToggle(layerid) {
    this.props.onLayerToggle(layerid);
  }

  render() {
    return (
      <div
        className={`second-drawer ${this.props.offset ? 'offset' : ''}`}
        style={{
          transform: this.props.visible ? 'translate(0px, 0px)' : 'translate(-320px, 0px)',
        }}
      >
        {
          React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            selectedLayer: this.props.selectedLayer
          }))
        }
      </div>
    );
  }
}

LayerContent.propTypes = {
  onLayerToggle: PropTypes.func.isRequired,
  onLayerUpdate: PropTypes.func.isRequired,
  selectedLayer: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  offset: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
};

LayerContent.defaultProps = {
  selectedLayer: null,
};

export default LayerContent;
