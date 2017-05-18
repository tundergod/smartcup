/*
1. get advertisement from beacons using noble modules
2. PUT(RESTful API) advertisement to server
*/

// module used
var noble = require('noble')
var request = require('request')

var advData = require('./data.json')
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

//scan and send advertisement to the server
noble.on('discover', function (peripheral) {
  // send PUT request to specific URL
  advData.serviceUUID = peripheral.id
  advData.rssi = peripheral.rssi
  advData.serviceData = peripheral.advertisement.serviceData
  request(options, callback)

  console.log('Scanned and sending :\n\t ' + JSON.stringify(advData))
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
