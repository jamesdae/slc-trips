import React from 'react';
import titleCase from './titleCase';

export default function buildContent(location) { // this component builds the icon and details for each location in one JSX div element
  // return a different version of the original return div but for each category
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
      <div className="icon flex">
        <i aria-hidden="true" className={categoryValue} title={location.name} />
      </div>
      <div className="details">
        <div className="price">{location.name}</div>
        <div className="address">{titleCase(location.types[0])}</div>
        <div className="address">{location.category}</div>
        <div className='photo'>
          <img className="img" src={location.photos[0].getUrl()} />
        </div>
      </div>
    </div>
  );
}
