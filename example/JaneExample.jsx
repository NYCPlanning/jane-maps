import React from 'react';
import { Jane, JaneLayer } from '../dist';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './node_modules/jane-maps/dist/styles.css';

injectTapEventPlugin();

const JaneExample = React.createClass({
  render() {
    const mapInit = {
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
      }
    }

    const sources = [
      {
        id: 'feature',
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -74.00836944580078,
                  40.71213418976525
                ]
              }
            }
          ]
        },
      },
    ];

    const mapLayers = [
      {
        id: 'feature',
        source: 'feature',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': 'steelblue',
          'circle-opacity': 0.7,
        },
      },
    ];


    return (
      <MuiThemeProvider>
        <div style={{
          height: '500px',
          width: '500px',
        }}
        >
          <Jane
            mapInit={mapInit}
            search
            searchConfig={searchConfig}
          >
            <JaneLayer
              id="feature"
              name="Feature"
              icon="university"
              visible
              sources={sources}
              mapLayers={mapLayers}
            />
          </Jane>
        </div>
      </MuiThemeProvider>
    )
  }
})

export default JaneExample;
