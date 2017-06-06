import React from 'react';
import Component from './Component.jsx';
import { JaneLayer, Source } from '../../dist';
import config, { sources } from './config';

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
        component={<Component checkboxes={this.state.checkboxes} onCheckboxChange={this.onCheckboxChange}/>}>

        {
          this.state.checkboxes.subways &&
          <span>
            <Source id="subway_lines" type="geojson" data={sources.subway_lines.data}/>
            <Source id="subway_stations" type="geojson" data={sources.subway_stations.data}/>
          </span>
        }

        {
          this.state.checkboxes.bus_stops &&
          <Source id="bus_stops" type="cartovector" options={sources.bus_stops.options}/>
        }

        {
          this.state.checkboxes.path &&
          <span>
            <Source id="path_routes" type="geojson" data={sources.path_routes.data}/>
            <Source id="path_stops" type="geojson" data={sources.path_stops.data}/>
          </span>
        }

        {
          this.state.checkboxes.bike_routes &&
          <Source id="bike_routes" type="vector" tiles={sources.bike_routes.tiles}/>
        }

      </JaneLayer>
    );
  }
}

export default TransportationJaneLayer;
