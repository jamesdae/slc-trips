import React from 'react';

export default function LocationCards(props) {
  if (props.place) {
    const list = props.place.map((location, index) => {
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
                  <button className="mybuttons btn btn-success" type="a">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return list;
  } else {
    return null;
  }
}
