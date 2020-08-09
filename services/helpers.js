const getNearestTaxi = (allTaxis, params) => {
  const nearest = { taxi: null, distance: Number.MAX_SAFE_INTEGER };
  const { longitude: userLongitude, latitude: userLatitude } = params;

  allTaxis.forEach((taxi) => {
    const { latitude, longitude } = taxi.location;
    if (taxi.status !== 'available' || !taxi.active) {
      return;
    }
    if (params.color && params.color !== taxi.color) {
      return;
    }

    const distance = Math.sqrt(
      Math.abs((parseInt(userLatitude) - parseInt(latitude)) ** 2
      - (parseInt(userLongitude) - parseInt(longitude)) ** 2),
    );

    if (distance < nearest.distance) {
      nearest.taxi = taxi;
      nearest.distance = distance;
    }
  });
  return nearest.taxi;
};

const calculateRideCost = (time, distance, color) => {
  let totalCoins = time * 1 + distance * 2;
  if (color === 'pink') {
    totalCoins += 5;
  }
  return totalCoins;
};

module.exports = { getNearestTaxi, calculateRideCost };
