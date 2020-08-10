const fs = require('fs');
const { dataPath } = require('../config');

class TaxiController {
  constructor() {
    const env = process.env.NODE_ENV;
    this.dataPath = dataPath[env];
  }

  getAllTaxis(params = {}) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.dataPath, 'utf8', (err, data) => {
        if (err) return reject(err);
        let taxis = JSON.parse(data);
        taxis = taxis.filter((t) => {
          let isValidTaxi = true;
          Object.keys(params).forEach((key) => {
            if (params[key] !== t[key]) {
              isValidTaxi = false;
            }
          });
          if (!t.active) isValidTaxi = false;
          return isValidTaxi;
        });
        return resolve(taxis);
      });
    });
  }

  async updateOneTaxi(number, newParams) {
    const taxis = await this.getAllTaxis();
    let updated;
    const modifiedData = taxis.map((taxi) => {
      if (taxi.number && taxi.number === number) {
        updated = Object.assign(taxi, newParams);
        return updated;
      }
      return taxi;
    });
    if (updated) {
      const data = JSON.stringify(modifiedData);
      fs.writeFileSync(this.dataPath, data, 'utf8');
    }
    return updated;
  }
}

module.exports = TaxiController;
