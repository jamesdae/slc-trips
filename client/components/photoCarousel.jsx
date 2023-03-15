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
        <i className='fa-solid fa-angle-left blue pointer' onClick={prevImage}/>
        <div className='center d-flex flex-column justify-content-center'>
          <a title="View original source of image" href={props.images[activeIndex].getUrl()} target="_blank" rel="noopener noreferrer"><img src={props.images[activeIndex].getUrl()} className='p-2 carouselimg align-self-stretch' alt={props.location.name} /></a>
          <div className="dots">
            <Dots />
          </div>
        </div>
        <i className='fa-solid fa-angle-right blue pointer' onClick={nextImage}/>
      </div>
      <div className='mt-1 text-center'>
        <p className='smalltext'>Photo credits: <span ref={attributionRef} dangerouslySetInnerHTML={{ __html: sanitizedAttribution }} /></p>
      </div>
    </div>
  );
}
