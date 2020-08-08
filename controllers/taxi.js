const { dataPath } = require('../config');
const fs = require('fs');

class TaxiController {
  constructor() {
    const env = process.env.NODE_ENV
    console.log(env,'env');
    this.dataPath = dataPath[env]
    console.log(this.dataPath,'dp')
  }

  getAllTaxis() {
    return new Promise((resolve, reject) => {
      fs.readFile(`./${this.dataPath}`, 'utf8',  (err, data) => {
        console.log(err,data)
        if (err) return reject (err);
        let taxis = JSON.parse(data);
        taxis = taxis.filter((t) => t.active === true)
        resolve(taxis);
      })
    })
  }

  async updateOneTaxi(number, newParams) {
    const taxis = await this.getAllTaxis();
    let updated;
    const modifiedData = taxis.map((taxi) => {
      if (taxi.number && taxi.number === number) {
        updated = Object.assign(taxi, newParams);
        return updated;
      } else {
        return taxi;
      }
    })
    if (updated){
      const data = JSON.stringify(modifiedData);
      fs.writeFileSync(`./${this.dataPath}`, data, 'utf8');
    }
   return updated;
  }
}

module.exports = TaxiController;