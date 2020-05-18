import faker from 'faker';
import { describe } from 'mocha';
import { expect } from 'chai';

import { HelloWorld } from './hello-world';

const dbFactory = require('./db');
const serviceFactory = require('./product.service.js');

const db = dbFactory(':memory:');
const service = serviceFactory(db);


describe('HelloWorld', () => {
  let helloWorld: HelloWorld;

  beforeEach(() => {
    helloWorld = new HelloWorld();
  });
  it('should return Hello `$name` when we given a valid name', () => {
    const fakeName = faker.name.firstName();
    expect(helloWorld.hello(fakeName)).to.eq(`Hello ${fakeName}`);
  });
});


describe('Products Service', () => {
  let htmlWithNoProducts = '<html> This is the products page </html>';

  it('should return an array instance when try to get products info', () => {
    expect(service.getProductsInfo(htmlWithNoProducts)).to.be.instanceOf(Array);
  });

  const arrayOfProducts = [
    [
      'Libros',
      '1.',
      'El hombre en busca de sentido',
      'Viktor Emil Frankl',
      '4.8 de un máximo de 5 estrellas',
      '1,244',
      '2.',
      'El sutil arte de que te importe un carajo: Un enfoque disruptivo para vivir una buena vida (NUEVA EDICION)',
      'Mark Manson',
      '4.7 de un máximo de 5 estrellas',
      '885',
      '3.',
      'Becoming. Mi historia',
      'Michelle Obama',
      '4.6 de un máximo de 5 estrellas',
      '801'
    ]
  ];

  it('should return an array of objects with category as property', () => {
    expect(service.productsJSON(arrayOfProducts)[0]).to.have.own.property('category');
  });

  it('should return an array of objects with products as property', () => {
    expect(service.productsJSON(arrayOfProducts)[0]).to.have.own.property('products');
  });

  it('products property should be an array instance', () => {
    expect(service.productsJSON(arrayOfProducts)[0].products).to.have.to.be.instanceOf(Array);
  });

});


