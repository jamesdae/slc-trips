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

  useEffect(() => { // only occurs once so default value is 'All Categories'
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
          'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc0ODE1OTM5fQ.hZH9KSy8Hdc59629Y2cLKc22UwkwAmt7bYzKIx2mz9E'
        }
      };
      fetch('/api/mylist', myInit)
        .then(res => res.json())
        .then(res => {
          const myList = res.map(obj => obj.locationId);
          setAddedLocations(myList);
        })
        .catch(err => console.error('Error:', err));
    }
  }, [isLoaded, selectedCategory, place, addedLocations]);

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
                  <DropdownMenu onSelect={selectedCategory => setSelectedCategory(selectedCategory)} />
                  <div className='row row-cols-1 row-cols-md-2 g-4'>
                    <LocationCards place={place} clickedCategory={selectedCategory}
                    addCard={addedLocationId => {
                      if (addedLocations.includes(addedLocationId)) { // checks if clicked location is already in addedLocations array set by user or database after reloading
                        return;
                      } else {
                        const newLocations = addedLocations.concat([addedLocationId]);
                        setAddedLocations(newLocations);
                      }
                      const request = {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'X-Access-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFzdGVyIiwiaWF0IjoxNjc0ODE1OTM5fQ.hZH9KSy8Hdc59629Y2cLKc22UwkwAmt7bYzKIx2mz9E'
                        },
                        body: JSON.stringify({ locationId: addedLocationId })
                      };
                      fetch('/api/mylist', request)
                        .then(res => res.json())
                        .catch(err => console.error('Error:', err));
                    }} />
                  </div>
                </div>
                <div className='tab-pane fade' id='nav-mylist' role='tabpanel' aria-labelledby='nav-mylist-tab'>
                  <div className='row row-cols-1 row-cols-md-2 g-4'>
                    {
                      place.map((location, index) => {
                        if (addedLocations.includes(location.locationId)) {
                          return <EachCard location={location} key={index} tab="list" />;
                        } else {
                          return null;
                        }
                      })
                    }
                  </div>
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
            <MapMarkers place={place} clickedCategory={selectedCategory} />
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
