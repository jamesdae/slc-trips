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
    if (prevProps.clickedCategory !== this.props.clickedCategory || (this.props.extraDetailsOpen === false && prevProps.extraDetailsOpen === true && this.props.viewingId === null) || this.props.viewingId === null) {
      let center;
      if (this.props.clickedCategory !== 'All Categories') {
        const index = this.props.place.findIndex(location => location.category === this.props.clickedCategory);
        center = this.props.place[index].geometry.location;
      } else {
        center = this.props.place[0].geometry.location;
      }
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center,
        mapId: process.env.MAP_ID
      });
      this.props.place.forEach((location, index) => {
        if (location.category === this.props.clickedCategory || this.props.clickedCategory === 'All Categories') {
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
        }
      });
    } else if (prevProps.viewingId !== this.props.viewingId && this.props.viewingId !== null) {
      let center;
      if (this.props.viewingId === false) {
        center = this.props.place[0].geometry.location;
      } else {
        const index = this.props.place.findIndex(location => location.locationId === this.props.viewingId[0]);
        center = this.props.place[index].geometry.location;
      }
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center,
        mapId: process.env.MAP_ID
      });
      if (this.props.viewingId === false) return;
      this.props.place.forEach((location, index) => {
        if (this.props.viewingId !== null && this.props.viewingId.length === 1 && location.locationId === this.props.viewingId[0]) {
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
        }
      });

      if (this.props.viewingId.length < 2) return;

      const mappedIds = [];
      this.props.viewingId.forEach(id => {
        mappedIds.push(this.props.place.find(location => location.locationId === id));
      });

      // eslint-disable-next-line no-undef
      const directionsDisplay = new google.maps.DirectionsRenderer();
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      directionsDisplay.setMap(map);

      const start = mappedIds[0].geometry.location;
      const end = mappedIds[mappedIds.length - 1].geometry.location;

      const request = {
        origin: start,
        waypoints: mappedIds.slice(1, mappedIds.length - 1).map(location => {
          return { location: location.geometry.location };
        }),
        destination: end,
        travelMode: 'DRIVING'
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          directionsDisplay.setDirections(result);
          // eslint-disable-next-line no-console
          console.log(result);
        }
        directionsDisplay.setPanel(document.getElementById('panel'));
      });
    }
  }

  render() {
    return <div className='map-container' id='map'/>;
  }
}
