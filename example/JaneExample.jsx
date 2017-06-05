import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Jane, JaneLayer } from '../dist';

import TransportationJaneLayer from './transportation/JaneLayer';
import DummyComponent from './DummyComponent';

import './node_modules/jane-maps/dist/styles.css';

injectTapEventPlugin();

const JaneExample = () => {
  const mapboxGLOptions = {
    mapbox_accessToken: 'pk.eyJ1IjoiY3dob25nbnljIiwiYSI6ImNpczF1MXdrdjA4MXcycXA4ZGtyN2x5YXIifQ.3HGyME8tBs6BnljzUVIt4Q',
    center: [-74.0084, 40.7121],
    zoom: 13.62,
    minZoom: 9,
    maxZoom: null,
    pitch: 0,
    hash: false,
    navigationControlPosition: 'bottom-right',
  };

  const searchConfig = {
    mapzen_api_key: 'mapzen-ZyMEp5H',
    bounds: {
      minLon: -74.292297,
      maxLon: -73.618011,
      minLat: 40.477248,
      maxLat: 40.958123,
    },
  };

  return (
    <MuiThemeProvider>
      <div
        style={{
          height: '500px',
          width: '500px',
        }}
      >
        <Jane
          mapboxGLOptions={mapboxGLOptions}
          search
          searchConfig={searchConfig}
          layerContentVisible
          initialSelectedJaneLayer={'transportation'}
        >
          <JaneLayer
            id="feature"
            name="Feature"
            icon="university"
            component={<DummyComponent />}
          />
          { TransportationJaneLayer() }
        </Jane>
      </div>
    </MuiThemeProvider>
  );
};

export default JaneExample;
