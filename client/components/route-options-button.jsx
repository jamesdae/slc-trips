import React from 'react';

export default function RouteOptionsButton({ viewingIds, mappedIds, link }) {
  if (viewingIds !== null && viewingIds.length > 1) {
    return (
      <div className='d-flex'>
        <div className="btn-group flex-fill" role="group" aria-label="Group of route option buttons">
          <button className="btn btn-outline-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDirections" aria-controls="offcanvasDirections"><i className="fa-solid fa-diamond-turn-right list-icon" />Directions</button>
          <button className="btn btn-outline-primary" data-bs-target="#saveRouteCanvas" data-bs-toggle="offcanvas"><i className="fa-solid fa-road-circle-check list-icon" />Save Route</button>
          <a className="btn btn-outline-primary" href={link} target="_blank" rel="noopener noreferrer" aria-label="Close"><i className="fa-brands fa-google list-icon" />Open route in Google Maps </a>
        </div>
      </div>
    );
  }
}
