const request = require('request');

module.exports = (service) => {
  const controller = {};

  controller.doRequest = (url, callback) => {

    request({ uri: url, gzip: true }, (err, response, body) => {
      if (err) {
        return callback(err);
      }

      callback(null, body);
    });

  }

  controller.save = (body, callback) => {

    const products = service.getProductsInfo(body);
    service.saveProducts(products, service.getProducts);

    if (products.length === 0) {
      return process.nextTick(callback);
    }

    callback();
  }

  return controller;
}