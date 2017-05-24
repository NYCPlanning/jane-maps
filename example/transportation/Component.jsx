import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import { Tabs, Tab } from 'material-ui/Tabs';
import config from './config';

class UIComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeCheckboxes: ['subways'],
    };
  }

  handleCheck(id) {
    const { activeCheckboxes } = this.state
    const i = activeCheckboxes.indexOf(id);

    if (i > -1) {
      activeCheckboxes.splice(i, 1);
    } else {
      activeCheckboxes.push(id);
    }

    this.setState({ activeCheckboxes });
  }

  // build mapConfig based on state, pass it up to Jane
  updateMapConfig() {
    const { activeCheckboxes } = this.state;
    const sources = [];
    const mapLayers = [];

    activeCheckboxes.forEach((id) => {
      config[id].sources.forEach((source) => {
        sources.push(source);
      });

      config[id].mapLayers.forEach((mapLayer) => {
        mapLayers.push(mapLayer);
      });
    });

    const mapConfig = { sources, mapLayers };
    this.props.onMapConfigUpdate()
  }

  render() {
    this.updateMapConfig();

    const listItemStyle = {
      marginTop: '14px',
    };

    const listHeaderStyle = {
      marginBottom: '4px',
    };


    return (
      <div>
        <Tabs className="sidebar-tabs">
          <Tab label="Data">
            <div className="sidebar-tab-content">
              <div className="padded">
                <h4>Transportation Layers</h4>

                <Checkbox
                  label="Subways"
                  checked={this.state.activeCheckboxes.includes('subways')}
                  onCheck={this.handleCheck.bind(this, 'subways')}
                />
                <Checkbox
                  label="Bus Stops"
                  checked={this.state.activeCheckboxes.includes('bus_stops')}
                  onCheck={this.handleCheck.bind(this, 'bus_stops')}
                />
                {/* <Checkbox
                  label="Bus Routes"
                  checked={this.state.activeCheckboxes.includes('bus_routes')}
                  onCheck={this.handleCheck.bind(this, 'bus_routes')}
                /> */}
                <Checkbox
                  label="PATH"
                  checked={this.state.activeCheckboxes.includes('path')}
                  onCheck={this.handleCheck.bind(this, 'path')}
                />
                <Checkbox
                  label="Bike Routes"
                  checked={this.state.activeCheckboxes.includes('bike_routes')}
                  onCheck={this.handleCheck.bind(this, 'bike_routes')}
                />
              </div>
            </div>
          </Tab>
          <Tab label="About">
            <div className="sidebar-tab-content">
              <div className="padded">
                <h4>Transportation Layers</h4>
                <p>Sources for these data layers are as follows:</p>
                <ul style={{ listStyleType: 'none', paddingLeft: '10px' }}>
                  <li style={listItemStyle}>
                    <h6 style={listHeaderStyle}>Subways</h6>
                    <p>Provided by the DoITT GIS Team, available on their <a href="https://nycdoittpublicdata.carto.com/u/nycpublicdata/">public carto server</a>.</p>
                  </li>
                  <li style={listItemStyle}>
                    <h6 style={listHeaderStyle}>Bus Stops, PATH</h6>
                    <p>Baruch College CUNY, <a href="https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers">Newman Library GIS Lab</a></p>
                  </li>
                  <li style={listItemStyle}>
                    <h6 style={listHeaderStyle}>Bike Routes</h6>
                    <p>Via <a href="https://data.cityofnewyork.us/Transportation/Bike-Routes/umu5-zyd3">NYC Open Data</a></p>
                  </li>
                </ul>
                <p />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default UIComponent;
