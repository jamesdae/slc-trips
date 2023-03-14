import React from 'react';
import Carousel from './photoCarousel';

export default function EachCard(props) {

  return (
    <div className='col'>
      <div className='card m-2'>
        <div className={props.tab === 'extradetails' ? 'd-flex flex-md-column flex-row-reverse' : 'd-flex flex-md-column flex-row-reverse pointer'} onClick={() => {
          if (props.tab !== 'extradetails') {
            const offset = window.innerWidth < 768 ? window.innerHeight * 0.07 : 0;
            window.scrollTo({ top: offset, behavior: 'smooth' });
            props.viewCard(props.location.locationId);
          }
        }}>
          {
            props.tab === 'extradetails'
              ? (
                <Carousel images={props.location.photos} />
                )
              : (
                <img className='p-1 detailimage align-self-center align-self-md-stretch' src={props.location.photos[0].getUrl()} alt='photo from Google Places' />
                )
          }
          <div className='card-body d-flex flex-column justify-content-center carddetails'>
            <p className='card-title'>{props.location.name}</p>
            <p className='grey smalltext'>{props.location.category}</p>
            <span>Rating: {props.location.rating}/5 <i className='fa-solid fa-star gold' /></span>
            <p className='pt-2 mb-1'>{props.location.user_ratings_total} reviews</p>
            {
              props.tab === 'extradetails'
                ? (
                    null
                  )
                : (
                  <div className="d-flex justify-content-evenly align-items-center p-1" onClick={event => event.stopPropagation()}>
                    {props.tab === 'list'
                      ? (
                        <div className='d-flex'>
                          <i type="button" className='grey align-self-center fa-solid fa-xmark fs-3' title="Remove location" data-bs-toggle="modal" data-bs-target={`#exampleModalCenter-${props.location.locationId}`} />
                          <div className="modal fade" id={`exampleModalCenter-${props.location.locationId}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLongTitle">Confirm</h5>
                                  <i aria-hidden="true" type="button" className="close fa-solid fa-xmark" data-bs-dismiss="modal" aria-label="Close"/>
                                </div>
                                <div className="modal-body">
                                  <p>Remove {props.location.name} from list?</p>
                                  {props.homeRoutes.find(route => route.myListItemsIds.includes(props.myListItemsId)) && <p>This location is included in a saved route, which will also be deleted with removal.</p>}
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
                    <a href={props.location.url} target='_blank' rel="noreferrer" title="View in Google Maps" onClick={event => event.stopPropagation()}><i className="fa-brands fa-google fs-3" /></a>
                    {Array.isArray(props.viewingIds) && props.viewingIds.includes(props.location.locationId)
                      ? (
                        <i className="fa-solid fa-location-dot text-danger fs-3" onClick={() => props.unpinLocation(props.location.locationId)}/>
                        )
                      : props.tab === 'list'
                        ? (
                          <i title="Pin on map" className="fa-solid fa-location-dot text-success fs-3" onClick={() => props.setPins(props.location.locationId)}/>
                          )
                        : (
                            props.user === 'guest'
                              ? <button className='btn btn-link' type='button' title='Sign in to make changes' aria-disabled="false"><i className='fa-solid fa-plus text-secondary fs-3'/></button>
                              : <button className='btn btn-link' type='button' title='Add to my list' aria-disabled="false" onClick={() => props.addCard(props.location.locationId)} ><i className='fa-solid fa-plus text-success fs-3' /></button>

                          // <button className='btn btn-link' type='button' title={props.user === 'guest' ? 'Sign in to make changes' : 'Add to my list'} disabled={props.user === 'guest'} aria-disabled={props.user === 'guest'} onClick={() => props.addCard(props.location.locationId)}><i className={props.user === 'guest' ? 'fa-solid fa-plus text-secondary fs-3 disabled' : 'fa-solid fa-plus text-success fs-3'} /></button>
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
