import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import LocationCards from '../components/location-cards';
import DropdownMenu from '../components/dropdown-menu';
import EachCard from '../components/each-card';
import Libraries from '../components/apilibraries';
import MyList from '../components/my-list';
import MapMarkers from '../components/map-markers';
import { fetchPlaces } from '../lib';

export default function Home() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.API_KEY,
    libraries: Libraries.libraries,
    version: 'beta'
  });

  const [place, setPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [addedLocations, setAddedLocations] = useState([]);
  const [extraDetailsOpen, setExtraDetailsOpen] = useState(false);
  const [viewingIds, setViewingIds] = useState(null);
  const [prevList, setPrevList] = useState(null);

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
          'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc1NDgwODUyfQ.cI392GWQY4sTdUgt3g1pSlI9Wlr-qZQzNeChLs_FEkc'
        }
      };
      fetch('/api/mylist', myInit)
        .then(res => res.json())
        .then(res => {
          const myList = res.map(obj => obj);
          setAddedLocations(myList);
        })
        .catch(err => console.error('Error:', err));
    }
  }, [isLoaded, selectedCategory, place]);

  if (loadError) return 'Error loading maps';

  if (place !== null) {
    return (
      <div className='bg-light'>
        <nav className='sticky-top col-md-6 col-12 navbar navbar-expand-lg navbar-light bg-light'>
          <h1 className='mx-2 blue heading'>SLCTrips</h1>
        </nav>
        <div className='d-flex flex-wrap flex-column-reverse'>
          <div className='col-md-6 col-12'>
            <div>
              <nav className='stickytab backwhite'>
                <div className='nav nav-tabs nav-fill' id='nav-tab' role='tablist'>
                  <button className='nav-link active' id='nav-places-tab' data-bs-toggle='tab' data-bs-target='#nav-places' type='button' role='tab' aria-controls='nav-places' aria-selected='true' onClick={() => setViewingIds(null)}>Places</button>
                  <button className='nav-link' id='nav-mylist-tab' data-bs-toggle='tab' data-bs-target='#nav-mylist' type='button' role='tab' aria-controls='nav-mylist' aria-selected='false' onClick={() => setViewingIds(addedLocations.map(location => location.locationId))}>My List</button>
                  <button className='nav-link' id='nav-routes-tab' data-bs-toggle='tab' data-bs-target='#nav-routes' type='button' role='tab' aria-controls='nav-routes' aria-selected='false'>My Routes</button>
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
                              setPrevList(viewingIds);
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
                                    'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc1NDgwODUyfQ.cI392GWQY4sTdUgt3g1pSlI9Wlr-qZQzNeChLs_FEkc'
                                  },
                                  body: JSON.stringify({ locationId: addedLocationId })
                                };
                                fetch('/api/mylist', request)
                                  .then(res => res.json())
                                  .then(newLocation => {
                                    const newLocations = addedLocations.concat([newLocation]);
                                    setAddedLocations(newLocations);
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
                <div className='tab-pane fade' id='nav-mylist' role='tabpanel' aria-labelledby='nav-mylist-tab'>
                  {extraDetailsOpen === false
                    ? (
                      <div className='row row-cols-1 row-cols-md-2 g-4'>
                        {
                          place.map((location, index) => {
                            const savedlocation = addedLocations.find(savedlocation => savedlocation.locationId === location.locationId);
                            if (savedlocation === undefined) return null;
                            if (savedlocation.locationId === location.locationId) {
                              return <EachCard location={location} key={savedlocation.myListItemsId}
                              setPins={pinnedId => {
                                if (viewingIds === null) {
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
                                    'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc1NDgwODUyfQ.cI392GWQY4sTdUgt3g1pSlI9Wlr-qZQzNeChLs_FEkc'
                                  }
                                })
                                  .then(res => res.json())
                                  .then(res => {
                                    const reducedLocations = addedLocations.filter(location => location.myListItemsId !== res.myListItemsId);
                                    const reducedPins = viewingIds.filter(id => id !== res.locationId);
                                    setAddedLocations(reducedLocations);
                                    if (reducedPins[0] === undefined) {
                                      setViewingIds(null);
                                    } else {
                                      setViewingIds(reducedPins);
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
                  <div>
                    <MyList place={place} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='full backwhite col-md-6 col-12 botpad'>
            <MapMarkers place={place} clickedCategory={selectedCategory} viewingId={viewingIds} extraDetailsOpen={extraDetailsOpen} />
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
