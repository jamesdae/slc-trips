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
  const [viewingId, setViewingId] = useState(null);

  // eslint-disable-next-line no-console
  console.log('ADDEDLOCATIONS', addedLocations);

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
          'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc1Mjg1NTEzfQ.ntS-IWHMgGHmtJClWnCaizIAlAEr3dBjKFy0CgjKrXg'
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
          <h1 className='m-2 blue heading'>SLCTrips</h1>
        </nav>
        <div className='d-flex flex-wrap flex-column-reverse'>
          <div className='col-md-6 col-12'>
            <div>
              <nav className='stickytab backwhite'>
                <div className='nav nav-tabs nav-fill' id='nav-tab' role='tablist'>
                  <button className='nav-link active' id='nav-places-tab' data-bs-toggle='tab' data-bs-target='#nav-places' type='button' role='tab' aria-controls='nav-places' aria-selected='true'>Places</button>
                  <button className='nav-link' id='nav-mylist-tab' data-bs-toggle='tab' data-bs-target='#nav-mylist' type='button' role='tab' aria-controls='nav-mylist' aria-selected='false'>My List</button>
                  <button className='nav-link' id='nav-routes-tab' data-bs-toggle='tab' data-bs-target='#nav-routes' type='button' role='tab' aria-controls='nav-routes' aria-selected='false'>My Routes</button>
                </div>
              </nav>
              <div className='tab-content white p-2' id='nav-tabContent'>
                <div className='tab-pane fade show active' id='nav-places' role='tabpanel' aria-labelledby='nav-places-tab'>
                  {extraDetailsOpen === false
                    ? ( // if extraDetails are closed, display default Places list with Dropdown Menu
                      <div>
                        <DropdownMenu selectedCategory={selectedCategory} onSelect={selectedCategory => setSelectedCategory(selectedCategory)} />
                        <div className='row row-cols-1 row-cols-md-2 g-4'>
                          <LocationCards place={place} clickedCategory={selectedCategory}
                            viewCard={viewingId => {
                              setExtraDetailsOpen(!extraDetailsOpen);
                              setViewingId(viewingId);
                            }}
                            addCard={addedLocationId => {
                              if (!addedLocations[0]) {
                                const request = { // this part is where the add button will POST to database
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc1Mjg1NTEzfQ.ntS-IWHMgGHmtJClWnCaizIAlAEr3dBjKFy0CgjKrXg'
                                  },
                                  body: JSON.stringify({ locationId: addedLocationId }) // sends a POST request to index.js with a body including the ID. req.user is inherently there bc user is signed in already.
                                };
                                fetch('/api/mylist', request)
                                  .then(res => res.json())
                                  .then(addedLocation => {
                                    const newLocations = addedLocations.concat([addedLocation]);
                                    setAddedLocations(newLocations); // sets state after checking if current state has the specified locationId from user clicking it
                                  })
                                  .catch(err => console.error('Error:', err));
                              } else {
                                for (let i = 0; i <= addedLocations.length - 1; i++) {
                                  if (addedLocations[i].locationId === addedLocationId) {
                                    return null;
                                  } else {
                                    const request = { // this part is where the add button will POST to database
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc1Mjg1NTEzfQ.ntS-IWHMgGHmtJClWnCaizIAlAEr3dBjKFy0CgjKrXg'
                                      },
                                      body: JSON.stringify({ locationId: addedLocationId }) // sends a POST request to index.js with a body including the ID. req.user is inherently there bc user is signed in already.
                                    };
                                    fetch('/api/mylist', request)
                                      .then(res => res.json())
                                      .then(addedLocation => {
                                        const newLocations = addedLocations.concat([addedLocation]);
                                        setAddedLocations(newLocations); // sets state after checking if current state has the specified locationId from user clicking it
                                      })
                                      .catch(err => console.error('Error:', err));
                                  }
                                }
                              }
                            }} />
                        </div>
                      </div>
                      )
                    : ( // else if extraDetails are open, display single location card with details
                      <div>
                        <button className="mybuttons btn btn-secondary" type="button"
                        onClick={event => {
                          setExtraDetailsOpen(!extraDetailsOpen);
                          setViewingId(null);
                        }}>
                          Close Details
                        </button>
                        { // loop through places to find location with viewingId and replace list of places shown with matching location card
                          place.map((location, index) => {
                            if (location.locationId === viewingId) {
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
                          place.map((location, index) => { // loop through places to find locations saved in database and display matching locations in My List tab
                            return addedLocations.map(savedlocation => {
                              if (savedlocation.locationId === location.locationId) {
                                return <EachCard location={location} key={index} myListItemsId={savedlocation.myListItemsId} tab="list" removeLocation={removeId => {
                                  const reducedLocations = addedLocations.filter(location => location.myListItemsId !== removeId);
                                  setAddedLocations(reducedLocations); // clicking remove icon in My List cards will set state with new array without removed locations ID
                                  fetch(`/api/mylist/${removeId}`, {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc1Mjg1NTEzfQ.ntS-IWHMgGHmtJClWnCaizIAlAEr3dBjKFy0CgjKrXg'
                                    }
                                  })
                                    .then(res => res.json())
                                    // eslint-disable-next-line no-console
                                    .then(res => console.log(res.myListItemsId))
                                    .catch(err => console.error('Error:', err));
                                }}
                                viewCard={viewingId => {
                                  setExtraDetailsOpen(!extraDetailsOpen);
                                  setViewingId(viewingId);
                                }} />;
                              } else return null;
                            });
                          })
                        }
                      </div>
                      )
                    : (
                      <div>
                        <button className="mybuttons btn btn-secondary" type="button"
                          onClick={event => {
                            setExtraDetailsOpen(!extraDetailsOpen);
                            setViewingId(null);
                          }}>
                          Close Details
                        </button>
                        {
                          place.map((location, index) => {
                            if (location.locationId === viewingId) {
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
            <MapMarkers place={place} clickedCategory={selectedCategory} viewingId={viewingId} extraDetailsOpen={extraDetailsOpen} />
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
