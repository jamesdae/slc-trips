import React from 'react';

export default function ConfirmDeleteModal({ setRouteName, route, accessToken, locationIds }) {

  return (
    <div className="modal fade" id={`confirmDeleteModal-${route.routeId}`} tabIndex="-1" aria-labelledby="editingModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Confirm Changes</h5>
              <i aria-hidden="true" type="button" className="close fa-solid fa-xmark" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete route: &quot;{route.routeName}&quot;?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => {
                // eslint-disable-next-line no-console
                console.log(route.routeId);
              }}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
