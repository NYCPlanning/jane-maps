import React from 'react';
import Component from './Component.jsx';
import { JaneLayer } from '../../dist';
import config from './config';

class TransportationJaneLayer extends React.Component {
  constructor() {
    super();

    this.state = {
      mapConfig: config.filter((sublayer) => sublayer.id === 'subways'),
      checkboxes: {
        subways: true,
        bus_stops: false,
        path: false,
        bike_routes: false
      },
    };

    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onCheckboxChange(name) {
    const checkboxes = {
      ...this.state.checkboxes,
      [name]: !this.state.checkboxes[name]
    };

    const mapConfig = config.filter((sublayer) => checkboxes[sublayer.id]);

    this.setState({ mapConfig, checkboxes });
  };

  render() {
    return (
      <JaneLayer
        id="transportation"
        name="Transportation"
        icon="subway"
        selectedLayer={this.props.selectedLayer}
        onClose={this.props.onClose}
        mapConfig={this.state.mapConfig}
        component={<Component checkboxes={this.state.checkboxes} onCheckboxChange={this.onCheckboxChange}/>}
      />
    );
  }
}

export default TransportationJaneLayer;
