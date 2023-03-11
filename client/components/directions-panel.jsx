import React from 'react';

export default function DirectionsPanel({ setPrevList, setViewingIds, mappedIds, viewingIds, addedLocations, homeRoutes, setHomeRoutes }) {

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

  return (
    <div className="offcanvas offcanvas-start" data-bs-backdrop="false" tabIndex="-1" id="offcanvasDirections" aria-labelledby="offcanvasHeader">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasHeader">Route Options</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
      </div>
      <div className="offcanvas-body">
        <div id='panel' />
        <div className="dropdown mt-3">
          <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            More Options
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#offcanvasExample" aria-label="Close" data-bs-toggle="offcanvas"><i className="fa-solid fa-road-circle-check listicon" />Save Route</a></li>
            <li><a className="dropdown-item" href="#" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => {
              setPrevList();
              setViewingIds();
            }}><i className="fa-solid fa-trash-can listicon" />Clear Pins</a></li>
            {Array.isArray(viewingIds) && viewingIds.length > 1
              ? (
                <li><a className="dropdown-item" href={link} target="_blank" rel="noopener noreferrer" aria-label="Close"><i className="fa-brands fa-google listicon" />Open route in Google Maps </a></li>
                )
              : (
                  null
                )
            }
          </ul>
        </div>
      </div>
    </div>
  );
}
