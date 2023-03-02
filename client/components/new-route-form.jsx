import React, { useRef, useState } from 'react';

export default function NewRouteForm({ accessToken, viewingIds, homeRoutes, setHomeRoutes, setPrevList, setViewingIds }) {
  const routeNameRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  function handleInputChange() {
    const checkRouteName = routeNameRef.current.value.trim();
    setIsValid(checkRouteName.length > 0);
  }

  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasExampleLabel">Save Route?</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
      </div>
      <div className="offcanvas-body">
        <div>
          <form autoComplete="off">
            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">Custom Route Name</label>
              <input type="text" className={`form-control ${(!isValid && isTouched) ? 'is-invalid' : ''} ${isValid ? 'is-valid' : ''}`} id="recipient-name" ref={routeNameRef} onBlur={() => setIsTouched(false)} onChange={handleInputChange} onClick={() => setIsTouched(true)} />
              {(!isValid && isTouched) && <div className="invalid-feedback">Route name is required.</div>}
            </div>
          </form>
        </div>
        <div className="mb-3">
          <button className="btn btn-primary" data-bs-dismiss="offcanvas" disabled={!isValid} onClick={() => {
            const routeName = routeNameRef.current.value;
            const request = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': accessToken
              },
              body: JSON.stringify({ viewingIds, routeName })
            };
            fetch('/api/routes', request)
              .then(res => res.json())
              .then(route => {
                const newRoute = {
                  routeId: route[0].routeId,
                  routeName,
                  myListItemsIds: route.map(location => location.myListItemsId)
                };
                const newRoutes = homeRoutes.concat(newRoute);
                setHomeRoutes(newRoutes);
                setPrevList(false);
                setViewingIds(false);
              })
              .catch(err => console.error('Error:', err));
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}
