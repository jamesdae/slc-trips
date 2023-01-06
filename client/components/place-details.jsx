import React from 'react';

export default function PlaceDetails(props) {
  if (props.place) {
    // eslint-disable-next-line no-console
    console.log('Place Details are loading, renders Center location name. here is place:', props.place);
    const list = props.place.map((location, index) => <li key={index}>{location.name} has placeId: {location.place_id}</li>);
    return (
      <div>
        <div>
          {props.place[0] ? `Center location name: ${props.place[0].name} Coordinates: ${props.place[0].geometry.location.lat()}, ${props.place[0].geometry.location.lng()}` : 'Loading place details...'}
        </div>
        <ul>{list}</ul>
      </div>
    );
  } else {
    return null;
  }

}
