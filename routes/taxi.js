const express = require('express');

const router = express.Router();
const TaxiService = require('../services/taxi');

router.post('/bookTaxiRide', (req, res, next) => {
  const params = req.body;
  // validate params;
  if (!(params.latitude && params.longitude)) {
    return next(new Error('Invalid Params'));
  }
  const taxiServiceInstance = new TaxiService();
  return taxiServiceInstance.bookTaxi(params).then((bookedTaxi) => {
    let booked = false;
    if (bookedTaxi && bookedTaxi.number) {
      booked = true;
    }
    return res.json({ status: booked, taxi: bookedTaxi });
  }).catch(next);
});

router.post('/endTaxiRide', (req, res, next) => {
  const params = req.body;

  if (!(params.latitude && params.longitude && params.number)) {
    return next(new Error('Invalid Params'));
  }

  const taxiServiceInstance = new TaxiService();

  return taxiServiceInstance.endTaxiRide(params).then((result) => {
    const { updatedTaxi, rideCost } = result;
    const updateStatus = !!updatedTaxi;
    return res.json({ status: updateStatus, taxi: updatedTaxi, rideCost });
  }).catch(next);
});

router.post('/getAllAvailableTaxis', (req, res, next) => {
  const taxiServiceInstance = new TaxiService();
  return taxiServiceInstance.getAllAvailableTaxis()
    .then((result) => res.json({ status: true, taxis: result })).catch(next);
});

module.exports = router;
