import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

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
      return 'selected button';
    } else {
      return 'button';
    }
  }

  function Dots() {
    return props.images.map((image, index) => (
      <button key={index} className={selectedDot(index, activeIndex)} onClick={() => switchImageTo(index)} />
    ));
  }

  return (
    <div className="container me-auto">
      <div className='box'>
        <div className='d-flex align-items-center pointer h-75 btn btn-outline-light px-1 py-0' onClick={prevImage}>
          <i className='fa-solid fa-angle-left blue' />
        </div>
        <div className='center d-flex flex-column justify-content-center'>
          <a title="View full image" href="#" data-bs-toggle="modal" data-bs-target={`#fullImageModal${activeIndex}`}><img src={props.images[activeIndex].getUrl()} className='p-2 carouselimg align-self-stretch' alt={props.location.name} /></a>
          <div className="dots">
            <Dots />
          </div>
        </div>
        <div className='d-flex align-items-center pointer h-75 btn btn-outline-light px-1 py-0' onClick={nextImage}>
          <i className='fa-solid fa-angle-right blue pointer'/>
        </div>
      </div>
      <div className='mt-1 text-center'>
        <p className='smalltext mb-0'>Photo credits: <span ref={attributionRef} dangerouslySetInnerHTML={{ __html: sanitizedAttribution }} /></p>
      </div>
      <div className="modal fade" id={`fullImageModal${activeIndex}`} tabIndex="-1" aria-labelledby="fullImageModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-100">
            <div className="modal-body d-flex flex-column align-items-center">
              <img src={props.images[activeIndex].getUrl()} className='w-100' alt={props.location.name} />
              <p className='mb-0 mt-2'>Photo credits: <span ref={attributionRef} dangerouslySetInnerHTML={{ __html: sanitizedAttribution }} /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
