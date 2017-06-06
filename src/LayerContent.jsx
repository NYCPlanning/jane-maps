import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import cx from 'classnames';

class LayerContent extends React.Component {
  render() {
    const { offset, visible, selectedLayer, onClose, children } = this.props;

    return (
      <div className={cx('second-drawer', { offset })}
           style={{ transform: visible ? 'translate(0px, 0px)' : 'translate(-320px, 0px)' }}>
        { React.Children.map(children, (child) => React.cloneElement(child, { selectedLayer, onClose })) }
      </div>
    );
  }
}

LayerContent.propTypes = {
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
