import React from 'react';

export default function DirectionsPanel({ setPrevList, setViewingIds, mappedIds, viewingIds }) {
  return (
    <div className="offcanvas offcanvas-start" data-bs-backdrop="false" tabIndex="-1" id="offcanvasDirections" aria-labelledby="offcanvasHeader">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasHeader">Route Options</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
      </div>
      <div className="offcanvas-body">
        <div id='panel' />
        <div className="dropdown mt-3">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            More Options
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" data-bs-dismiss="offcanvas" aria-label="Close">Save Route</a></li>
            <li><a className="dropdown-item" href="#" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => {
              setPrevList();
              setViewingIds();
            }}>Clear Pins</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}