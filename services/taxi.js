const TaxiController = require('../controllers/taxi');
const { getNearestTaxi, calculateRideCost } = require('./helpers'); 

class TaxiService{

  async bookTaxi(params) {
    // get all taxis
    const taxiModel = new TaxiController();
    const allTaxis = await taxiModel.getAllTaxis();

    // find nearest available taxi
    const nearestAvailableTaxi = getNearestTaxi(allTaxis, params);

    // update taxi status in data
    let updatedTaxi;
    if (nearestAvailableTaxi && nearestAvailableTaxi.number) {
      updatedTaxi = await taxiModel.updateOneTaxi(nearestAvailableTaxi.number, {status:'booked'});
    }
    return updatedTaxi;
  }

  async endTaxiRide(params) {

    let rideCost;
    const taxiModel = new TaxiController();

    const updateParams = {
      location: {latitude: params.latitude, longitude: params.longitude},
      status: 'available'
    };
    const updatedTaxi = await taxiModel.updateOneTaxi(params.number, updateParams);
    if (params.time && params.distanceTravelled && updatedTaxi) {
      rideCost = calculateRideCost(params.time, params.distance, updatedTaxi.color)
    } 
    return {updatedTaxi, rideCost}
  }
}

module.exports = TaxiService;