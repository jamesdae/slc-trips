import React from 'react';

export default function DirectionsModal({ viewingIds }) {
  if (viewingIds !== null && viewingIds.length > 1) {
    return (
      <div className='px-2'>
        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">Route Details</button>
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasExampleLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasExampleLabel">Route Options</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
          </div>
          <div className="offcanvas-body">
            <div id='panel' />
            <div className="dropdown mt-3">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                More Options
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Save Route</a></li>
                <li><a className="dropdown-item" href="#">Clear Pins</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
