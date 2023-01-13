export default function fetchPlaces(locations, selectedCategory) {
  const filteredArray = locations.filter(location => {
    return (location.category === selectedCategory || selectedCategory === 'All Categories');
  });

  const promises = filteredArray.map((location, index) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({ placeId: location.placeId, fields: ['name', 'geometry', 'photos', 'types', 'rating', 'url', 'user_ratings_total'] }, (newPlace, status) => {
          // eslint-disable-next-line no-undef
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const newPlaceWithCategory = Object.assign({}, newPlace, { category: location.category });
            resolve(newPlaceWithCategory);
          } else {
            reject(status);
          }
        });
      }, index * index * 18);
    });

  });
  return Promise.all(promises);
}
