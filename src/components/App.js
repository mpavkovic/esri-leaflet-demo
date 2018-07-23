import React from 'react';

import Map from './Map/Map';

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>ESRI Leaflet Map</h1>
        <Map />
      </React.Fragment>
    )
  }
}
