import React from 'react';

export default function getIconsAndDetails(location) {
  let categoryValue = 'fa-solid';
  switch (location.category) {
    case 'Parks':
      categoryValue += ' fa-tree';
      break;
    case 'Water Activities':
      categoryValue += ' fa-sailboat';
      break;
    case 'Snow Activities':
      categoryValue += ' fa-snowflake';
      break;
    case 'Hiking':
      categoryValue += ' fa-mountain-sun';
      break;
    case 'Viewpoints':
      categoryValue += ' fa-binoculars';
      break;
    default:
      categoryValue += ' fa-tree';
  }

  return (
    <div>
      <div className="icon d-flex justify-content-center">
        <i className={categoryValue} title={location.name} />
      </div>
      <div className="details">
        <p className='smalltext mb-1'>{location.name}</p>
        <p className="grey smalltext mb-1">{location.category}</p>
        <div className='photo'>
          <img className="markerimg" src={location.photos[0].getUrl()} />
        </div>
      </div>
    </div>
  );
}
