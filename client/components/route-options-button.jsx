import React from 'react';

export default function RouteOptionsButton({ viewingIds, mappedIds }) {
  if (!Array.isArray(viewingIds) || !viewingIds.length > 1 || !mappedIds) return;
  const coordinates = viewingIds.map(id => {
    const pinnedIndex = mappedIds.findIndex(place => place.locationId === id);
    if (pinnedIndex >= 0) {
      return `${mappedIds[pinnedIndex].geometry.location.lat()}, ${mappedIds[pinnedIndex].geometry.location.lng()}`;
    } else {
      return null;
    }
  });
  const waypoints = coordinates.slice(1, -1).map(coord => ({ location: coord }));
  const daddr = coordinates[coordinates.length - 1];
  const origin = coordinates[0];

  const link = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${daddr}&waypoints=${waypoints.map(waypoint => waypoint.location).join('|')}`;

  if (viewingIds !== null && viewingIds.length > 1) {
    return (
      <div className='d-flex'>
        <div className="btn-group flex-fill" role="group" aria-label="Basic example">
          <button className="btn btn-outline-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDirections" aria-controls="offcanvasDirections">Directions</button>
          <button className="btn btn-outline-primary" data-bs-target="#offcanvasExample" data-bs-toggle="offcanvas"><i className="fa-solid fa-road-circle-check listicon" />Save Route</button>
          <a className="btn btn-outline-primary" href={link} target="_blank" rel="noopener noreferrer" aria-label="Close"><i className="fa-brands fa-google listicon" />Open route in Google Maps </a>
        </div>
      </div>
    );
  }
}
