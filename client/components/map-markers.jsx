/* global google */

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
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 9,
      center,
      mapId: process.env.MAP_ID
    });
    this.props.place.forEach((location, index) => {
      const div = document.createElement('div');
      div.classList.add('location', 'd-flex', 'justify-content-center');
      const root = ReactDOM.createRoot(div);
      root.render(getIconsAndDetails(location));
      const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
        map,
        content: div,
        position: location.geometry.location,
        title: location.name
      });
      const element = advancedMarkerView.element;
      element.addEventListener('mouseenter', () => {
        advancedMarkerView.content.classList.add('highlight', 'hidden-box');
        advancedMarkerView.element.style.zIndex = 1;
      });
      element.addEventListener('mouseleave', () => {
        advancedMarkerView.content.classList.remove('highlight', 'hidden-box');
        advancedMarkerView.element.style.zIndex = '';
      });
      advancedMarkerView.addListener('click', event => {
        this.props.openExtraDetailsForId(location.locationId);
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clickedCategory !== this.props.clickedCategory || (this.props.extraDetailsOpen === false && prevProps.extraDetailsOpen === true && this.props.viewingIds === null) || this.props.viewingIds === null) {
      let center;
      if (this.props.clickedCategory !== 'All Categories') {
        const index = this.props.place.findIndex(location => location.category === this.props.clickedCategory);
        center = this.props.place[index].geometry.location;
      } else {
        center = this.props.place[0].geometry.location;
      }
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center,
        mapId: process.env.MAP_ID
      });
      this.props.place.forEach((location, index) => {
        if (location.category === this.props.clickedCategory || this.props.clickedCategory === 'All Categories') {
          const div = document.createElement('div');
          div.classList.add('location', 'd-flex', 'justify-content-center');
          const root = ReactDOM.createRoot(div);
          root.render(getIconsAndDetails(location));
          const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
            map,
            content: div,
            position: location.geometry.location,
            title: location.name
          });
          const element = advancedMarkerView.element;
          element.addEventListener('mouseenter', () => {
            advancedMarkerView.content.classList.add('highlight', 'hidden-box');
            advancedMarkerView.element.style.zIndex = 1;
          });
          element.addEventListener('mouseleave', () => {
            advancedMarkerView.content.classList.remove('highlight', 'hidden-box');
            advancedMarkerView.element.style.zIndex = '';
            advancedMarkerView.content.classList.remove('highlight', 'hidden-box');
            advancedMarkerView.element.style.zIndex = '';
          });
          advancedMarkerView.addListener('click', event => {
            this.props.openExtraDetailsForId(location.locationId);
          });
        }
      });
    } else if (prevProps.viewingIds !== this.props.viewingIds && this.props.viewingIds !== null) {
      let center;
      if (this.props.viewingIds === false) {
        center = this.props.place[0].geometry.location;
      } else {
        const index = this.props.place.findIndex(location => location.locationId === this.props.viewingIds[0]);
        center = this.props.place[index].geometry.location;
      }
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center,
        mapId: process.env.MAP_ID
      });
      if (this.props.viewingIds === false) return;
      this.props.place.forEach((location, index) => {
        if (this.props.viewingIds !== null && this.props.viewingIds.length === 1 && location.locationId === this.props.viewingIds[0]) {
          const div = document.createElement('div');
          div.classList.add('location', 'd-flex', 'justify-content-center');
          const root = ReactDOM.createRoot(div);
          root.render(getIconsAndDetails(location));
          const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
            map,
            content: div,
            position: location.geometry.location,
            title: location.name
          });
          const element = advancedMarkerView.element;
          element.addEventListener('mouseenter', () => {
            advancedMarkerView.content.classList.add('highlight', 'hidden-box');
            advancedMarkerView.element.style.zIndex = 1;
          });
          element.addEventListener('mouseleave', () => {
            advancedMarkerView.content.classList.remove('highlight', 'hidden-box');
            advancedMarkerView.element.style.zIndex = '';
            advancedMarkerView.content.classList.remove('highlight', 'hidden-box');
            advancedMarkerView.element.style.zIndex = '';
          });
          advancedMarkerView.addListener('click', event => {
            this.props.openExtraDetailsForId(location.locationId);
          });
        }
      });
      if (this.props.viewingIds.length < 2) return;
      const mappedIds = [];
      this.props.viewingIds.forEach(id => {
        mappedIds.push(this.props.place.find(location => location.locationId === id));
      });

      const directionsDisplay = new google.maps.DirectionsRenderer();
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
        provideRouteAlternatives: true,
        travelMode: 'DRIVING'
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          directionsDisplay.setDirections(result);
          const panelDiv = document.getElementById('panel');
          while (panelDiv.firstChild) {
            panelDiv.removeChild(panelDiv.firstChild);
          }
          directionsDisplay.setPanel(panelDiv);
          result.routes.forEach((route, index) => {

            const line = new google.maps.Polyline({
              path: route.overview_path,
              strokeColor: '#595f65',
              strokeOpacity: 0.7,
              strokeWeight: 3,
              clickable: true
            });
            const infowindow = new google.maps.InfoWindow({
              ariaLabel: 'duration',
              content: `Route ${index + 1} | Distance: ${route.legs[0].distance.text} | Duration: ${route.legs[0].duration.text}`,
              position: route.legs[0].steps[Math.round((route.legs[0].steps.length - 1) / 2)].end_location
            });
            line.addListener('mouseover', event => {
              infowindow.open(map);
            });
            line.addListener('mouseout', event => {
              infowindow.close(map);
            });
            line.addListener('click', event => {
              const routeList = document.querySelectorAll('[jsaction="directionsRouteList.selectRoute"]');
              if (index < routeList.length) {
                routeList[index].click();
              }
            });
            line.setMap(map);
          });
        }
      });
    }
  }

  render() {
    return <div className='map-container' id='map' />;
  }
}
