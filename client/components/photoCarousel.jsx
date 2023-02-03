import React, { useState } from 'react';

export default function Carousel(props) {
  const [activeIndex, setActiveIndex] = useState(0);

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
        <i className='fa-solid fa-angle-left blue' onClick={prevImage}/>
        <div className='center'>
          <img src={props.images[activeIndex].getUrl()} className='p-2 carouselimg align-self-center align-self-md-stretch' />
          <div className="dots">
            <Dots />
          </div>
        </div>
        <i className='fa-solid fa-angle-right blue' onClick={nextImage}/>
      </div>
    </div>
  );
}
