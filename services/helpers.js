const getNearestTaxi = (allTaxis, params) => {
  let nearest = {taxi:null, distance:  Number.MAX_SAFE_INTEGER}
  const {longitude: userLongitude, latitude: userLatitude} = params;
  console.log(allTaxis);

  allTaxis.forEach((taxi) => {
    const {latitude, longitude} = taxi.location;
    console.log(taxi,1)
    if (taxi.status !== 'available' || !taxi.active) {
      console.log('sdasa')
      return;
    }
    if (params.color && params.color !== taxi.color) {
      console.log('ooo')
      return;
    }
    console.log(latitude, longitude,userLatitude, userLongitude)

    const distance = Math.sqrt( Math.abs(Math.pow((userLatitude-latitude),2) - Math.pow((userLongitude-longitude),2)));
    console.log(distance,'distance')
    if (distance < nearest.distance) {
      nearest.taxi = taxi;
      nearest.distance = distance;
    }
  })
  console.log(nearest,'909')
  return nearest.taxi;
}

const calculateRideCost = (time, distance, color) => {
  let totalCoins = time*1 + distance*2;
  if (color === 'pink') {
    totalCoins += 5;
  }
  return totalCoins;
}

module.exports= {getNearestTaxi, calculateRideCost}