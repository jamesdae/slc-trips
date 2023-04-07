import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import LocationCards from '../components/location-cards';
import DropdownMenu from '../components/dropdown-menu';
import EachCard from '../components/each-card';
import Libraries from '../components/api-libraries';
import MapMarkers from '../components/map-markers';
import { fetchPlaces } from '../lib/';
import RouteOptionsButton from '../components/route-options-button';
import ExtraDetails from '../components/extra-details';
import DirectionsPanel from '../components/directions-panel';
import EmptyTabAlert from '../components/empty-tab';
import SavedRoute from '../components/saved-routes';
import NewRouteForm from '../components/new-route-form';

export default function Home({ user, signOut }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.API_KEY,
    libraries: Libraries.libraries,
    version: 'beta'
  });

  const [place, setPlace] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [addedLocations, setAddedLocations] = useState(null);
  const [extraDetailsOpen, setExtraDetailsOpen] = useState(false);
  const [viewingIds, setViewingIds] = useState(null);
  const [prevList, setPrevList] = useState(null);
  const [mappedIds, setMappedIds] = useState(null);
  const [homeRoutes, setHomeRoutes] = useState([]);

  const accessToken = user.token;

  useEffect(() => {
    if (isLoaded && place === null) {
      fetch(`/api/locations/?category=${selectedCategory}`)
        .then(res => res.json())
        .then(locations => fetchPlaces(locations, selectedCategory, isLoaded))
        .then(fetchedLocations => setPlace(fetchedLocations))
        .catch(error => {
          console.error(error);
          setErrorMessage('Sorry, there was an error connecting to the network! Please try again in a few moments.');
        });
    } else if (isLoaded && place !== null && accessToken) {
      const getRequest = {
        method: 'GET',
        headers: {
          'X-Access-Token': accessToken
        }
      };
      fetch('/api/mylist', getRequest)
        .then(res => res.json())
        .then(res => {
          const myList = res.map(obj => obj);
          const addedLocationIds = res.map(obj => obj.locationId);
          setAddedLocations(myList);
          const myListLocations = [];
          addedLocationIds.forEach(id => myListLocations.push(place.find(location => location.locationId === id)));
          setMappedIds(myListLocations);
          fetch('/api/routes', getRequest)
            .then(response => response.json())
            .then(oldRoutes => setHomeRoutes(oldRoutes));
        })
        .catch(err => console.error('Error:', err));
    }
  }, [isLoaded, selectedCategory, place, accessToken]);

  if (loadError) return 'Error loading maps';

  function findRouteLink() {
    if (!Array.isArray(viewingIds) || !viewingIds.length > 1 || !mappedIds) return '#';
    const coordinates = viewingIds.map(id => {
      const pinnedIndex = mappedIds.findIndex(place => place.locationId === id);
      if (pinnedIndex >= 0) {
        return `${mappedIds[pinnedIndex].geometry.location.lat()}, ${mappedIds[pinnedIndex].geometry.location.lng()}`;
      } else {
        return null;
      }
    });
    const waypoints = coordinates.slice(1, -1).map(coord => ({ location: coord }));
    const daddr = coordinates[coordinates.length - 1];
    const origin = coordinates[0];
    const link = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${daddr}&waypoints=${waypoints.map(waypoint => waypoint.location).join('|')}`;
    return link;
  }

  if (place !== null && errorMessage === null) {
    return (
      <div className='bg-light'>
        <nav className='sticky-md-top col-md-6 col-12 navbar navbar-expand-md justify-content-md-between navbar-light bg-light my-nav p-0'>
          <h1 className='mx-2 my-0 blue heading'>SLCTrips</h1>
          <button className='mx-2 btn btn-secondary' onClick={() => signOut()}>{user === 'guest' ? 'Sign in' : 'Sign Out'}</button>
        </nav>
        <div className='d-flex flex-wrap flex-column-reverse'>
          <div className='col-md-6 col-12'>
            <div>
              <nav className='sticky-tab white-background'>
                <div className='nav nav-tabs nav-fill' id='nav-tab' role='tablist'>
                  <button className='nav-link active' disabled={extraDetailsOpen} id='nav-places-tab' data-bs-toggle='tab' data-bs-target='#nav-places' type='button' role='tab' aria-controls='nav-places' aria-selected='true' onClick={() => {
                    const offset = window.innerWidth < 768 ? window.innerHeight * 0.07 : 0;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                    if (viewingIds !== null) {
                      setPrevList(viewingIds);
                    }
                    setViewingIds(null);
                  }}>Places</button>
                  <button className='nav-link' disabled={extraDetailsOpen} id='nav-mylist-tab' data-bs-toggle='tab' data-bs-target='#nav-mylist' type='button' role='tab' aria-controls='nav-mylist' aria-selected='false' onClick={() => {
                    const offset = window.innerWidth < 768 ? window.innerHeight * 0.07 : 0;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                    if (prevList !== null) {
                      setViewingIds(prevList);
                    } else {
                      setViewingIds(false);
                    }
                  }}>My List</button>
                  <button className='nav-link' disabled={extraDetailsOpen} id='nav-routes-tab' data-bs-toggle='tab' data-bs-target='#nav-routes' type='button' role='tab' aria-controls='nav-routes' aria-selected='false' onClick={() => {
                    const offset = window.innerWidth < 768 ? window.innerHeight * 0.07 : 0;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                    if (viewingIds !== null) {
                      setPrevList(viewingIds);
                    } else {
                      setViewingIds(prevList);
                    }
                  }}>My Routes</button>
                </div>
              </nav>
              <div className='tab-content white p-2' id='nav-tabContent'>
                <div className='tab-pane fade show active' id='nav-places' role='tabpanel' aria-labelledby='nav-places-tab'>
                  {extraDetailsOpen === false
                    ? (
                      <div>
                        <DropdownMenu selectedCategory={selectedCategory} onSelect={selectedCategory => {
                          setViewingIds(null);
                          setSelectedCategory(selectedCategory);
                        }} />
                        <div className='row row-cols-1 row-cols-md-2 g-1'>
                          <LocationCards place={place} clickedCategory={selectedCategory} user={user}
                            viewCard={viewingId => {
                              setExtraDetailsOpen(!extraDetailsOpen);
                              setPrevList(viewingIds);
                              setViewingIds([viewingId]);
                            }}
                            addCard={addedLocationId => {
                              if (user === 'guest') return;
                              const existenceCheck = addedLocations.find(savedlocation => savedlocation.locationId === addedLocationId);
                              if (existenceCheck) {
                                return null;
                              } else {
                                const request = {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'X-Access-Token': accessToken
                                  },
                                  body: JSON.stringify({ locationId: addedLocationId })
                                };
                                fetch('/api/mylist', request)
                                  .then(res => res.json())
                                  .then(newLocation => {
                                    const newLocations = addedLocations.concat([newLocation]);
                                    setAddedLocations(newLocations);
                                    const addedLocationIds = newLocations.map(obj => obj.locationId);
                                    const myListLocations = [];
                                    addedLocationIds.forEach(id => {
                                      myListLocations.push(place.find(location => location.locationId === id));
                                    });
                                    setMappedIds(myListLocations);
                                  })
                                  .catch(err => console.error('Error:', err));
                              }
                            }} />
                        </div>
                      </div>
                      )
                    : (
                      <ExtraDetails place={place} viewingIds={viewingIds} setExtraDetailsOpen={flippedValue => setExtraDetailsOpen(flippedValue)} setViewingIds={ids => setViewingIds(ids)} extraDetailsOpen={extraDetailsOpen} prevList={prevList} />
                      )}
                </div>
                <div className='tab-pane fade' id='nav-mylist' role='tabpanel' aria-labelledby='nav-mylist-tab'>
                  {extraDetailsOpen === false
                    ? (
                      <div>
                        {accessToken && <RouteOptionsButton link={findRouteLink()} mappedIds={mappedIds} viewingIds={viewingIds} />}
                        {
                          accessToken && addedLocations !== null && addedLocations.length > 0
                            ? (
                              <div className='row row-cols-1 row-cols-md-2 g-1'>
                                {
                                  mappedIds.map((location, index) => {
                                    const savedlocation = addedLocations.find(savedlocation => savedlocation.locationId === location.locationId);
                                    if (savedlocation.locationId === location.locationId) {
                                      return <EachCard location={location} key={savedlocation.myListItemsId} homeRoutes={homeRoutes} viewingIds={viewingIds} myListItemsId={savedlocation.myListItemsId} tab="list"
                                      setPins={pinnedId => {
                                        if (viewingIds === false) {
                                          setViewingIds([pinnedId]);
                                        } else if (!viewingIds.includes(pinnedId)) {
                                          const newPins = viewingIds.concat([pinnedId]);
                                          setViewingIds(newPins);
                                        }
                                      }}
                                      unpinLocation={id => {
                                        const remainingPins = viewingIds.filter(viewingId => viewingId !== id);
                                        if (remainingPins[0] === undefined) {
                                          setViewingIds(false);
                                          setPrevList(false);
                                        } else {
                                          setViewingIds(remainingPins);
                                          setPrevList(remainingPins);
                                        }
                                      }}
                                      removeLocation={async removeId => {
                                        const deleteRequest = {
                                          method: 'DELETE',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'X-Access-Token': accessToken
                                          }
                                        };
                                        if (homeRoutes.find(route => route.myListItemsIds.includes(removeId))) {
                                          const routesToDelete = homeRoutes.filter(route => route.myListItemsIds.includes(removeId));
                                          const deleteRoutes = async () => {
                                            for (const route of routesToDelete) {
                                              try {
                                                await fetch(`/api/routes/${route.routeId}`, deleteRequest);
                                                const remainingRoutes = homeRoutes.filter(route => !route.myListItemsIds.includes(removeId));
                                                setHomeRoutes(remainingRoutes);
                                              } catch (err) {
                                                console.error('Error deleting route:', err);
                                              }
                                            }
                                          };
                                          await deleteRoutes()
                                            .then(() => {
                                              return fetch(`/api/mylist/${removeId}`, deleteRequest)
                                                .then(res => res.json())
                                                .then(res => {
                                                  const reducedLocations = addedLocations.filter(location => location.myListItemsId !== res.myListItemsId);
                                                  setAddedLocations(reducedLocations);
                                                  const addedLocationIds = reducedLocations.map(obj => obj.locationId);
                                                  const myListLocations = [];
                                                  addedLocationIds.forEach(id => {
                                                    myListLocations.push(place.find(location => location.locationId === id));
                                                  });
                                                  setMappedIds(myListLocations);
                                                  if (viewingIds === false) return;
                                                  const reducedPins = viewingIds.filter(id => id !== res.locationId);
                                                  if (reducedPins[0] === undefined) {
                                                    setViewingIds(false);
                                                  } else {
                                                    setViewingIds(reducedPins);
                                                  }
                                                  if (reducedLocations[0] === undefined) {
                                                    setViewingIds(false);
                                                  }
                                                })
                                                .catch(err => console.error('Error:', err));
                                            });
                                        } else {
                                          fetch(`/api/mylist/${removeId}`, deleteRequest)
                                            .then(res => res.json())
                                            .then(res => {
                                              const reducedLocations = addedLocations.filter(location => location.myListItemsId !== res.myListItemsId);
                                              setAddedLocations(reducedLocations);
                                              const addedLocationIds = reducedLocations.map(obj => obj.locationId);
                                              const myListLocations = [];
                                              addedLocationIds.forEach(id => {
                                                myListLocations.push(place.find(location => location.locationId === id));
                                              });
                                              setMappedIds(myListLocations);
                                              if (viewingIds === false) return;
                                              const reducedPins = viewingIds.filter(id => id !== res.locationId);
                                              if (reducedPins[0] === undefined) {
                                                setViewingIds(false);
                                              } else {
                                                setViewingIds(reducedPins);
                                              }
                                              if (reducedLocations[0] === undefined) {
                                                setViewingIds(false);
                                              }
                                            })
                                            .catch(err => console.error('Error:', err));
                                        }
                                      }}
                                      viewCard={viewingId => {
                                        setExtraDetailsOpen(!extraDetailsOpen);
                                        setPrevList(viewingIds);
                                        setViewingIds([viewingId]);
                                      }} />;
                                    } else return null;
                                  })
                                  }
                                <span><div className="alert alert-warning alert-dismissible fade show d-flex justify-content-between" role="alert">
                                  <p><i className="fa-solid fa-circle-info" /> Press{' '}<i className='fa-solid fa-location-dot text-success fs-3' /> to start a new route on the map!</p>
                                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
                                </div></span>
                              </div>
                              )
                            : (
                              <EmptyTabAlert signIn={() => signOut()} tab='list' user={user}/>
                              )
                        }
                      </div>
                      )
                    : (
                      <ExtraDetails place={place} viewingIds={viewingIds} setExtraDetailsOpen={flippedValue => setExtraDetailsOpen(flippedValue)} setViewingIds={ids => setViewingIds(ids)} extraDetailsOpen={extraDetailsOpen} prevList={prevList} />
                      )}
                </div>
                <div className='tab-pane fade' id='nav-routes' role='tabpanel' aria-labelledby='nav-routes-tab'>
                  {extraDetailsOpen === false
                    ? (
                      <div>
                        {viewingIds !== null && viewingIds !== false
                          ? (
                            <div className='row rows-cols-1'>
                              <button className="btn btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePins" aria-expanded="true" aria-controls="collapsePins">
                                Current Route Details <i className="fa-sharp fa-solid fa-caret-down" />
                              </button>
                              <div className="collapse show" id="collapsePins">
                                <RouteOptionsButton link={findRouteLink()} mappedIds={mappedIds} viewingIds={viewingIds} />
                                <div className='row row-cols-1 row-cols-md-2 g-1'>
                                  {
                                    mappedIds.map((location, index) => {
                                      const savedlocation = addedLocations.find(savedlocation => savedlocation.locationId === location.locationId);
                                      if (savedlocation.locationId === location.locationId && viewingIds.includes(location.locationId)) {
                                        return (
                                          <EachCard location={location} key={savedlocation.myListItemsId} viewingIds={viewingIds} myListItemsId={savedlocation.myListItemsId} unpinLocation={id => {
                                            const remainingPins = viewingIds.filter(viewingId => viewingId !== id);
                                            if (remainingPins[0] === undefined) {
                                              setViewingIds(false);
                                              setPrevList(false);
                                            } else {
                                              setViewingIds(remainingPins);
                                              setPrevList(remainingPins);
                                            }
                                          }}
                                            viewCard={viewingId => {
                                              setExtraDetailsOpen(!extraDetailsOpen);
                                              setPrevList(viewingIds);
                                              setViewingIds([viewingId]);
                                            }} />
                                        );
                                      } else return null;
                                    })
                                  }
                                </div>
                              </div>
                            </div>
                            )
                          : (
                            <div className='flex-fill'>
                              {homeRoutes[0] === undefined ? <EmptyTabAlert signIn={() => signOut()} tab='routes' user={user} /> : null}
                            </div>
                            )
                          }
                        {homeRoutes[0] !== undefined
                          ? (
                            <div className='row row-cols-1'>
                              <button className="btn btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRoutes" aria-expanded={!viewingIds} aria-controls="collapseRoutes">
                                My Saved Routes <i className="fa-sharp fa-solid fa-caret-down" />
                              </button>
                              <div className='collapse' id="collapseRoutes">
                                {
                                homeRoutes.map(route => {
                                  const locationIds = route.myListItemsIds.map(id => {
                                    return addedLocations[addedLocations.findIndex(location => location.myListItemsId === id)].locationId;
                                  });
                                  return <SavedRoute key={route.routeId} route={route} homeRoutes={homeRoutes} setHomeRoutes={remainingRoutes => setHomeRoutes(remainingRoutes)} locationIds={locationIds} mappedIds={mappedIds} accessToken={accessToken} setViewingIds={ids => setViewingIds(ids)} setPrevList={ids => setPrevList(ids)} viewingIds={viewingIds}/>;
                                })
                              }
                              </div>
                            </div>
                            )
                          : null}
                      </div>
                      )
                    : (
                      <ExtraDetails place={place} viewingIds={viewingIds} setExtraDetailsOpen={flippedValue => setExtraDetailsOpen(flippedValue)} setViewingIds={ids => setViewingIds(ids)} extraDetailsOpen={extraDetailsOpen} prevList={prevList}/>
                      )}
                </div>
              </div>
            </div>
          </div>
          <NewRouteForm accessToken={accessToken} viewingIds={viewingIds} homeRoutes={homeRoutes} setHomeRoutes={routes => setHomeRoutes(routes)} setPrevList={list => setPrevList(list)} setViewingIds={ids => setViewingIds(ids)}/>
          <DirectionsPanel link={findRouteLink()} setPrevList={() => setPrevList(false)} setViewingIds={() => setViewingIds(false)} viewingIds={viewingIds}/>
          <div className='full white-background col-md-6 col-12 map-padding'>
            <MapMarkers place={place} clickedCategory={selectedCategory} viewingIds={viewingIds} extraDetailsOpen={extraDetailsOpen} openExtraDetailsForId={id => {
              if (extraDetailsOpen === true) return;
              setPrevList(viewingIds);
              setExtraDetailsOpen(true);
              setViewingIds([id]);
            }}/>
          </div>
        </div>
      </div>
    );
  } else if (place === null && errorMessage === null) {
    return (
      <div className="d-flex justify-content-center align-items-center main">
        <i className="p-2 fas fa-spinner fa-pulse icon-xl" />
        <h1 className='p-2 d-inline-flex grow'>Loading...</h1>
      </div>
    );
  } else if (errorMessage !== null) {
    return (
      <div className="d-flex justify-content-center align-items-center main">
        <h4 className='text-center'>{errorMessage}</h4>
      </div>
    );
  }
}
