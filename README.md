# Jane Maps

A framework for rich, composable web maps using React and MapboxGL  

![facilities_explorer_and_developer_tools_-_http___localhost_8080__and_developer_tools_-_https___staging_capitalplanning_nyc_facilities_explorer](https://cloud.githubusercontent.com/assets/1833820/23576517/c9619900-0075-11e7-8836-ab6d7515cd16.png)

## What is Jane?

Jane Maps is a react component for building modular, multi-layer web maps with complex UIs

It is the frontend mapping framework used in [DCP's Capital Planning Platform](http://capitalplanning.nyc.gov).  It's more than just a React wrapper for mapboxgl.js, and includes several UI components that complement the map, allowing for modular layer configurations that include map data, styling, and their associated UI.

## Jane is Young

We only recently extracted Jane Maps from its original home within the Capital Planning Platform, as we see great potential in its reusability in other parts of NYC government and beyond.

Making Jane Maps more generic and extensible is going to take a community effort, and we hope you will be a part of that community.  Please create issues and communicate with us if you have ideas to improve the package or are having trouble getting it to work in your project.

## Who is Jane?
Jane Maps is named for [Jane Jacobs](https://en.wikipedia.org/wiki/Jane_Jacobs), and we hope it helps to provide a new way of looking at cities and neighborhoods, just as she did.

## Simple Usage

Install via npm:
`npm install jane-maps`

Include the top-level component `Jane` and `JaneLayer`, and include the css
```
import {  Jane, JaneLayer, Source, MapLayer } from 'jane-maps';

import 'jane-maps/dist/styles.css'
```

Use `Jane`, `JaneLayer`, `Source`, and `MapLayer` to compose a map
```
<Jane
  mapboxGLOptions={
    mapbox_accessToken: 'youraccesstoken',
    center: [-74.0084, 40.7121],
    zoom: 13.62,
    minZoom: 9,
    maxZoom: null,
    pitch: 0,
    hash: false,
    navigationControlPosition: 'bottom-right',
  }
  search
  searchConfig={searchConfig}
>
  <JaneLayer
    id="feature"
    name="Feature"
    icon="university"
    defaultSelected
    component={<div> This is a simple feature </div>}
  >

    <Source id="feature" type="geojson" data={featureSource} />

    <MapLayer
      id="feature"
      source="feature"
      type="circle"
      paint={{
        'circle-radius': 10,
        'circle-color': 'steelblue',
        'circle-opacity': 0.7,
      }}
    />

  </JaneLayer>
</Jane>


```

## Material UI

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

`Jane` is the top-level component, and is used to create a MapboxGL map and manage JaneLayers.  Jane's built-in drawer allows the user to select which JaneLayer to interact with, toggle visibility of JaneLayers, etc.

### Props

`mapboxGLOptions` - object - configuration options used to instantiate the map

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

`poiFeature` - geoJson object with geometry of type point - Point of Interest Feature, Jane will show a marker icon at this location.

`poiLabel` - string - This string will be displayed to the right of the `poiFeature` marker

`layerContentVisible` - boolean - if true, the JaneLayer content drawer will be initially open

`onZoomEnd` - function - Handler for the mapboxGL map's `zoomend` event
`onDragEnd` - function - Handler for the mapboxGL map's `dragend` event

`initialSelectedJaneLayer` - string - the id of the JaneLayer that should be initially selected.

`initialDisabledJaneLayers` - array of strings - ids of the JaneLayers that should be disabled (switched off) initially


## `JaneLayer`

JaneLayers are passed in to Jane as children, and include a Component prop that handles local state, map updates, and UI.  JaneLayers are where updates to the

### Props

`id` - string - every JaneLayer must have a unique id

`name` - string - this is the name used for display purposes in the UI

`icon` - string - the font-awesome icon for the JaneLayer.  This should be the part of the font-awesome class after the hyphen, so use `'university'` for the icon `fa-university`

`component` - React Component - the Component which will render in Jane's drawer.  The component also calls `onUpdate` to pass new map configurations up to Jane

`onMapLayerClick(features)` - function - A function to handle click events on the JaneLayer's rendered features.  `features` is a de-duped array of features that were under the click.

## mapConfig objects

Jane-maps doesn't allow you to explicitly define mapboxGL sources and layers to render on the map. Instead, it expects the Component associated with each JaneLayer to pass a mapConfig object whenever there is a change to what should be displayed.

Behind the scenes, Jane keeps track of the mapConfigs for each of the JaneLayers, including what order they should be rendered in, whether they should be visible, etc.

A mapConfig object includes three main properties:  `sources`, `mapLayers`, and `legend`

const mapConfig = {
  sources: [],
  mapLayers: [],
  legend: <SomeContent />
}

### `sources`

`sources` is an array of `source` objects, see below for the various source types and what other properties they require.

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


### `mapLayers`

`mapLayers` is an array of mapboxGL `layer` objects.  Each should use a source that is defined in `sources` for this JaneLayer.

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

Someday in the not too distant future, JaneLayers could be packaged with data, styles, and UI, and exist as npm packages.  Adding a complex janeLayer to your project could be as simple as running `npm install jane-nyc-admin-boundaries`.  A dev can dream...

## Development
`npm watch` will transpile from `/src` into `/dist`, and will also convert the `styles.scss` to `css`.  

To use a local development repo of jane-maps in another project, use `npm link`.  From this directory, run `npm link jane-maps`.  Navigate to the directory for the project that is using jane-maps, and run `npm link jane-maps`.  Run `npm watch` in this directory, and if you have webpack dev server listening in your other project directory it should pick up the changes and rebuild.

## License
This project is licensed under the terms of the
[MIT license](https://github.com/nycplanning/jane-maps/blob/master/LICENSE)
