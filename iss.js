const request = require('request');


const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    if (!err) {
      const ip = JSON.parse(body).ip;
      if (ip.length === 0) {
        return callback('IP not found', null);
      }
      return callback(null, ip);
    }
  });
};

const fetchCoordsByIP = function(string, callback) {
  request(`https://api.freegeoip.app/json/${string}?apikey=b6d3fe30-3dbc-11ec-8b33-735c154ffea8`, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates by IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    if (!err) {
      const data = JSON.parse(body);
      if (data.length === 0) {
        return callback('Coordinates not found', null);
      }
      const coords = {};
      coords['latitude'] = data.latitude;
      coords['longitude'] = data.longitude;
      return callback(null, coords);
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS Flyover times: ${body}`;
      callback(Error(msg), null);
      return;
    }
    if (!err) {
      const data = JSON.parse(body).response;
      if (data.length === 0) {
        return callback('Flyover times not found', null);
      }
      
      return callback(null, data);
    }
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    console.log('IP returned! :', JSON.stringify(ip));
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      console.log('Coordinates found! :', coords);
      fetchISSFlyOverTimes(coords, (error, passes) => {
        if (error) {
          return callback(error, null);
        }
        console.log('Flyover times found! :', passes);
        return callback(null, passes);
      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};