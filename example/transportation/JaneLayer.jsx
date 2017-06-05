import React from 'react';
import Component from './Component.jsx';
import { JaneLayer } from '../../dist';
import config from './config';

class TransportationJaneLayer extends React.Component {
  constructor() {
    super();

    this.state = {
      mapConfig: config.filter((sublayer) => sublayer === 'subways'),
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
    this.setState({
      mapConfig: config.filter((sublayer) => !this.state.checkboxes[sublayer.id]),
      checkboxes: {
        ...this.state.checkboxes,
        [name]: !this.state.checkboxes[name]
      }
    });
  };

  render() {
    return (
      <JaneLayer
        id="transportation"
        name="Transportation"
        icon="subway"
        selectedLayer={this.props.selectedLayer}
        mapConfig={this.state.mapConfig}
        component={<Component checkboxes={this.state.checkboxes} onCheckboxChange={this.onCheckboxChange}/>}
      />
    );
  }
}

export default TransportationJaneLayer;
