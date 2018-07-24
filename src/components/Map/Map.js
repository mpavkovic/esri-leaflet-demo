import React from 'react';

require('leaflet');
const esriLeafletWebmap = require('esri-leaflet-webmap');
const esri = require('esri-leaflet');
L.esri = esri;
import { Map } from 'react-leaflet';


export default class ExampleMap extends React.Component {
  mapRef = React.createRef();

  state = {
    mapId: ARCGIS_MAP_ID,
    lat: 41.8500300,
    lng: -87.6500500,
    zoom: 10,
    token: null,
  };

  componentDidMount() {
    const { mapId } = this.state;
    const map = this.mapRef.current.leafletElement;

    esri.post('https://www.arcgis.com/sharing/rest/generateToken', {
      username: ARCGIS_USER,
      password: ARCGIS_PASSWORD,
      f: 'json',
      expiration: 86400,
      client: 'referer',
      referer: window.location.origin,
    }, function(error, response) {
      if(!error) {
        const webmap = esriLeafletWebmap.webMap(mapId, { map, token: response.token });

        webmap.on('load', function() {
          const overlayMaps = {};
          webmap.layers.map(function(l) {
            l.layer.on('authenticationrequired', (e) => e.authenticate(response.token));
            overlayMaps[l.title] = l.layer;
          });

          L.control.layers({}, overlayMaps, {
            position: 'topright'
          }).addTo(webmap._map);
        });
      } else {
        console.error(error);
      }
    });
  }

  render() {
    const { lat, lng, zoom } = this.state;
    const position = [ lat, lng ];

    return (
      <React.Fragment>
        <div>
          <button type="button" onClick={() => this.handleToggleLayer('USA_Demographics_and_Boundaries_2018_7499')}>Pop. Growth</button>
        </div>
        <div style={{ height: '600px' }}>
          <Map ref={this.mapRef} center={position} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          </Map>
        </div>
      </React.Fragment>
    );
  }
}
