import React from 'react';
import ReactDOM from 'react-dom/client';
import { highlight, unhighlight, buildContent } from '../lib';

export default class MapMarkers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: null
    };
  }

  componentDidMount(props) {
    this.setState({ place: this.props.place });
    const center = this.props.place[0].geometry.location;
    // eslint-disable-next-line no-undef
    const map = new google.maps.Map(document.getElementById('map'), { // new map is made where element has id of 'map', which is the element returned by this component's render()
      zoom: 9,
      center,
      mapId: process.env.MAP_ID
    });

    this.props.place.forEach((location, index) => { // after component mounts, a map is made, and each location from App's state 'place' gets an AdvancedMarker made using its coordinates and title
      const div = document.createElement('div');
      div.classList.add('location');
      const root = ReactDOM.createRoot(div);
      root.render(buildContent(location));
      // eslint-disable-next-line no-undef
      const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
        map,
        content: div,
        position: location.geometry.location,
        title: location.name
      });
      const element = advancedMarkerView.element;
      element.addEventListener('mouseenter', () => {
        highlight(advancedMarkerView, location);
      });

      element.addEventListener('mouseleave', () => {
        unhighlight(advancedMarkerView, location);
      });

      advancedMarkerView.addListener('click', event => {
        unhighlight(advancedMarkerView, location);
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.place !== this.props.place) {
      this.setState({ place: this.props.place });
      const center = this.props.place[0].geometry.location;
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(document.getElementById('map'), { // new map is made where element has id of 'map', which is the element returned by this component's render()
        zoom: 9,
        center,
        mapId: process.env.MAP_ID
      });

      this.props.place.forEach((location, index) => { // after component mounts, a map is made, and each location from App's state 'place' gets an AdvancedMarker made using its coordinates and title
        const div = document.createElement('div');
        div.classList.add('location');
        const root = ReactDOM.createRoot(div);
        root.render(buildContent(location));
        // eslint-disable-next-line no-undef
        const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
          map,
          content: div,
          position: location.geometry.location,
          title: location.name
        });
        const element = advancedMarkerView.element;
        element.addEventListener('mouseenter', () => {
          highlight(advancedMarkerView, location);
        });

        element.addEventListener('mouseleave', () => {
          unhighlight(advancedMarkerView, location);
        });

        advancedMarkerView.addListener('click', event => {
          unhighlight(advancedMarkerView, location);
        });
      });
    }
  }

  render() {
    return <div className='map-container' id='map'/>; // this will contain the map, and be where MapMarkers tag is in places-map
  }
}
