const dbpool = require("../database/db")

var users_table = `CREATE TABLE users (  
    id INT AUTO_INCREMENT PRIMARY KEY,  
    name VARCHAR(100) NOT NULL,  
    email VARCHAR(50) NOT NULL UNIQUE,  
    password VARCHAR(256) NOT NULL,
    rc_id VARCHAR(50) NOT NULL UNIQUE,
    auth_token VARCHAR(256) DEFAULT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`

var product_card_table = `CREATE TABLE product_cards(
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(256) NOT NULL,
  product_desc VARCHAR(256),
  product_price INT NOT NULL,
  product_qty INT NOT NULL,
  product_mfg DATE NOT NULL,
  product_expiry DATE NOT NULL,
  userId INT NOT NULL,
      CONSTRAINT user_id
      FOREIGN KEY (userId)
      REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);`
dbpool.getConnection(async (err, connection) => {
  if (err) {
    connection.release()
    console.log('database connection failed' + err)
  } else {
    connection.query(product_card_table, async (error, results) => {
      if (error) {
        connection.release()
        console.log(error)
      } else {
        connection.release()
        console.log(results)
      }
    });
  }
})

//node queries.js