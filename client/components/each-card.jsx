import React from 'react';
import Carousel from './photoCarousel';

export default function EachCard(props) {
  return (
    <div className='col'>
      <div className='card m-2'>
        <div className='d-flex flex-md-column flex-row-reverse'>
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
            <p className='grey smalltext'>{props.location.category}</p>
            <span>Rating: {props.location.rating}/5 </span>
            <i className='fa-solid fa-star gold' />
            <a href={props.location.url} target='_blank' rel="noreferrer" className='d-block py-2'>{props.location.user_ratings_total} reviews</a>
            {
              props.tab === 'extradetails'
                ? (
                    null
                  )
                : (
                  <div className="d-flex justify-content-around">
                    {props.tab === 'list'
                      ? (
                        <div className='d-flex'>
                          <i type="button" className='grey align-self-center fa-solid fa-circle-minus pointer' data-bs-toggle="modal" data-bs-target="#exampleModalCenter" />

                          <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLongTitle">Confirm</h5>
                                  <i aria-hidden="true" type="button" className="close fa-solid fa-xmark" data-bs-dismiss="modal" aria-label="Close"/>
                                </div>
                                <div className="modal-body">
                                  <p>Remove from list?</p>
                                </div>
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => props.removeLocation(props.myListItemsId)}>Remove</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        )
                      : null}
                    <button className="mybuttons btn btn-primary" type="button" onClick={() => props.viewCard(props.location.locationId)}>Info</button>
                    {props.tab === 'list'
                      ? (
                        <button className="mybuttons btn btn-success" type="button" onClick={() => {
                          props.setPins(props.location.locationId);
                        }}>Pin</button>
                        )
                      : (
                        <button className="mybuttons btn btn-success" type="button" onClick={() => props.addCard(props.location.locationId)}>Add</button>
                        )}
                  </div>
                  )
            }
          </div>
        </div>
        {
          props.tab === 'extradetails'
            ? (
                props.location.reviews.map((review, index) => {
                  return (
                    <div key={index} className="m-2 p-2 d-flex flex-column justify-content-center">
                      <a href={review.author_url} target='_blank' rel="noreferrer" className='text-capitalize'><i className='me-1 fa-solid fa-circle-user'/>{review.author_name}</a>
                      <p className='my-1'>{review.rating}/5 <i className='fa-solid fa-star gold' /> <em>about {review.relative_time_description}</em></p>
                      <p className='grey smalltext'>&quot;{review.text}&quot;</p>
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
  );
}
