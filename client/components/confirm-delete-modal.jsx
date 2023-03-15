import React from 'react';

export default function ConfirmDeleteModal({ route, accessToken, locationIds, routeName, mappedIds, homeRoutes, setHomeRoutes, setPrevList, setViewingIds }) {

  function handleDelete() {
    fetch(`/api/routes/${route.routeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': accessToken
      }
    })
      .then(res => res.json())
      .then(deletedRoute => {
        const remainingRoutes = homeRoutes.filter(route => route.routeId !== deletedRoute.routeId);
        setHomeRoutes(remainingRoutes);
        setViewingIds(false);
        setPrevList(false);
      })
      .catch(err => console.error('Error:', err));
  }

  return (
    <div className="modal fade" id={`confirmDeleteModal-${route.routeId}`} tabIndex="-1" aria-labelledby="editingModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Changes</h5>
              <i aria-hidden="true" type="button" className="close fa-solid fa-xmark" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this route?</p>
              <div className='m-2'>
                <h6 className='card-title my-0 mx-2'>{routeName}</h6>
                <div className="card-group d-flex flex-row">
                  {
                    locationIds.map((id, index) => {
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
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-bs-target={`#editingModal-${route.routeId}`} data-bs-toggle="modal">Back</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
