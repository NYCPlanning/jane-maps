import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import { Tabs, Tab } from 'material-ui/Tabs';

const UIComponent = (props) => {
  const listItemStyle = { marginTop: '14px' };
  const listHeaderStyle = { marginBottom: '4px' };

  return (
    <div>
      <Tabs className="sidebar-tabs">
        <Tab label="Data">
          <div className="sidebar-tab-content">
            <div style={{ padding: '15px' }}>
              <h4>Transportation Layers</h4>

              <Checkbox
                label="Subways"
                checked={props.checkboxes.subways}
                onCheck={() => this.props.onCheckboxChange('subways')}
              />
              <Checkbox
                label="Bus Stops"
                checked={props.checkboxes.bus_stops}
                onCheck={() => props.onCheckboxChange('bus_stops')}
              />
              {/* <Checkbox
                label="Bus Routes"
                checked={this.props.checkboxes.bus_routes}
                onCheck={() => this.props.onCheckboxChange('bus_routes')}
              /> */}
              <Checkbox
                label="PATH"
                checked={props.checkboxes.path}
                onCheck={() => props.onCheckboxChange('path')}
              />
              <Checkbox
                label="Bike Routes"
                checked={props.checkboxes.bike_routes}
                onCheck={() => props.onCheckboxChange('bike_routes')}
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
  );
};

export default UIComponent;
