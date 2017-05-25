import React from 'react';

const sources = [
  {
    id: 'feature',
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [
              -74.0083,
              40.7121,
            ],
          },
        },
      ],
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

class DummyComponent extends React.Component {
  componentDidUpdate() {
    this.props.onUpdate({
      sources,
      mapLayers,
    });
  }

  render() {
    return (
      <div>Dummy Layer</div>
    );
  }
}

export default DummyComponent
