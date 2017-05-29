import React from 'react';
import PropTypes from 'prop-types';

const JaneLayer = () => <div />;

JaneLayer.displayName = 'JaneLayer';

JaneLayer.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  component: PropTypes.object.isRequired,
  onMapLayerClick: PropTypes.func,
};

JaneLayer.defaultProps = {
  onMapLayerClick: () => {},
};

export default JaneLayer;
