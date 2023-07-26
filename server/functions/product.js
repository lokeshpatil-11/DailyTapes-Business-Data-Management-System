const dbpool = require("../database/db")
const jwt = require("./../util/jwt");
addProductCard = (data, rclt) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(rclt)
        if (jwtResponse.msg) {
            var userId = jwtResponse.msg.data.id
            dbpool.getConnection((err, connection) => {
                if (err) {
                    return reject({ status: 'failed', error: err, data: { bResult: false } });
                } else {
                    connection.query({
                        sql: 'SELECT * FROM `product_cards` WHERE `userId`=?;',
                        timeout: 40000,
                        values: [userId]
                    }, async (error, results) => {
                        if (error) {
                            connection.release();
                            return reject({ status: 'failed', error: error, data: { bResult: false } });
                        } else {

                            connection.query({
                                sql: 'INSERT INTO `product_cards` (`product_name`, `product_desc`, `product_price`, `product_qty`, `product_mfg`, `product_expiry`, `userId`) VALUES(?,?,?,?,?,?,?)',
                                timeout: 40000,
                                values: [data.product_name, data.product_desc, data.product_price, data.product_qty, data.product_mfg, data.product_expiry, userId]
                            }, async (error, results) => {
                                if (error) {
                                    connection.release();
                                    return reject({ status: 'failed', error: error, data: { bResult: false } });
                                } else {
                                    connection.release();
                                    return resolve({ status: 'success', msg: 'card added', data: { bResult: true } });
                                }
                            });
                        }
                    });
                }
            })
        } else {
            return reject({ status: 'failed', error: jwtResponse.error, data: { bResult: false } });
        }
    })
};
fetchProductCards = (rclt) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(rclt)
        if (jwtResponse.msg) {
            var userId = jwtResponse.msg.data.id
            dbpool.getConnection((err, connection) => {
                if (err) {
                    return reject({ status: 'failed', error: err, data: { bResult: false } });
                } else {
                    connection.query({
                        sql: 'SELECT `product_name`, `product_desc`, `product_price`, `product_qty`, `product_mfg`, `product_expiry` FROM `product_cards` where `userId`=?',
                        timeout: 40000,
                        values: [userId]
                    }, async (error, results) => {
                        if (error) {
                            connection.release();
                            return reject({ status: 'failed', error: error, data: { bResult: false } });
                        } else {
                            var resultsHack = JSON.parse(JSON.stringify(results))
                            connection.release();
                            return resolve({ status: 'success', msg: 'cards fetched', data: { cards: resultsHack, bResult: true } });
                        }
                    });
                }
            })
        } else {
            return reject({ status: 'failed', error: jwtResponse.error, data: { bResult: false } });
        }
    })
};

module.exports = {
    addProductCard,
    fetchProductCards
}