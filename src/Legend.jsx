import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import _ from 'underscore';

class Legend extends React.Component {

  static displayName = 'Legend';

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
    this.legend = this.props.children;

    this.context.addLegend(this.legend);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.children, nextProps.children)) {
      this.context.removeLegend(this.legend);

      this.legend = nextProps.children;

      this.context.addLegend(this.legend);
    }
  }

  componentWillUnmount() {
    this.context.removeLegend(this.legend);
  }

  render() {
    return null;
  }
}

export default Legend;
