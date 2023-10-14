import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox GL CSS
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'; // Import Mapbox GL Directions CSS

mapboxgl.accessToken = 'pk.eyJ1Ijoic2F1Z2F0ZGFoYWwiLCJhIjoiY2xteXVudWdlMDd6ZTJrbGtuMGZ2cmFwMyJ9.S30faEt9FaAaYZUgQlbLqw';

const Map = () => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/saugatdahal/cln4tzpa303af01r4cc7n7egz',
      center: [85.3240, 27.7172],
      zoom: 10
    });

    map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken
      }),
      'top-left'
    );

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.GeolocateControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
    </div>
  );
};

export default Map;
