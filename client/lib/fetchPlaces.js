/* global google */

export default async function fetchPlaces(locations, selectedCategory) {
  let results = [];
  for (let i = 0; i < locations.length; i += 7) {
    const batch = locations.slice(i, i + 7);
    const promises = batch.map((location, index) => {
      return new Promise((resolve, reject) => {
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        setTimeout(() => {
          service.getDetails({ placeId: location.placeId, fields: ['name', 'geometry', 'photos', 'rating', 'url', 'user_ratings_total', 'reviews', 'types'] }, (newPlace, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              const newPlaceWithCategory = Object.assign({}, newPlace, { category: location.category, locationId: location.locationId });
              resolve(newPlaceWithCategory);
            } else {
              reject(status);
            }
          });
        }, index * index * 55);
      });
    });
    results = [...results, ...await Promise.all(promises)];
  }
  return results;
}
