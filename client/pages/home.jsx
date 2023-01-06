import React from 'react';
import PlacesMap from '../components/places-map';

export default function Home(props) {
  // eslint-disable-next-line no-console
  console.log('Home component is being rendered and here are its props: ', props);
  if (props.all) {
    return (
      <div>
        <nav className='sticky-top col-md-6 col-12 navbar navbar-expand-lg navbar-light bg-light'>
          <h1 className='logopad blue heading'>SLCTrips</h1>
        </nav>
        <PlacesMap all={props.all} />
      </div>
    );
  } else {
    return null;
  }

}
