/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const TaxiService = require('../services/taxi');
const {
  TaxiNotAvailableMsg, TaxiNotFoundError,
  TaxiNotBookedMsg, InvalidParamsError,
  InvalidCoordinatesError,
} = require('../constants');

const app = require('../app');

const taxiServiceInstance = new TaxiService();

chai.use(chaiHttp);
const { expect } = chai;

describe('It should test taxi service', () => {
  it('should return all available taxis', (done) => {
    taxiServiceInstance.getAllAvailableTaxis().then((allTaxis) => {
      expect(allTaxis.length).to.eq(3);
      expect(allTaxis[0].status).to.eq('available');
      done();
    });
  });
});

describe('it should test taxi apis', () => {
  let bookedTaxi;
  it('should book the nearest taxi', (done) => {
    const params = { longitude: 14, latitude: 33, color: 'pink' };
    chai.request(app).post('/bookTaxiRide').send(params).end((err, res) => {
      expect(res.status).to.eq(200);
      const result = res.body;
      bookedTaxi = result.taxi.number;
      expect(result.status).to.eq(true);
      expect(result.taxi.number).to.eq('124');
      expect(result.taxi.status).to.eq('booked');
      done();
    });
  });
  it('should give status false and Taxi not available message', (done) => {
    const params = { longitude: 14, latitude: 33, color: 'pink' };
    chai.request(app).post('/bookTaxiRide').send(params).end((err, res) => {
      expect(res.status).to.eq(200);
      const result = res.body;
      expect(result.status).to.eq(false);
      expect(result.message).to.eq(TaxiNotAvailableMsg);
      done();
    });
  });
  it('should throw invalid params', (done) => {
    const params = { longitude: 41, color: 'pink' };
    chai.request(app).post('/bookTaxiRide').send(params).end((err, res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq(InvalidParamsError);
      done();
    });
  });
  it('should give Invalid coordinates error', (done) => {
    const params = { longitude: 15, latitude: 190, number: bookedTaxi };
    chai.request(app).post('/endTaxiRide').send(params).end((err, res) => {
      expect(res.status).to.eq(400);
      const result = res.body;
      expect(result.error).to.eq(InvalidCoordinatesError);
      done();
    });
  });

  it('should end taxi ride', (done) => {
    const params = { longitude: 15, latitude: 44, number: bookedTaxi };
    chai.request(app).post('/endTaxiRide').send(params).end((err, res) => {
      expect(res.status).to.eq(200);
      const result = res.body;
      expect(result.status).to.eq(true);
      expect(result.taxi.number).to.eq('124');
      expect(result.taxi.status).to.eq('available');
      done();
    });
  });
  it('should throw invalid params', (done) => {
    const params = { longitude: 41, latitude: 44 };
    chai.request(app).post('/endTaxiRide').send(params).end((err, res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq(InvalidParamsError);
      done();
    });
  });
  it('should throw Taxi not found message for wrong taxi number', (done) => {
    const params = { longitude: 15, latitude: 44, number: '111' };
    chai.request(app).post('/endTaxiRide').send(params).end((err, res) => {
      expect(res.status).to.eq(400);
      const result = res.body;
      expect(result.error).to.eq(TaxiNotFoundError);
      done();
    });
  });
  it('should should give taxi not booked yet in endTaxiRide route if taxi is in available state', (done) => {
    const params = { longitude: 15, latitude: 44, number: '123' };
    chai.request(app).post('/endTaxiRide').send(params).end((err, res) => {
      expect(res.status).to.eq(200);
      const result = res.body;
      expect(result.status).to.eq(false);
      expect(result.message).to.eq(TaxiNotBookedMsg);
      done();
    });
  });
});
