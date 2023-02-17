import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import LocationCards from '../components/location-cards';
import DropdownMenu from '../components/dropdown-menu';
import EachCard from '../components/each-card';
import Libraries from '../components/apilibraries';
import MapMarkers from '../components/map-markers';
import { fetchPlaces } from '../lib';
import DirectionsModal from '../components/directions-modal';

export default function Home() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.API_KEY,
    libraries: Libraries.libraries,
    version: 'beta'
  });

  const [place, setPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [addedLocations, setAddedLocations] = useState(null);
  const [extraDetailsOpen, setExtraDetailsOpen] = useState(false);
  const [viewingIds, setViewingIds] = useState(null);
  const [prevList, setPrevList] = useState(null);
  const [mappedIds, setMappedIds] = useState(null);

  useEffect(() => {
    if (isLoaded && place === null) {
      fetch(`/api/locations/?category=${selectedCategory}`)
        .then(res => res.json())
        .then(locations => fetchPlaces(locations, selectedCategory))
        .then(fetchedLocations => setPlace(fetchedLocations))
        .catch(error => console.error(error));
    } else if (isLoaded && place !== null) {
      const myInit = {
        method: 'GET',
        headers: {
          'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc2MzUwNTQwfQ.-7s7i9P8n3luohxsiRM8sgszdv8wpxo6jY-VBQ7ohz8'
        }
      };
      fetch('/api/mylist', myInit)
        .then(res => res.json())
        .then(res => {
          const myList = res.map(obj => obj);
          const addedLocationIds = res.map(obj => obj.locationId);
          setAddedLocations(myList);
          const myListLocations = [];
          addedLocationIds.forEach(id => {
            myListLocations.push(place.find(location => location.locationId === id));
          });
          setMappedIds(myListLocations);
        })
        .catch(err => console.error('Error:', err));
    }
  }, [isLoaded, selectedCategory, place]);

  if (loadError) return 'Error loading maps';

  if (place !== null && addedLocations !== null && isLoaded) {
    return (
      <div className='bg-light'>
        <nav className='sticky-md-top col-md-6 col-12 navbar navbar-expand-lg navbar-light bg-light'>
          <h1 className='mx-2 blue heading'>SLCTrips</h1>
        </nav>
        <div className='d-flex flex-wrap flex-column-reverse'>
          <div className='col-md-6 col-12'>
            <div>
              <nav className='stickytab backwhite'>
                <div className='nav nav-tabs nav-fill' id='nav-tab' role='tablist'>
                  <button className='nav-link active' id='nav-places-tab' data-bs-toggle='tab' data-bs-target='#nav-places' type='button' role='tab' aria-controls='nav-places' aria-selected='true' onClick={() => {
                    if (extraDetailsOpen) return;
                    if (viewingIds !== null) {
                      setPrevList(viewingIds);
                    }
                    setViewingIds(null);
                  }}>Places</button>
                  <button className='nav-link' id='nav-mylist-tab' data-bs-toggle='tab' data-bs-target='#nav-mylist' type='button' role='tab' aria-controls='nav-mylist' aria-selected='false' onClick={() => {
                    if (extraDetailsOpen) return;
                    if (prevList !== null) {
                      setViewingIds(prevList);
                    } else {
                      setViewingIds(false);
                    }
                  }}>My List</button>
                  <button className='nav-link' id='nav-routes-tab' data-bs-toggle='tab' data-bs-target='#nav-routes' type='button' role='tab' aria-controls='nav-routes' aria-selected='false' onClick={() => {
                    if (extraDetailsOpen) return;
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
                        <div className='row row-cols-1 row-cols-md-2 g-4'>
                          <LocationCards place={place} clickedCategory={selectedCategory}
                            viewCard={viewingId => {
                              setExtraDetailsOpen(!extraDetailsOpen);
                              setViewingIds([viewingId]);
                            }}
                            addCard={addedLocationId => {
                              const existenceCheck = addedLocations.find(savedlocation => savedlocation.locationId === addedLocationId);
                              if (existenceCheck) {
                                return null;
                              } else {
                                const request = {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc2MzUwNTQwfQ.-7s7i9P8n3luohxsiRM8sgszdv8wpxo6jY-VBQ7ohz8'
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
                      <div>
                        <button className="mybuttons btn btn-secondary" type="button"
                        onClick={event => {
                          setExtraDetailsOpen(!extraDetailsOpen);
                          setViewingIds(null);
                        }}>
                          Close Details
                        </button>
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
                      )}
                </div>
                <div className='tab-pane fade' id='nav-mylist' role='tabpanel' aria-labelledby='nav-mylist-tab'>
                  {extraDetailsOpen === false
                    ? (
                      <div>
                        <DirectionsModal viewingIds={viewingIds} clearPins={() => setViewingIds(false)} />
                        {
                          addedLocations.length > 0
                            ? (
                              <div className='row row-cols-1 row-cols-md-2 g-4'>
                                {
                                  mappedIds.map((location, index) => {
                                    const savedlocation = addedLocations.find(savedlocation => savedlocation.locationId === location.locationId);
                                    if (savedlocation.locationId === location.locationId) {
                                      return <EachCard location={location} key={savedlocation.myListItemsId}
                                      setPins={pinnedId => {
                                        if (viewingIds === false) {
                                          setViewingIds([pinnedId]);
                                        } else if (!viewingIds.includes(pinnedId)) {
                                          const newPins = viewingIds.concat([pinnedId]);
                                          setViewingIds(newPins);
                                        }
                                      }}
                                      myListItemsId={savedlocation.myListItemsId} tab="list"
                                      removeLocation={removeId => {
                                        fetch(`/api/mylist/${removeId}`, {
                                          method: 'DELETE',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc2MzUwNTQwfQ.-7s7i9P8n3luohxsiRM8sgszdv8wpxo6jY-VBQ7ohz8'
                                          }
                                        })
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
                                  <p>
                                    <strong>Tip!</strong> Press{' '}
                                    <button className="mybuttons btn btn-success" type="button">
                                      Pin
                                    </button>{' '}
                                    to start a new route on the map!
                                  </p>
                                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
                                </div></span>
                              </div>
                              )
                            : (
                              <div className="alert alert-primary" role="alert">
                                <h4 className="alert-heading">No locations added yet.</h4>
                                <p className='py-2'>Click Places above, and press <button className="mybuttons btn btn-success" type="button" >Add</button> to see locations here.</p>
                                <hr />
                                <p className="mb-0">Sign in <a href="#" className="alert-link">here</a> to save your changes!</p>
                              </div>
                              )
                        }
                      </div>
                      )
                    : (
                      <div>
                        <button className="mybuttons btn btn-secondary" type="button"
                          onClick={event => {
                            setExtraDetailsOpen(!extraDetailsOpen);
                            setViewingIds(prevList);
                          }}>
                          Close Details
                        </button>
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
                      )}
                </div>
                <div className='tab-pane fade' id='nav-routes' role='tabpanel' aria-labelledby='nav-routes-tab'>
                  {extraDetailsOpen === false
                    ? (
                      <div className='row row-cols-1 row-cols-md-2 g-4'>
                        {
                          viewingIds !== null && viewingIds !== false
                            ? (
                                mappedIds.map((location, index) => {
                                  const savedlocation = addedLocations.find(savedlocation => savedlocation.locationId === location.locationId);
                                  if (savedlocation.locationId === location.locationId && viewingIds.includes(location.locationId)) {
                                    return <EachCard location={location} key={savedlocation.myListItemsId}
                                    myListItemsId={savedlocation.myListItemsId} tab="route"
                                    viewCard={viewingId => {
                                      setExtraDetailsOpen(!extraDetailsOpen);
                                      setPrevList(viewingIds);
                                      setViewingIds([viewingId]);
                                    }} />;
                                  } else return null;
                                })
                              )
                            : (
                              <div className="alert alert-primary flex-fill" role="alert">
                                <h4 className="alert-heading">No locations pinned yet.</h4>
                                <p className='py-2'>Add locations to My List, then click <button className="mybuttons btn btn-success" type="button" >Pin</button> to see locations here.</p>
                                <hr />
                                <p className="mb-0">Sign in <a href="#" className="alert-link">here</a> to save your changes!</p>
                              </div>
                              )
                        }
                      </div>
                      )
                    : (
                      <div>
                        <button className="mybuttons btn btn-secondary" type="button"
                            onClick={event => {
                              setExtraDetailsOpen(!extraDetailsOpen);
                              setViewingIds(prevList);
                            }}>
                          Close Details
                        </button>
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
                      )}

                </div>
              </div>
            </div>
          </div>
          <div className='full backwhite col-md-6 col-12 botpad'>
            <MapMarkers place={place} clickedCategory={selectedCategory} viewingIds={viewingIds} extraDetailsOpen={extraDetailsOpen} openExtraDetailsForId={id => {
              setPrevList(viewingIds);
              setExtraDetailsOpen(!extraDetailsOpen);
              setViewingIds([id]);
            }}/>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="d-flex justify-content-center align-items-center main">
        <i className="p-2 fas fa-spinner fa-pulse" />
        <h1 className='p-2 d-inline-flex grow'>Loading...</h1>
      </div>
    );
  }
}
