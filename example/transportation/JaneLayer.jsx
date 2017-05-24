import React from 'react';
import Component from './Component.jsx';
import config from './config';
import { JaneLayer } from '../../dist';

function transportationJaneLayer() {
  return (
    <JaneLayer
      id="transportation"
      name="Transportation"
      icon="subway"
      component={<Component />}
    />
  )
}


export default transportationJaneLayer;
