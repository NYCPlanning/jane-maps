import React from 'react';

const SelectedFeauturesPane = props => (
  <div className="jane-selected-features" style={props.style}>
    {props.children}
  </div>
);

SelectedFeauturesPane.propTypes = {
  children: React.PropTypes.array.isRequired,
  style: React.PropTypes.shape().isRequired,
};

export default SelectedFeauturesPane;
