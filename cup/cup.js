/*
1. get advertisement from beacons using noble modules
2. PUT(RESTful API) advertisement to server
*/

// module used
var noble = require('noble')
var request = require('request')

var advData = require('./data.json')
var method = 'PUT'
var url = 'http://localhost:3000'
var isDuplicate = true
var options = {
  headers: {'Connection': 'close'},
  url: url,
  method: method,
  json: true,
  body: advData
}
var cupID = 'cup002'

// fe9a is the service uuid of estimote proximity beacon
noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning('fe9a', isDuplicate)
  } else {
    noble.stopScanning()
  }
})

// scan and send advertisement to the server
noble.on('discover', function (peripheral) {
  // send PUT request to specific URL
  advData.serviceUUID = peripheral.id
  advData.rssi = peripheral.rssi
  advData.serviceData = peripheral.advertisement.serviceData
  advData.cupID = cupID
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
