const express = require('express');
const router = express.Router();
const TaxiService = require('../services/taxi');

router.post('/bookTaxiRide', async (req, res, next) => {
  const params = req.body;
  // validate params;
  if (!(params.latitude && params.longitude)) {
    throw new Error('Invalid Params');
  }
  console.log(params);
  const taxiServiceInstance = new TaxiService();
  const bookedTaxi = await taxiServiceInstance.bookTaxi(params);
  console.log(bookedTaxi,'booledtaxi')
  let booked = false;
  if (bookedTaxi && bookedTaxi.number){
    booked=true;
  }
  res.json({status: booked, "taxi": bookedTaxi})
});

router.post('/endTaxiRide', async (req, res, next) => {
  const params = req.body;

  if (!(params.latitude && params.longitude && params.number)) {
    throw new Error('Invalid Params');
  }
  
  const taxiServiceInstance = new TaxiService();

  const { updatedTaxi, rideCost } = await taxiServiceInstance.endTaxiRide(params);
  const updateStatus = updatedTaxi ? true : false;
  res.json({status: updateStatus, taxi: updatedTaxi, rideCost})
});

module.exports = router;
