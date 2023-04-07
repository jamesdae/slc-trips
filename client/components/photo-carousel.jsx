import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';

export default function Carousel(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sanitizedAttribution = DOMPurify.sanitize(props.images[activeIndex].html_attributions[0]);
  const attributionRef = useRef(null);

  useEffect(() => {
    if (attributionRef.current) {
      const links = attributionRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
      });
    }
  }, [sanitizedAttribution]);

  function nextImage() {
    const length = props.images.length;
    const nextIndex = activeIndex + 1;
    if (nextIndex >= length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(nextIndex);
    }
  }

  function prevImage() {
    const prevIndex = activeIndex - 1;
    setActiveIndex(prevIndex < 0 ? props.images.length - 1 : prevIndex);
  }

  function switchImageTo(index) {
    setActiveIndex(index);
  }

  function selectedDot(index, activeIndex) {
    if (index === activeIndex) {
      return 'selected carousel-button';
    } else {
      return 'carousel-button';
    }
  }

  function Dots() {
    return props.images.map((image, index) => (
      <button key={index} className={selectedDot(index, activeIndex)} onClick={() => switchImageTo(index)} />
    ));
  }

  const imageId = uuidv4();

  return (
    <div className="container me-auto">
      <div className='box align-items-stretch'>
        <button title="View previous image" className='d-flex align-items-center btn btn-outline-light px-1 py-0' onClick={prevImage}><i className='fa-solid fa-angle-left blue' /></button>
        <div className='d-flex flex-column justify-content-center'>
          <a title="View full image" href="#" data-bs-toggle="modal" data-bs-target={`#fullImageModal${imageId}`}><img src={props.images[activeIndex].getUrl()} className='p-2 carousel-image align-self-stretch btn btn-outline-light' alt={props.location.name} /></a>
          <div className="dots">
            <Dots />
          </div>
        </div>
        <button title="View next image" className='d-flex align-items-center btn btn-outline-light px-1 py-0' onClick={nextImage}><i className='fa-solid fa-angle-right blue'/></button>
      </div>
      <div className='mt-1 text-center'>
        <p className='small-text mb-0'>Photo credits: <span title="Google Places User Page" ref={attributionRef} dangerouslySetInnerHTML={{ __html: sanitizedAttribution }} /></p>
      </div>
      <div className="modal fade" id={`fullImageModal${imageId}`} tabIndex="-1" aria-labelledby="fullImageModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className='modal-box'>
              <button title="View previous image" className='d-flex align-items-center btn btn-outline-light px-1 py-0' onClick={prevImage}><i className='fa-solid fa-angle-left blue' /></button>
              <div className=' d-flex flex-column justify-content-center'>
                <a title="View original image source" href={props.images[activeIndex].getUrl()} target='_blank' rel="noreferrer"><img src={props.images[activeIndex].getUrl()} className='p-2 w-100 modal-carousel-image' alt={props.location.name} /></a>
                <div className="dots">
                  <Dots />
                </div>
              </div>
              <button title="View next image" className='d-flex align-items-center btn btn-outline-light px-1 py-0' onClick={nextImage}><i className='fa-solid fa-angle-right blue' /></button>
            </div>
            <div className='mt-1 text-center'>
              <p className='small-text mb-0'>Photo credits: <span title="Google Places User Page" ref={attributionRef} dangerouslySetInnerHTML={{ __html: sanitizedAttribution }} /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
