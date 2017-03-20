# Jane Maps

A framework for rich, composable web maps using React and MapboxGL  

![facilities_explorer_and_developer_tools_-_http___localhost_8080__and_developer_tools_-_https___staging_capitalplanning_nyc_facilities_explorer](https://cloud.githubusercontent.com/assets/1833820/23576517/c9619900-0075-11e7-8836-ab6d7515cd16.png)

## What's it all about?

Jane Maps is the frontend mapping framework used in [DCP's Capital Planning Platform](http://capitalplanning.nyc.gov).  It's more than just a React wrapper for mapboxgl.js, and includes several UI components that complement the map, allowing for modular layer configurations that include map data, styling, and their associated UI.

We only recently extracted Jane Maps from its original home within the Capital Planning Platform, as we see great potential in its reusability in other parts of NYC government and beyond. 

Making Jane Maps more generic and extensible is going to take a community effort, and we hope you will be a part of that community.  Please create issues and communicate with us if you have ideas to improve the package or are having trouble getting it to work in your project. 

## Who is Jane?
Jane Maps is named for [Jane Jacobs](https://en.wikipedia.org/wiki/Jane_Jacobs), and we hope it helps to provide a new way of looking at cities and neighborhoods, just as she did.


## Simple Usage

Install via npm:
`npm install jane-maps`


Include the top-level component `Jane` and `JaneLayer`, and include the css
```
import Jane from 'jane-maps';
import JaneLayer from 'jane-maps/dist/jane-layer';

import 'jane-maps/dist/styles.css'
```

Use Jane and JaneLayer to compose a map
```
// define arrays of mapboxgl sources and layers to be passed in to `<JaneLayer/>` as props

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

// Use `<Jane/>` to instantiate a map, and `<JaneLayer/>` as a child of `<Jane/>` to define a simple layer

    <Jane
      mapInit={{
        mapbox_accessToken: 'youraccesstoken',
        center: [-74.0084, 40.7121],
        zoom: 13.62,
      }}
    />
      <JaneLayer 
        id="feature"
        name="Feature"
        icon="university"
        visible="true"
        sources={sources}
        mapLayers={mapLayers}
      />
    </Jane>
```

## Material UI Extra Steps

Jane Maps makes use of Material UI.  If you don't have Material UI in your project, you'll need to take some additional steps to make sure it's set up properly for Jane Maps.  See the examples for more information on these requirements.

### injectTapEventPlugin
This is a react plugin that material ui uses to make sure tap and click events are handled properly.  Somewhere in your app you'll need to include the plugin and call it.
```
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
```

### MUI Theme

All components using Material UI must be wrapped in a `<MuiThemeProvider>` component which provides sitewide styles for Material UI components.  

# Jane Components

## `Jane`

`Jane` is the top-level component, and is used to create a MapboxGL map with optional UI components

### Props

`mapInit` - object - configuration options used to instantiate the map 

```
{
  mapbox_accessToken: '',
  center: [-74.0084, 40.7121],
  zoom: 13.62,
  minZoom: 9,
  maxZoom: null,
  pitch: 0,
  hash: false,
  navigationControlPosition: 'bottom-right',
}
```

`search` - boolean - if true, a Mapzen autocomplete search bar will appear in the top left corner of the map

`searchConfig` - object - configuration options for the Mapzen autocomplete search

```
{
  mapzen_api_key: 'mapzen-ZyMEp5H',
  bounds: {
    minLon: -74.292297,
    maxLon: -73.618011,
    minLat: 40.477248,
    maxLat: 40.958123,
  }
}
```

## `JaneLayer`

A JaneLayer is a discrete set of related map sources, symbologies and UIs.  Each JaneLayer gets a spot in Jane's built-in layer selector, and can be composed in several different ways. JaneLayers can act as controllers for many separate layers on the map, and can have no UI (meaning Jane can toggle visibility only) or custom UI (a custom component passed in as a prop)

### Props

`id` - string - every JaneLayer must have a unique id

`name` - string - this is the name used for display purposes in the UI

`icon` - string - the font-awesome icon for the JaneLayer.  This should be the part of the font-awesome class after the hypen, so use `'university'` for the icon `fa-university` 

`visible` - boolean - if true, the JaneLayer will be visible on the map (and toggled on in the UI) by default

`selected` - boolean - Jane's layer selector allows for only a single JaneLayer's UI to be visible at a time.  If true, this JaneLayer will be selected by default.  Only one JaneLayer should have `selected=true` when instantiating a new Jane map.

`sources` - array - An array of Jane Sources.  These translate directly into mapboxGL sources, but Jane includes some custom source types that provide extra handling of data before adding the source to the map. (such as a Carto maps API handshake) See `sources` below.

`mapLayers` - array - An array of mapboxGL layer objects.  These are no different that those used in mapboxGL's api.  See `mapLayers` below.

`component` - react component - This is the primary UI for the JaneLayer.  The result of its `render` function will be placed in Jane's drawer when the JaneLayer is selected and visible. This component is also passed an `onUpdate` prop when it is instantiated, allowing for dynamic updating of the JaneLayer's `sources` and `mapLayers`

`initialState` - object - Initial state object passed into the JaneLayer's `component`. This is useful for configuring filters elsewhere in a project, and composing the JaneLayer with a custom state

`interactivityMapLayers` - array (string) - An array of `mapLayer` ids eligible for actions on click.  If a mapLayer's id is in this array, on click that mapLayer's associated feature will be added to Jane's `selectedFeatures` state and can trigger interactivity.

`highlightPointMapLayers` - array (string) - An array of point-based mapLayers that will be highlighted using Jane's default point highlighting when one of their elements is clicked.

`listItem` - react component - a component that will be rendered in the selectedFeaturesPane for each selectedFeature after the user clicks.

## `sources`

Sources in Jane are configuration objects that eventually become mapboxGL sources.

Source types include:

* vector
```
{
  id: 'my-source',
  type: 'vector',
  tiles: ['some-tile-url'],
}
```
* raster
```
{
  id: 'my-source',
  type: 'raster',
  tiles: ['some-tile-url'],
}
```
* geoJson
```
{
  id: 'my-source',
  type: 'geojson',
  data: ['some-tile-url'],
}
```
* cartovector - creates a mapboxGL vector source from a Carto Maps API
```
{
  id: 'my-source',
  type: 'cartovector',
  options: {
    carto_user: 'user',
    carto_domain: 'domain',
    sql: 'SELECT * FROM tablename'
  },
}
```
* cartoraster - creates a mapboxGL raster source from a Carto Maps API
```
{
  id: 'my-source',
  type: 'cartorector',
  options: {
    carto_user: 'user',
    carto_domain: 'domain',
    sql: 'SELECT * FROM tablename'
    cartocss: '#tablename { fill-color: #fff; ...'
  },
}
```


## `mapLayers`

MapLayers define styling in mapboxGL, and are identical to those defined in the mapboxGL api.

```
{
  id: 'facilities-points-outline',
  source: 'facilities',
  'source-layer': 'layer0',
  type: 'circle',
  paint: {
    'circle-radius': {
      stops: [
        [10, 3],
        [15, 7],
      ],
    },
    'circle-color': '#012700',
    'circle-opacity': 0.7,
  },
},
```

## A Dream

Someday in the not too distant future, JaneLayers could be packaged with data, styles, and UI, and exist in an open registry.  Adding a complex layer to your project could be as simple as running `jane install nyc-admin-boundaries`.  A dev can dream...

## Development
`npm watch` will transpile from `/src` into `/dist`, and will also convert the `styles.scss` to `css`.  

To use a local development repo of jane-maps in another project, use `npm link`.  From this directory, run `npm link jane-maps`.  Navigate to the directory for the project that is using jane-maps, and run `npm link jane-maps`.  Run `npm watch` in this directory, and if you have webpack dev server listening in your other project directory it should pick up the changes and rebuild.

## License
This project is licensed under the terms of the
[MIT license](https://github.com/nycplanning/jane-maps/blob/master/LICENSE)
