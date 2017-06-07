import React from 'react';
import Component from './Component.jsx';
import { JaneLayer, Source, MapLayer } from '../../dist';
import { sources, mapLayers } from './config';

class TransportationJaneLayer extends React.Component {
  constructor() {
    super();

    this.state = {
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

    this.setState({ checkboxes });
  };

  renderSubways() {
    if (!this.state.checkboxes.subways) {
      return null;
    }

    return [
      <Source id="subway_lines" type="geojson" data={sources.subway_lines.data}/>,
      <Source id="subway_stations" type="geojson" data={sources.subway_stations.data}/>,

      <MapLayer id="subway_stations_labels" source="subway_stations" config={mapLayers.subway_stations_labels}/>,
      <MapLayer id="subway_stations" source="subway_stations" config={mapLayers.subway_stations}/>,
      <MapLayer id="subway_red" source="subway_lines" config={mapLayers.subway_red}/>,
      <MapLayer id="subway_purple" source="subway_lines" config={mapLayers.subway_purple}/>,
      <MapLayer id="subway_blue" source="subway_lines" config={mapLayers.subway_blue}/>,
      <MapLayer id="subway_orange" source="subway_lines" config={mapLayers.subway_orange}/>,
      <MapLayer id="subway_light_green" source="subway_lines" config={mapLayers.subway_light_green}/>,
      <MapLayer id="subway_brown" source="subway_lines" config={mapLayers.subway_brown}/>,
      <MapLayer id="subway_gray" source="subway_lines" config={mapLayers.subway_gray}/>,
      <MapLayer id="subway_yellow" source="subway_lines" config={mapLayers.subway_yellow}/>,
      <MapLayer id="subway_green" source="subway_lines" config={mapLayers.subway_green}/>
    ].map((child, index) => ({ ...child, key: index }));
  }

  renderBusStops() {
    if (!this.state.checkboxes.bus_stops) {
      return null;
    }

    return [
      <Source id="bus_stops" type="cartovector" options={sources.bus_stops.options}/>,
      <MapLayer id="bus_stops" source="bus_stops" config={mapLayers.bus_stops}/>
    ].map((child, index) => ({ ...child, key: index }));
  }

  renderPath() {
    if (!this.state.checkboxes.path) {
      return null;
    }

    return [
      <Source id="path_routes" type="geojson" data={sources.path_routes.data}/>,
      <Source id="path_stops" type="geojson" data={sources.path_stops.data}/>,

      <MapLayer id="path_stops_labels" source="path_stops" config={mapLayers.path_stops_labels}/>,
      <MapLayer id="path_stops" source="path_stops" config={mapLayers.path_stops}/>,
      <MapLayer id="path_routes" source="path_routes" config={mapLayers.path_routes}/>
    ].map((child, index) => ({ ...child, key: index }));
  }

  renderBikeRoutes() {
    if (!this.state.checkboxes.bike_routes) {
      return null;
    }

    return [
      <Source id="bike_routes" type="vector" tiles={sources.bike_routes.tiles}/>,
      <MapLayer id="bike_routes" source="bike_routes" config={mapLayers.bike_routes}/>
    ].map((child, index) => ({ ...child, key: index }));
  }

  render() {
    return (
      <JaneLayer
        id="transportation"
        name="Transportation"
        icon="subway"
        component={<Component checkboxes={this.state.checkboxes} onCheckboxChange={this.onCheckboxChange}/>}>

        { this.renderSubways() }
        { this.renderBusStops() }
        { this.renderPath() }
        { this.renderBikeRoutes() }
      </JaneLayer>
    );
  }
}

export default TransportationJaneLayer;
