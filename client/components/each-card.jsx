import React from 'react';

export default function EachCard(props) {
  return (
    <div className='col'>
      <div className='card m-2 p-2'>
        <div className='d-flex flex-md-column flex-row-reverse justify-content-center'>
          <img className='p-2 detailimage align-self-center align-self-md-stretch' src={props.location.photos[0].getUrl()} alt='photo from Google Places' />
          <div className='card-body'>
            <p className='card-title'>{props.location.name}</p>
            <p className='grey'>{props.location.category}</p>
            <span>Rating: {props.location.rating}/5 </span>
            <i className='fa-solid fa-star gold' />
            <p>{props.location.user_ratings_total} reviews</p>
            <div className="d-flex gap-1 d-md-flex justify-content-md-center">
              <a href={props.location.url} target="_blank" rel="noopener noreferrer" className="mybuttons btn btn-primary me-md-2" type="a">Info</a>
              {props.tab === 'list'
                ? (
                  <button className="mybuttons btn btn-success" type="button">Pin</button>
                  )
                : (
                  <button className="mybuttons btn btn-success" type="button" onClick={event => props.addCard(props.location.locationId)}>Add</button>
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
