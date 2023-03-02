import React, { useState } from 'react';

export default function EditForm({ setRouteName, route, accessToken }) {
  const [routeNameValid, setRouteNameValid] = useState(true);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="modal fade" id={`editingModal-${route.routeId}`} tabIndex="-1" aria-labelledby="editingModalLabel" aria-hidden="true" data-bs-backdrop={routeNameValid ? true : 'static'}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Route: {route.routeName}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <form className="row g-3 needs-validation" noValidate onSubmit={event => {
              event.preventDefault();
              event.stopPropagation();
              const form = event.currentTarget;
              if (form.checkValidity() === false) {
                return null;
              } else {
                setRouteNameValid(true);
                const newRouteName = inputValue;
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
                    setInputValue('');
                  })
                  .catch(err => console.error('Error:', err));
              }
            }}>
              <div>
                <label htmlFor="validationCustomUsername" className="form-label">Route Name</label>
                <div className="input-group has-validation">
                  <input type="text" className={`form-control ${routeNameValid ? '' : 'is-invalid'}`} id="validationCustomUsername" required={true} value={inputValue} onChange={event => setInputValue(event.target.value)} autoComplete="off"/>
                  <div className="invalid-feedback">
                    Route name is required.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                {inputValue.trim().length > 0
                  ? (
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                    )
                  : (
                    <button type="button" className="btn btn-primary" onClick={() => setRouteNameValid(false)}>Save changes</button>
                    )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
