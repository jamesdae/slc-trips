import React from 'react';

export default function getIconsAndDetails(location) {
  let categoryValue = 'fa-solid';
  switch (location.category) {
    case 'Parks & Attractions':
      categoryValue += ' fa-camera-retro';
      break;
    case 'Lakes':
      categoryValue += ' fa-sailboat';
      break;
    case 'Snow Activities':
      categoryValue += ' fa-snowflake';
      break;
    case 'Hiking':
      categoryValue += ' fa-person-hiking';
      break;
    case 'Restaurants':
      categoryValue += ' fa-utensils';
      break;
    default:
      categoryValue += ' fa-snowwflake';
  }

  return (
    <div>
      <div className="icon d-flex justify-content-center">
        <i className={categoryValue} title={location.name} />
      </div>
      <div className="details">
        <p className='small-text mb-1'>{location.name}</p>
        <p className="grey small-text mb-1">{location.category}</p>
        <div className='marker-photo'>
          <img className="marker-image" src={location.photos[0].getUrl()} />
        </div>
      </div>
    </div>
  );
}
