import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import _ from 'underscore';

class Legend extends React.Component {

  static contextTypes = {
    addLegend: PropTypes.func,
    removeLegend: PropTypes.func,
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    children: null,
  };

  componentDidMount() {
    this.context.addLegend(this.props.children);
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.children, nextProps.children);
  }

  componentWillUnmount() {
    this.context.removeLegend(this.props.children);
  }

  render() {
    return null;
  }
}

export default Legend;
