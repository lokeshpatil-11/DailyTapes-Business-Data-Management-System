const dbpool = require("../database/db")
//var nanoid = require('nanoid');
const bcrypt = require("./../util/bcrypt");
const jwt = require("./../util/jwt");
const generators = require("./../util/generators");

register = (data) => {
  return new Promise(async (resolve, reject) => {
    //if user info not null
    if (
      data.name.replace(/\s/g, '').length && data.name !== null &&

      data.email.replace(/\s/g, '').length && data.email.includes("@") && data.email !== null &&

      data.password.length > 3 && data.password !== null
    ) {
      //then
      var userData = data
      userData.rc_id = await generators.genAllInOne(false, false, true, 2)
      userData.rc_id = userData.rc_id.toUpperCase() + Date.now()

      //Hash the password
      var hashResponse = await bcrypt.hashPassword(userData.password)

      //if hash success
      if (hashResponse.msg) {
        userData.password = hashResponse.msg
        var jwtData = { email: data.email }

        //Generate web token
        var jwtResponse = await jwt.jwtCreate({ data: jwtData, expiry: 172800 })
        if (jwtResponse.msg) {

          //if response


          //create mySQL connection & register the user
          dbpool.getConnection(async (err, connection) => {
            if (err) {
              console.error('register - ' + data.email + ' database connection failed with error = ' + JSON.stringify(err))
              return reject({ status: 'failed', error: err, data: { bResult: false } });
            } else {
              connection.query({
                sql: 'INSERT INTO `users` (`name`, `email`, `password`, `rc_id`) VALUES (?,?,?,?);',
                timeout: 40000,
                values: [userData.name, userData.email, userData.password, userData.rc_id]
              }, async (error, results) => {
                if (error) {
                  console.error('register - ' + data.email + ' data insert failed with error = ' + JSON.stringify(error))
                  connection.release();
                  if (error.message.includes("Duplicate") && error.message.includes("email")) {
                    return resolve({ status: 'success', msg: 'email already exists', data: { bResult: false } });
                  } else {
                    return reject({ status: 'failed', error: error, data: { bResult: false } });
                  }
                } else {
                  connection.release();
                  return resolve({ status: 'success', msg: 'user registered', data: { bResult: true } });
                }
              });
            }
          })


        } else {
          console.error('register - ' + data.email + ' jwt create failed with error = ' + JSON.stringify(jwtResponse.error))
          return reject({ status: 'failed', error: jwtResponse.error, data: { bResult: false } });
        }
      } else {
        console.error('register - ' + data.email + ' hash failed with error = ' + JSON.stringify(hashResponse.error))
        return reject({ status: 'failed', error: hashResponse.error, data: { bResult: false } });
      }

    } else {
      return resolve({ status: 'success', msg: 'invalid input fields', data: { bResult: false } });
    }

  })
};

login = (data) => {
  return new Promise(async (resolve, reject) => {
    dbpool.getConnection((err, connection) => {
      if (err) {
        //authLogger.error('login - ' + data.emailorphone + ' database connection failed with error = ' + JSON.stringify(err))
        return reject({ status: 'failed', error: err, data: { bResult: false } });
      } else {
        connection.query({
          sql: 'SELECT * FROM `users` WHERE `email` = ?;',
          timeout: 40000,
          values: [data.email]
        }, async (error, results) => {
          if (error) {
            //authLogger.error('login - ' + data.emailorphone + ' data find failed of query1 with error = ' + JSON.stringify(error))
            connection.release();
            return reject({ status: 'failed', error: error, data: { bResult: false } });
          } else {
            var resultsHack = JSON.parse(JSON.stringify(results))
            if (resultsHack.length) {
              var user = resultsHack[0]

              //compare passwords
              var comparePasswordResponse = await bcrypt.comparePassword({ inputPassword: data.password, databasePassword: user.password })
              //if success
              if (comparePasswordResponse.msg) {
                var jwtData = { id: user.id }
                var jwtResponse = await jwt.jwtCreate({ data: jwtData, expiry: 31536000 })
                if (jwtResponse.msg) {
                  connection.query({
                    sql: 'UPDATE `users` SET `auth_token` = ? WHERE `id` = ?;',
                    timeout: 40000,
                    values: [jwtResponse.msg, user.id]
                  }, async (error, results) => {
                    if (error) {
                      //authLogger.error('login - ' + data.emailorphone + ' data update failed of query2 with error = ' + JSON.stringify(error))
                      connection.release();
                      return reject({ status: 'failed', error: error, data: { bResult: false } });
                    } else {
                      connection.release();
                      return resolve({ status: 'success', msg: 'login successful', data: { token: jwtResponse.msg, bResult: false } });
                    }
                  })

                } else {
                  // authLogger.error('login - ' + data.emailorphone + ' jwt create failed with error = ' + JSON.stringify(jwtResponse.error))
                  connection.release();
                  return reject({ status: 'failed', error: jwtResponse.error, data: { bResult: false } });
                }

              } else {
                connection.release();
                return resolve({ status: 'success', msg: 'password wrong', data: { bResult: false } });
              }

            } else {
              connection.release();
              return resolve({ status: 'success', msg: 'email or phone invalid', data: { bResult: false } });
            }
          }
        })
      }
    })

  })
};

verifyAuthSession = (rclt) => {
  return new Promise(async (resolve, reject) => {
      var jwtResponse = await jwt.jwtVerify(rclt)
      if (jwtResponse.msg) {
          var userId = jwtResponse.msg.data.id
          dbpool.getConnection((err, connection) => {
              if (err) {
                  return reject({ status: 'failed', error: err, data: { bResult: false } });
              } else {
                  connection.query({
                      sql: 'SELECT * FROM `users` WHERE `auth_token` = ? AND `id` = ?;',
                      timeout: 40000,
                      values: [rclt, userId]
                  }, async (error, results) => {
                      if (error) {
                          connection.release();
                          return reject({ status: 'failed', error: error, data: { bResult: false } });
                      } else {
                          var resultsHack = JSON.parse(JSON.stringify(results))
                          if (resultsHack.length) {
                              connection.release();
                              return resolve({ status: 'success', msg: 'auth session verified', data: { bResult: true } });
                          } else {
                              connection.release();
                              return resolve({ status: 'success', msg: 'no active session', data: { bResult: false } });
                          }
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
  register,
  login,
  verifyAuthSession
};
