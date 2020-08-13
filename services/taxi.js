const TaxiController = require('../controllers/taxi');
const { getNearestTaxi, calculateRideCost, validateCoordinates } = require('./helpers');
const { TaxiNotBookedMsg, TaxiNotFoundError } = require('../constants');

class TaxiService {
  constructor() {
    this.TaxiModel = new TaxiController();
  }

  async bookTaxi(params) {
    // get all taxis
    const allTaxis = await this.TaxiModel.getTaxis();
    validateCoordinates(params.latitude, params.longitude);
    // find nearest available taxi
    const nearestAvailableTaxi = getNearestTaxi(allTaxis, params);

    // update taxi status in data
    let updatedTaxi;
    if (nearestAvailableTaxi && nearestAvailableTaxi.number) {
      updatedTaxi = await this.TaxiModel.updateOneTaxi(nearestAvailableTaxi.number, { status: 'booked' });
    }
    return updatedTaxi;
  }

  async endTaxiRide(params) {
    let rideCost;

    const selectedTaxi = await this.TaxiModel.getTaxis({ number: params.number });
    let message;
    if (!selectedTaxi || !selectedTaxi.length) {
      throw new Error(TaxiNotFoundError);
    }
    if (selectedTaxi[0].status !== 'booked') {
      message = TaxiNotBookedMsg;
      return { updatedTaxi: false, message };
    }

    validateCoordinates(params.latitude, params.longitude);

    const updateParams = {
      location: { latitude: parseInt(params.latitude), longitude: parseInt(params.longitude) },
      status: 'available',
    };
    const updatedTaxi = await this.TaxiModel.updateOneTaxi(params.number, updateParams);
    // if time, distance in params calculate ride cost
    if (params.time && params.distanceTravelled && updatedTaxi) {
      rideCost = calculateRideCost(params.time, params.distance, updatedTaxi.color);
      console.log('Cost of the ride:', rideCost, ' dogecoin');
    }
    return { updatedTaxi, rideCost, message };
  }

  getAllAvailableTaxis() {
    return this.TaxiModel.getTaxis({ status: 'available' });
  }
}

module.exports = TaxiService;
