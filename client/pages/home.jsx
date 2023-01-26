import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import LocationCards from '../components/location-cards';
import DropdownMenu from '../components/dropdown-menu';
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
                  <DropdownMenu onSelect={selectedCategory => setSelectedCategory(selectedCategory)} />
                  <div className='row row-cols-1 row-cols-md-2 g-4'>
                    <LocationCards
                    place={place}
                    clickedCategory={selectedCategory}
                    addCard={addedLocationId => {
                      const newLocations = addedLocations.concat([addedLocationId]);
                      setAddedLocations(newLocations);
                    }} />
                  </div>
                </div>
                <div className='tab-pane fade' id='nav-mylist' role='tabpanel' aria-labelledby='nav-mylist-tab'>
                  <div className='row row-cols-1 row-cols-md-2 g-4'>
                    {
                      place.map((location, index) => {
                        if (addedLocations.includes(location.locationId)) {
                          return (
                            <div key={index} className='col'>
                              <div className='card m-2 p-2'>
                                <div className='d-flex flex-md-column flex-row-reverse justify-content-center'>
                                  <img className='p-2 detailimage align-self-center align-self-md-stretch' src={location.photos[0].getUrl()} alt='photo from Google Places' />
                                  <div className='card-body'>
                                    <p className='card-title'>{location.name}</p>
                                    <p className='grey'>{location.category}</p>
                                    <span>Rating: {location.rating}/5 </span>
                                    <i className='fa-solid fa-star gold' />
                                    <p>{location.user_ratings_total} reviews</p>
                                    <div className="d-flex gap-1 d-md-flex justify-content-md-center">
                                      <a href={location.url} target="_blank" rel="noopener noreferrer" className="mybuttons btn btn-primary me-md-2" type="a">Info</a>
                                      <button className="mybuttons btn btn-success" type="button">Pin</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
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
