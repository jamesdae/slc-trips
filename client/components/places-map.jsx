import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import LocationCards from './location-cards';
import DropdownMenu from './dropdown-menu';
import Libraries from './apilibraries';
import PlaceDetails from './place-details';
import MapMarkers from './map-markers';

function fetchPlaces(locations) {
  const requests = locations.map((location, index) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({ placeId: location.placeId, fields: ['name', 'geometry', 'photos', 'rating', 'user_ratings_total', 'reviews', 'place_id', 'types', 'website', 'url', 'opening_hours'] }, (newPlace, status) => {
          // eslint-disable-next-line no-undef
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(newPlace);
          } else {
            reject(status);
          }
        });
      }, index * 60);
    });
  });
  return Promise.all(requests);
}

export default function PlacesMap(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.API_KEY,
    libraries: Libraries.libraries
  });

  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (isLoaded && props.all) {
      fetchPlaces(props.all).then(results => {
        setPlace(results);
      }).catch(error => {
        console.error(error);
      });
    }
  }, [isLoaded, props.all]);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  if (place) {
    // eslint-disable-next-line no-console
    console.log('PlacesMap component loading, here is state place:', place);
    return (
      <div>
        <div className='flex'>
          <div className='col-md-6 col-12'>
            <div className='container-lg'>
              <nav className='stickytab backwhite p-2'>
                <div className='nav nav-tabs nav-fill' id='nav-tab' role='tablist'>
                  <button className='nav-link active' id='nav-places-tab' data-bs-toggle='tab' data-bs-target='#nav-places' type='button' role='tab' aria-controls='nav-places' aria-selected='true'>Places</button>
                  <button className='nav-link' id='nav-mylist-tab' data-bs-toggle='tab' data-bs-target='#nav-mylist' type='button' role='tab' aria-controls='nav-mylist' aria-selected='false'>My List</button>
                  <button className='nav-link' id='nav-routes-tab' data-bs-toggle='tab' data-bs-target='#nav-routes' type='button' role='tab' aria-controls='nav-routes' aria-selected='false'>My Routes</button>
                </div>
              </nav>
              <div className='tab-content m-2 p-2' id='nav-tabContent'>
                <div className='tab-pane fade show active' id='nav-places' role='tabpanel' aria-labelledby='nav-places-tab'>
                  <DropdownMenu />
                  <LocationCards />
                </div>
                <div className='tab-pane fade' id='nav-mylist' role='tabpanel' aria-labelledby='nav-mylist-tab'>
                  <div>
                    <PlaceDetails place={place} all={props.all} />
                  </div>
                </div>
                <div className='tab-pane fade' id='nav-routes' role='tabpanel' aria-labelledby='nav-routes-tab'>
                  <p>Coming Soon...</p>
                </div>
              </div>
            </div>
          </div>
          <div className='full backwhite col-md-6 col-12 botpad' >
            <MapMarkers place={place} />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
