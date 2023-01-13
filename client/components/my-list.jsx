import React from 'react';

export default function MyList(props) {
  if (props.place) {
    const list = props.place.map((location, index) => <li key={index}>{location.name} has category: {location.category}</li>);
    return (
      <div>
        <div>
          {props.place[0] ? `Center location name: ${props.place[0].name}` : 'Loading place details...'}
        </div>
        <ul>{list}</ul>
      </div>
    );
  } else {
    return null;
  }

}
