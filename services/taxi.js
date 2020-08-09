const TaxiController = require('../controllers/taxi');
const { getNearestTaxi, calculateRideCost } = require('./helpers'); 

class TaxiService{
  constructor() {
    this.TaxiModel =  new TaxiController();
  }
  async bookTaxi(params) {
    // get all taxis
    const allTaxis = await this.TaxiModel.getAllTaxis();

    // find nearest available taxi
    const nearestAvailableTaxi = getNearestTaxi(allTaxis, params);

    // update taxi status in data
    let updatedTaxi;
    if (nearestAvailableTaxi && nearestAvailableTaxi.number) {
      updatedTaxi = await this.TaxiModel.updateOneTaxi(nearestAvailableTaxi.number, {status:'booked'});
    }
    return updatedTaxi;
  }

  async endTaxiRide(params) {

    let rideCost;

    const updateParams = {
      location: {latitude: params.latitude, longitude: params.longitude},
      status: 'available'
    };
    const updatedTaxi = await this.TaxiModel.updateOneTaxi(params.number, updateParams);
    if (params.time && params.distanceTravelled && updatedTaxi) {
      rideCost = calculateRideCost(params.time, params.distance, updatedTaxi.color);
      console.log("Cost of the ride:", rideCost)
    } 
    return {updatedTaxi, rideCost}
  }

  getAllAvailableTaxis() {
    return this.TaxiModel.getAllTaxis({status: 'available'});
  }
}

module.exports = TaxiService;