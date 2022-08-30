const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiY2xhdWRpdWZwb3BhIiwiYSI6ImNsNzZ3eXg0bTAxaXEzcG4zOHM1bW9kZm0ifQ.EDBVn6feuf1gQSlLaScirQ';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-118.113491, 34.111745],
  zoom: 9, // starting zoom
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  // new mapboxgl.Popup({
  //   offset: 30,
  // })
  //   .setLngLat(loc.coordinates)
  //   .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
  //   .addTo(map);
  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
