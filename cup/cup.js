/*
1. get advertisement from beacons using noble modules
2. PUT(RESTful API) advertisement to server
*/

// module used
var noble = require('noble')
var request = require('request')

var advData
var method = 'PUT'
var url = 'http://127.0.0.1:3000'
var isDuplicate = true
var options = {
  headers: {'Connection': 'close'},
  url: url,
  method: method,
  json: true,
  body: advData
}

// fe9a is the service uuid of estimote proximity beacon
noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning('fe9a', isDuplicate)
  } else {
    noble.stopScanning()
  }
})

noble.on('discover', function (peripheral) {
  // send PUT request to specific URL
  request(options, callback)

  // print out advertisement
  console.log('Scanned a beacons advertisement:')
  console.log('\tRSSI = ' + peripheral.rssi)
  console.log('\tDistances ver1 = ' + countDistanceV1(peripheral.rssi) + ' meter')
  console.log('\tDistances ver2 = ' + countDistanceV2(peripheral.rssi) + ' meter')
  // console.log(peripheral.advertisement.serviceData)

/*
  console.log('peripheral discovered (' + peripheral.id +
              ' with address <' + peripheral.address +  ', ' + peripheral.addressType + '>,' +
              ' connectable ' + peripheral.connectable + ',' +
              ' RSSI ' + peripheral.rssi + ':');
  console.log('\thello my local name is:');
  console.log('\t\t' + peripheral.advertisement.localName);
  console.log('\tcan I interest you in any of the following advertised services:');
  console.log('\t\t' + JSON.stringify(peripheral.advertisement.serviceUuids));

  var serviceData = peripheral.advertisement.serviceData;
  if (serviceData && serviceData.length) {
    console.log('\there is my service data:');
    for (var i in serviceData) {
      console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
    }
  }
  if (peripheral.advertisement.manufacturerData) {
    console.log('\there is my manufacturer data:');
    console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
  }
  if (peripheral.advertisement.txPowerLevel !== undefined) {
    console.log('\tmy TX power level is:');
    console.log('\t\t' + peripheral.advertisement.txPowerLevel);
  }
*/
  console.log()
})

// get response if have any comment from web application
// 200 OK, 201 CREATED, 202 ACCEPTED
function callback (error, response, data) {
  if (!error && response.statusCode === (200 || 202)) {
    console.log('Info :\n', data)
  }
}

// method 1
function countDistanceV1 (rs) {
  var txpower = -72.0

  if (rs === 0) {
    return -1.0
  }

  var ratio = rs * 1.0 / txpower
  if (ratio < 1.0) {
    return Math.pow(ratio, 10)
  } else {
    var d = (0.89976) * Math.pow(ratio, 7.7095) + 0.111
    return d
  }
}

// method 2
function countDistanceV2 (rs) {
  var txpower = -72.0
  var n = 2 // Environmental attenuation factor(2 -> in free space)
  if (rs === 0) {
    return -1.0
  }

  return Math.pow(10, (txpower - rs) / (10 * n))
}
