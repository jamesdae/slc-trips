import React from 'react';

export default function DirectionsModal({ viewingIds }) {
  if (viewingIds !== null && viewingIds.length > 1) {
    return (
      <div className='p-2'>
        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDirections" aria-controls="offcanvasDirections">Route Details</button>
      </div>
    );
  }
}
