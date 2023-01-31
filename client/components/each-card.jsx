import React from 'react';
import Carousel from './photoCarousel';

export default function EachCard(props) {
  return (
    <div className='col'>
      <div className='card m-2 p-2'>
        <div className='d-flex flex-md-column flex-row-reverse justify-content-center'>
          {
            props.tab === 'extradetails'
              ? (
                <Carousel images={props.location.photos} />
                )
              : (
                <img className='p-2 detailimage align-self-center align-self-md-stretch' src={props.location.photos[0].getUrl()} alt='photo from Google Places' />
                )
          }
          <div className='card-body'>
            <p className='card-title'>{props.location.name}</p>
            <p className='grey'>{props.location.category}</p>
            <span>Rating: {props.location.rating}/5 </span>
            <i className='fa-solid fa-star gold' />
            <a href={props.location.url} target='_blank' rel="noreferrer" className='d-block py-2'>{props.location.user_ratings_total} reviews</a>
            {
              props.tab === 'extradetails'
                ? (
                    null
                  )
                : (
                  <div className="d-flex gap-1 d-md-flex justify-content-md-center">
                    <button className="mybuttons btn btn-primary me-md-2" type="button" onClick={() => props.viewCard(props.location.locationId)}>Info</button>
                    {props.tab === 'list'
                      ? (
                        <button className="mybuttons btn btn-success" type="button">Pin</button>
                        )
                      : (
                        <button className="mybuttons btn btn-success" type="button" onClick={() => props.addCard(props.location.locationId)}>Add</button>
                        )}
                  </div>
                  )
            }
          </div>
        </div>
        <div className='m-2 p-2'>
          { // div for list of reviews and authors
            props.tab === 'extradetails'
              ? (
                  props.location.reviews.map((review, index) => {
                    return (
                      <div key={index}>
                        <a href={review.author_url} target='_blank' rel="noreferrer" className='text-capitalize'><i className='fa-solid fa-circle-user'/>{review.author_name}</a>
                        <p className='font-weight-bold'>{review.rating}/5 <i className='fa-solid fa-star gold' /> <em>about {review.relative_time_description}</em></p>
                        <p className='reviewtext'>&quot;{review.text}&quot;</p>
                      </div>
                    );
                  })
                )
              : (
                  null
                )
          }
        </div>
      </div>
    </div>
  );
}
