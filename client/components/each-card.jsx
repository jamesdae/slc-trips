import React, { useState } from 'react';
import Carousel from './photo-carousel.jsx';

export default function EachCard(props) {
  const [logoIsHovered, setLogoIsHovered] = useState(false);
  const [addIconHovered, setAddIconHovered] = useState(false);
  const [pinIconHovered, setPinIconHovered] = useState(false);

  return (
    <div className='col'>
      <div className='card m-2'>
        <div title='View photos and info' className={props.tab === 'extradetails' ? 'd-flex flex-md-column flex-row-reverse' : 'd-flex flex-md-column flex-row-reverse pointer'} onClick={() => {
          if (props.tab !== 'extradetails') {
            const offset = window.innerWidth < 768 ? window.innerHeight * 0.07 : 0;
            window.scrollTo({ top: offset, behavior: 'smooth' });
            props.viewCard(props.location.locationId);
          }
        }}>
          {
            props.tab === 'extradetails'
              ? (
                <Carousel setViewImageModal={(imageLocation, activeIndex) => props.setViewImageModal(imageLocation, activeIndex)} location={props.location} images={props.location.photos} />
                )
              : (
                <img className='p-1 detailimage align-self-center align-self-md-stretch' src={props.location.photos[0].getUrl()} alt={props.location.name} />
                )
          }
          <div className='card-body d-flex flex-column justify-content-center carddetails'>
            <div className='d-flex flex-column ps-1'>
              {props.tab === 'extradetails' ? <a href={props.location.url} target='_blank' rel="noreferrer" title="Open in Google Maps"><p className='card-title'>{props.location.name}</p></a> : <p className='card-title'>{props.location.name}</p>}
              <p className='grey smalltext mb-1'>{props.location.category}</p>
              <span>Rating: {props.location.rating}/5 <i className='fa-solid fa-star gold' /></span>
              <p className='my-1'>{props.location.user_ratings_total} reviews</p>
            </div>
            {
              props.tab === 'extradetails'
                ? (
                    null
                  )
                : (
                  <div className="d-flex justify-content-evenly align-items-center buttonrow" role="group" onClick={event => event.stopPropagation()}>
                    {props.tab === 'list'
                      ? (
                        <div className='d-flex'>
                          <button type="button" className='btn btn-secondary' title="Remove location" data-bs-toggle="modal" data-bs-target={`#confirmRouteDeleteModal-${props.location.locationId}`}><i className='align-self-center fa-solid fa-xmark fs-6'/></button>
                          <div className="modal fade" id={`confirmRouteDeleteModal-${props.location.locationId}`} tabIndex="-1" role="dialog" aria-labelledby="confirmRouteDeleteModalTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">Confirm</h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-body">
                                  <p>Remove {props.location.name} from list?</p>
                                  {props.homeRoutes.find(route => route.myListItemsIds.includes(props.myListItemsId)) && <p>(Removing this location will also delete all saved routes containing it)</p>}
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
                    <a className="btn btn-primary" href={props.location.url} target='_blank' rel="noreferrer" title="Open in Google Maps" onMouseEnter={() => setLogoIsHovered(true)} onMouseLeave={() => setLogoIsHovered(false)} onClick={event => event.stopPropagation()}>{!logoIsHovered ? <i className="fa-brands fa-google fs-6" /> : <p className='cardbutton mb-0'>Open Google Maps</p>}</a>
                    {Array.isArray(props.viewingIds) && props.viewingIds.includes(props.location.locationId)
                      ? (
                        <button title="Unpin from map" className='btn btn-danger' onMouseEnter={() => setPinIconHovered(true)} onMouseLeave={() => setPinIconHovered(false)} onClick={() => props.unpinLocation(props.location.locationId)}>{!pinIconHovered ? <i className="fa-solid fa-location-dot fs-6" /> : <p className='mb-0 fs-6'>Unpin</p>}</button>
                        )
                      : props.tab === 'list'
                        ? (
                          <button title="Pin on map" className='btn btn-success' onMouseEnter={() => setPinIconHovered(true)} onMouseLeave={() => setPinIconHovered(false)} onClick={() => props.setPins(props.location.locationId)}> {!pinIconHovered ? <i className="fa-solid fa-location-dot fs-6" /> : <p className='mb-0 fs-6'>Pin</p>} </button>
                          )
                        : (
                            props.user === 'guest'
                              ? <button className='btn btn-secondary' type='button' title='Sign in to make changes' aria-disabled="false" onMouseEnter={() => setAddIconHovered(true)} onMouseLeave={() => setAddIconHovered(false)} >{!addIconHovered ? <i className='fa-solid fa-plus fs-6' /> : <p className='mb-0 cardbutton'>Sign in to add</p>} </button>
                              : <button className='btn btn-success' type='button' title='Add to my list' aria-disabled="false" onMouseEnter={() => setAddIconHovered(true)} onMouseLeave={() => setAddIconHovered(false)} onClick={() => props.addCard(props.location.locationId)} >{!addIconHovered ? <i className='fa-solid fa-plus fs-6' /> : <p className='cardbutton mb-0'>Add to My List</p>} </button>
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
                      <a title="Contributor Google Maps Page" href={review.author_url} target='_blank' rel="noreferrer" className='text-capitalize'><i className='me-1 fa-solid fa-circle-user'/>{review.author_name}</a>
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
