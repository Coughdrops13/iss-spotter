const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log('Retrieval of IP failed:', error);
//     return;
//   } else {
//     console.log('It worked! Returned IP:', JSON.stringify(ip));
//   }
// });

// fetchCoordsByIP("108.173.80.114", (error, data) => {
//   console.log(error, data);
// });

// fetchISSFlyOverTimes({latitude: 53.5546, longitude: -113.3014}, (error, passes) => {
//   if (error) {
//     console.log('Retrieval of passes failed:', error);
//     return;
//   } else {
//     console.log('It worked! Passes:', passes);
//   }
// });

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log(`It didn't work!`, error);
  }
  printPassTimes(passTimes);
});

