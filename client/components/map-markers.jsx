import React from 'react';
import ReactDOM from 'react-dom/client';
import { getIconsAndDetails } from '../lib';

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
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 9,
      center,
      mapId: process.env.MAP_ID
    });

    this.props.place.forEach((location, index) => {
      const div = document.createElement('div');
      div.classList.add('location', 'd-flex', 'justify-content-center', 'p-4');
      const root = ReactDOM.createRoot(div);
      root.render(getIconsAndDetails(location));
      // eslint-disable-next-line no-undef
      const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
        map,
        content: div,
        position: location.geometry.location,
        title: location.name
      });
      const element = advancedMarkerView.element;
      element.addEventListener('mouseenter', () => {
        advancedMarkerView.content.classList.add('highlight', 'hiddenbox');
        advancedMarkerView.element.style.zIndex = 1;
      });

      element.addEventListener('mouseleave', () => {
        advancedMarkerView.content.classList.remove('highlight', 'hiddenbox');
        advancedMarkerView.element.style.zIndex = '';
      });

      advancedMarkerView.addListener('click', event => {
        advancedMarkerView.content.classList.remove('highlight', 'hiddenbox');
        advancedMarkerView.element.style.zIndex = '';
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.place !== this.props.place) {
      this.setState({ place: this.props.place });
      const center = this.props.place[0].geometry.location;
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center,
        mapId: process.env.MAP_ID
      });

      this.props.place.forEach((location, index) => {
        const div = document.createElement('div');
        div.classList.add('location', 'd-flex', 'justify-content-center', 'p-4');
        const root = ReactDOM.createRoot(div);
        root.render(getIconsAndDetails(location));
        // eslint-disable-next-line no-undef
        const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
          map,
          content: div,
          position: location.geometry.location,
          title: location.name
        });
        const element = advancedMarkerView.element;
        element.addEventListener('mouseenter', () => {
          advancedMarkerView.content.classList.add('highlight', 'hiddenbox');
          advancedMarkerView.element.style.zIndex = 1;
        });

        element.addEventListener('mouseleave', () => {
          advancedMarkerView.content.classList.remove('highlight', 'hiddenbox');
          advancedMarkerView.element.style.zIndex = '';
          advancedMarkerView.content.classList.remove('highlight', 'hiddenbox');
          advancedMarkerView.element.style.zIndex = '';
        });

        advancedMarkerView.addListener('click', event => {
          advancedMarkerView.content.classList.remove('highlight', 'hiddenbox');
          advancedMarkerView.element.style.zIndex = '';
        });
      });
    }
  }

  render() {
    return <div className='map-container' id='map'/>;
  }
}