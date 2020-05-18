"use strict";

const sqlite3 = require('sqlite3').verbose();

module.exports = (dbName) => {
  const db = {};

  db.saveProducts = (products, cb) => {

    const dbConn = conn(dbName);
    runInserts(dbConn, products, cb);
    dbConn.close();

  };

  db.getProducts = (dbConn) => {
    fetchData(dbConn);
  }

  return db;
}

const runInserts = (dbInstance, products, cb) => {

  dbInstance.serialize(() => {

    dbInstance.run("CREATE TABLE categories (name TEXT)");
    dbInstance.run("CREATE TABLE products (name TEXT, author TEXT, category INTEGER, ratingValue TEXT, ratingTotal TEXT)");

    const stmtCategories = dbInstance.prepare("INSERT INTO categories VALUES (?)");
    const stmtProducts = dbInstance.prepare("INSERT INTO products VALUES (?,?,?,?,?)");

    for (let i = 0; i < products.length; i++) {
      stmtCategories.run(products[i].category);

      const categoryId = i + 1;
      const list = products[i].products;

      for (let i = 0; i < list.length; i++) {
        stmtProducts.run(list[i].name, list[i].author, categoryId, list[i].rating.value, list[i].rating.total);
      }

    }

    stmtCategories.finalize();
    stmtProducts.finalize();

    cb(dbInstance);

  });

}

const fetchData = (dbInstance) => {
  
  dbInstance.serialize(() => {

    const query = `SELECT c.name category, p.name, p.author, p.ratingValue, p.ratingTotal 
      FROM categories c 
      INNER JOIN products p ON p.category = c.rowid`;

    dbInstance.all(query, (err, row) => {
        console.log('Showing rows from database');
        console.log(row);

      })

  })

}

const conn = (dbName) => {

  const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Connected to the ${dbName} SQlite database.`);
  });

  return db;

}