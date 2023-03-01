import React, { useRef } from 'react';

export default function SavedRoutes({ route, locationIds, mappedIds, accessToken }) {
  const newRouteNameRef = useRef(null);

  return (
    <div className='m-2' key={route.routeId}>
      <p className='my-0 mx-2'>{route.routeName}<i className="mx-2 fa-solid fa-pen-to-square pointer" data-bs-toggle="modal" data-bs-target="#editingModal" /></p>
      <div className="card-group d-flex flex-row">
        {
          locationIds[0].map((id, index) => {
            const eachId = mappedIds.find(location => location.locationId === id);
            return (
              <div className="card routecard" key={index}>
                <img src={eachId.photos[0].getUrl()} className="card-img-top detailimage" alt="..." />
                <div className="card-body">
                  <h6 className="card-title">{eachId.name}</h6>
                  <p className="card-text"><small className="text-muted">{eachId.category}</small></p>
                </div>
              </div>
            );
          })
        }
      </div>
      <div className="modal fade" id="editingModal" tabIndex="-1" aria-labelledby="editingModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Route: {route.routeName}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="new-route-name" className="col-form-label">New Route Name:</label>
                  <input type="text" className="form-control" id="new-route-name" ref={newRouteNameRef} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {
                const newRouteName = newRouteNameRef.current.value;
                const request = {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Token': accessToken
                  },
                  body: JSON.stringify({ routeId: route.routeId, newRouteName })
                };
                fetch('/api/routes', request)
                  .then(res => res.json())
                  .then(resultz => {
                    // eslint-disable-next-line no-console
                    console.log('resultz', resultz);
                  })
                  .catch(err => console.error('Error:', err));
              }}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
