import React from 'react';
import EachCard from './each-card';

export default function ExtraDetails({ place, viewingIds, setExtraDetailsOpen, setViewingIds, extraDetailsOpen, prevList }) {
  return (
    <div>
      <div className='p-2'>
        <button className="btn btn-secondary" type="button"
          onClick={event => {
            setExtraDetailsOpen(!extraDetailsOpen);
            setViewingIds(prevList);
          }}>
          <i className="fa-solid fa-arrow-left mx-1"/>
          <p className='d-inline'>Back</p>
        </button>
      </div>
      {
        place.map((location, index) => {
          if (viewingIds !== null && location.locationId === viewingIds[0]) {
            return <EachCard location={location} key={index} tab="extradetails" />;
          } else {
            return null;
          }
        })
      }
    </div>
  );
}
