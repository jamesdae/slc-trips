import { GoogleMap, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';

export default function MapMarkers(props) {
  const [clickedMarker, setClickedMarker] = useState(null);
  const [icon, setIcon] = useState(undefined);

  if (props.place) {
    const list = props.place.map((location, index) => {
      return (
        <Marker
          key={index}
          cursor="pointer"
          onClick={() => {
            setClickedMarker(index);
            setIcon(location.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 }));
            // eslint-disable-next-line no-console
            console.log(`${location.name} has photo urls of: ${location.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })}`);
          }}
          icon={index === clickedMarker ? icon : undefined}
          position={location.geometry.location}
          title={location.name}
        />
      );
    });
    return (
      <GoogleMap
        zoom={9}
        center={props.place[0].geometry.location}
        mapContainerClassName="map-container"
      >
        {list}
      </GoogleMap>
    );
  } else {
    return null;
  }

}
