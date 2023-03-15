import React from 'react';

export default function DirectionsPanel({ setPrevList, setViewingIds, viewingIds, link }) {

  return (
    <div className="offcanvas offcanvas-start" data-bs-backdrop="false" tabIndex="-1" id="offcanvasDirections" aria-labelledby="offcanvasHeader">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasHeader">Directions</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
      </div>
      <div className="offcanvas-body">
        <div id='panel' />
        <div className="dropdown mt-3">
          <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            More Options
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#saveRouteCanvas" aria-label="Close" data-bs-toggle="offcanvas"><i className="fa-solid fa-road-circle-check listicon" />Save Route</a></li>
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
