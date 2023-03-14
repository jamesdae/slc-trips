import React, { useState, useRef } from 'react';

export default function EditForm({ setRouteName, route, accessToken, routeName }) {
  const newNameRef = useRef(null);
  const [routeNameValid, setRouteNameValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  function handleInputChange() {
    const checkRouteName = newNameRef.current.value.trim();
    setRouteNameValid(checkRouteName.length > 0);
  }

  return (
    <div className="cool modal fade" id={`editingModal-${route.routeId}`} tabIndex="-1" aria-labelledby="editingModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Route: {routeName}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <form className="row g-3" onSubmit={event => {
              event.preventDefault();
              event.stopPropagation();
              const form = event.currentTarget;
              if (form.checkValidity() === false) {
                return null;
              } else {
                setRouteNameValid(true);
                const newRouteName = newNameRef.current.value;
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
                  .then(() => {
                    setRouteName(newRouteName);
                    newNameRef.current.value = '';
                    setRouteNameValid(false);
                  })
                  .catch(err => console.error('Error:', err));
              }
            }}>
              <div>
                <label htmlFor="validationCustomUsername" className="form-label">Enter New Route Name:</label>
                <div className="input-group has-validation">
                  <input type="text" className={`form-control ${(!routeNameValid && isTouched) ? 'is-invalid' : ''} ${routeNameValid ? 'is-valid' : ''}`} id="validationCustomUsername" required={true} ref={newNameRef} onBlur={() => setIsTouched(false)} onChange={handleInputChange} autoComplete="off" onClick={() => setIsTouched(true)} />
                  <div className="invalid-feedback">
                    Route name is required.
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-danger" data-bs-target={`#confirmDeleteModal-${route.routeId}`} data-bs-toggle="modal" data-bs-dismiss="modal">Delete Route</button>
                <button type="submit" className="btn btn-primary" disabled={!routeNameValid} data-bs-dismiss="modal">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
