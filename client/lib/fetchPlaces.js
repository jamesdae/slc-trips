// export default async function fetchPlaces(locations, selectedCategory) {
//   const promises = locations.map((location, index) => {
//     return new Promise((resolve, reject) => {
//       // eslint-disable-next-line no-undef
//       const service = new google.maps.places.PlacesService(document.createElement('div'));
//       setTimeout(() => {
//         service.getDetails({ placeId: location.placeId, fields: ['name', 'geometry', 'photos', 'rating', 'url', 'user_ratings_total'] }, (newPlace, status) => {
//           // eslint-disable-next-line no-undef
//           if (status === google.maps.places.PlacesServiceStatus.OK) {
//             const newPlaceWithCategory = Object.assign({}, newPlace, { category: location.category });
//             resolve(newPlaceWithCategory);
//           } else {
//             reject(status);
//           }
//         });
//       }, index * index * 20);
//     });
//   });

//   const results = await Promise.all(promises);
//   return results;
// }

export default async function fetchPlaces(locations, selectedCategory) {
  let results = [];
  for (let i = 0; i < locations.length; i += 5) {
    const batch = locations.slice(i, i + 5);
    const promises = batch.map((location, index) => {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        setTimeout(() => {
          service.getDetails({ placeId: location.placeId, fields: ['name', 'geometry', 'photos', 'rating', 'url', 'user_ratings_total'] }, (newPlace, status) => {
            // eslint-disable-next-line no-undef
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              const newPlaceWithCategory = Object.assign({}, newPlace, { category: location.category });
              resolve(newPlaceWithCategory);
            } else {
              reject(status);
            }
          });
        }, 1000);
      });
    });
    // console.log(promises);
    results = [...results, ...await Promise.all(promises)];
  }
  return results;
}
