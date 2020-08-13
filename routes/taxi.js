const express = require('express');

const router = express.Router();
const TaxiService = require('../services/taxi');
const { EndRideFailedMsg, TaxiNotAvailableMsg, InvalidParamsError } = require('../constants');

router.post('/bookTaxiRide', (req, res, next) => {
  const params = req.body;
  // validate params;
  if (!(params.latitude && params.longitude)) {
    return next(new Error(InvalidParamsError));
  }

  const taxiServiceInstance = new TaxiService();
  // call book ride service
  return taxiServiceInstance.bookTaxi(params).then((bookedTaxi) => {
    let booked = true;
    let message;
    if (!(bookedTaxi && bookedTaxi.number)) {
      booked = false;
      message = TaxiNotAvailableMsg;
    }
    return res.json({ status: booked, taxi: bookedTaxi, message });
  }).catch(next);
});

router.post('/endTaxiRide', (req, res, next) => {
  const params = req.body;

  if (!(params.latitude && params.longitude && params.number)) {
    return next(new Error(InvalidParamsError));
  }

  const taxiServiceInstance = new TaxiService();
  // call end ride service
  return taxiServiceInstance.endTaxiRide(params).then((result) => {
    const { updatedTaxi, rideCost, message: errMsg } = result;
    const updateStatus = !!updatedTaxi;
    let message;
    if (!updatedTaxi) {
      message = errMsg || EndRideFailedMsg;
    }
    return res.json({
      status: updateStatus, taxi: updatedTaxi, rideCost, message,
    });
  }).catch(next);
});

router.post('/getAllAvailableTaxis', (req, res, next) => {
  const taxiServiceInstance = new TaxiService();
  return taxiServiceInstance.getAllAvailableTaxis()
    .then((result) => res.json({ status: true, taxis: result })).catch(next);
});

module.exports = router;
