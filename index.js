"use strict";

const url = 'https://www.amazon.com.mx/gp/bestsellers/?ref_=nav_cs_bestsellers';

const dbFactory = require('./src/db');
const serviceFactory = require('./src/product.service.js');
const controllerFactory = require('./src/product.controller');

const db = dbFactory(':memory:');
const service = serviceFactory(db);
const controller = controllerFactory(service);


const spider = (url, callback) => {

  return controller.doRequest(url, (err, body) => {
    if (err) {
      return callback(err);
    }
    controller.save(body, callback);
  });

}

spider(url, (err) => {
  if (err) {
    console.log(err);
    process.exit();
  } else {
    console.log('Scraping Complete');
  }
});