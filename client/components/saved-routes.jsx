import React, { useState } from 'react';
import EditForm from './edit-form';
import ConfirmDeleteModal from './confirm-delete-modal';

export default function SavedRoute({ route, locationIds, mappedIds, accessToken, setPrevList, setViewingIds, viewingIds, setHomeRoutes, homeRoutes }) {
  const [routeName, setRouteName] = useState(route.routeName);

  function handleClick() {
    if (JSON.stringify(viewingIds) !== JSON.stringify(locationIds)) {
      // eslint-disable-next-line no-console
      console.log(locationIds, viewingIds);
      setViewingIds(locationIds);
      setPrevList(locationIds);
    } else return null;
  }

  return (
    <div className='m-2'>
      <h6 className='my-0 mx-2 card-title'>{routeName}<i className="mx-2 fa-solid fa-pen-to-square pointer" data-bs-toggle="modal" data-bs-target={`#editingModal-${route.routeId}`} onClick={() => handleClick()} /></h6>
      <div className="card-group d-flex flex-row pointer" onClick={() => handleClick()}>
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
        <EditForm route={route} accessToken={accessToken} routeName={routeName} setRouteName={newName => setRouteName(newName)} />
        <ConfirmDeleteModal route={route} accessToken={accessToken} routeName={routeName} locationIds={locationIds} mappedIds={mappedIds} homeRoutes={homeRoutes} setHomeRoutes={remainingRoutes => setHomeRoutes(remainingRoutes)} setViewingIds={reset => setViewingIds(reset)} setPrevList={reset => setPrevList(reset)}/>
      </div>
    </div>
  );
}
