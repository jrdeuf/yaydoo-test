"use strict";

const cheerio = require('cheerio');

module.exports = (db) => {
  const service = {};

  service.getProductsInfo = (body) => {
    const html = cheerio.load(body)('#zg_left_col1');
    
    if(!html.children().length) {
      return [];
    }

    // Text cleaning
    const products = html.children('.zg_homeWidget').text().split("\n").filter(el => el.trim() && !el.includes('Ver más')).map(el => el.trim());
    const blocks = categorySets(products);

    return service.productsJSON(blocks);
  }

  service.productsJSON = (blocks) => {
    const productsAndCategories = [];

    for (const item of blocks) {
      if (!item.length) continue;

      const [category] = item;
      const products = [];
      let singleProduct;

      for (let i = 1; i < 4; i++) { // 3 top products
        if (i < 3) {
          singleProduct = item.slice(item.indexOf(`${i}.`) + 1, item.indexOf(`${i + 1}.`));
        } else {
          singleProduct = item.slice(item.indexOf(`${i}.`) + 1);
        }

        const productHasAuthor = singleProduct.length > 3; // not all products are books

        products.push({
          name: singleProduct[0],
          author: productHasAuthor ? singleProduct[1] : '',
          rating: {
            value: productHasAuthor ? singleProduct[2] : singleProduct[1],
            total: productHasAuthor ? singleProduct[3] : singleProduct[2],
          }
        });
      }

      productsAndCategories.push({
        category,
        products
      })
    }

    console.log('JSON Products');
    console.log(productsAndCategories);

    return productsAndCategories;
  }

  service.saveProducts = (products, cb) => db.saveProducts(products, cb);

  service.getProducts = db.getProducts;

  return service;
}

const categorySets = (products) => {
  const markers = products.map((e, i) => e === '1.' ? i : undefined).filter(x => x);

  const blocks = [];

  markers.forEach((val, index, ar) => {
    let nextVal = ar[index + 1];
    blocks.push(products.slice(val - 1, (nextVal - 1)));
  });

  return blocks;
}