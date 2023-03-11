import React from 'react';
import EachCard from './each-card';

export default function LocationCards(props) {
  if (props.place) {
    const list = props.place.map((location, index) => {
      if (location.category === props.clickedCategory || props.clickedCategory === 'All Categories') {
        return <EachCard location={location} key={index} tab="places" user={props.user} addCard={props.addCard} viewCard={props.viewCard} />;
      } else return null;
    });
    return list;
  } else {
    return null;
  }
}
