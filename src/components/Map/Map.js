import React from 'react';

require('leaflet');
const esri = require('esri-leaflet');
import { Map, TileLayer } from 'react-leaflet';
import hexRgb from 'hex-rgb';

export default class ExampleMap extends React.Component {
  mapRef = React.createRef();

  state = {
    lat: 41.8500300,
    lng: -87.6500500,
    zoom: 10,
    featureLayer: esri.featureLayer({
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Census_Populated_Places/FeatureServer/0/',
    }),
  };

  renderFeatureLayer = () => {
    const { featureLayer } = this.state;

    const map = this.mapRef.current.leafletElement;
    const bounds = map.getBounds();

    const gradient = [ hexRgb('#f2ef65'), hexRgb('#aef265') ];

    featureLayer.query().within(bounds).run(function(error, featureCollection, response) {
      const minMaxPop = featureCollection.features.reduce((range, feature) => {
        if (range.min === null || (feature.properties.POP2012 < range.min)) {
          range.min = feature.properties.POP2012;
        }
        if (feature.properties.POP2012 > range.max) {
          range.max = feature.properties.POP2012;
        }

        return range;
      }, { min: null, max: 0 });

      featureLayer.setStyle(function(feature) {
        let p = (feature.properties.POP2012 - minMaxPop.min) / (minMaxPop.max - minMaxPop.min);
        if (p > 1) {
          p = 1;
        }

        const red = Math.ceil(gradient[0].red * p + gradient[1].red * (1 - p));
        const green = Math.ceil(gradient[0].green * p + gradient[1].green * (1 - p));
        const blue = Math.ceil(gradient[0].blue * p + gradient[1].blue * (1 - p));

        //const fillColor = `#${Number.parseInt(red, 16).toString().padStart(2, '0')}${Number.parseInt(green, 16).toString().padStart(2, '0')}${Number.parseInt(blue, 16).toString().padStart(2, '0')}`;
        const fillColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

        //console.log(p, red, green, blue, fillColor);

        const baseStyle = {
          color: '#999',
          weight: 0.5,
          opacity: 0.9,
          fill: true,
          fillColor: '#ffffe0',
          fillOpacity: 0.5,
        };

        return {
          ...baseStyle,
          fillColor,
        };
      });

      console.log('done');
    });
  }

  componentDidMount() {
    const { featureLayer } = this.state;

    featureLayer.addTo(this.mapRef.current.leafletElement);
    this.renderFeatureLayer();
  }


  render() {
    const { lat, lng, zoom } = this.state;
    const position = [ lat, lng ];

    return (
      <div style={{ height: '600px' }}>
        <Map ref={this.mapRef} center={position} zoom={zoom} style={{ height: '100%', width: '100%' }} onMoveend={this.renderFeatureLayer}>
          {/*<TileLayer
            attribution="&copy; <a href=&quot;http://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> &copy; <a href=&quot;http://cartodb.com/attributions&quot;>CartoDB</a>"
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
          />*/}
          <TileLayer
            attribution="<a href=&quot;https://wikimediafoundation.org/wiki/Maps_Terms_of_Use&quot;>Wikimedia</a>"
            url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png"
          />
        </Map>
      </div>
    );
  }
}
