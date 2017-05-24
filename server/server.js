/*
1. Open a web server to show location of each cup
2. GET data and calculate the location from each cup
*/

// module used
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')

// file export
var calcDistance = require('./calcDistance')
var dataAnalysis = require('./dataAnalysis')
var clustering = require('./clustering')
var store = require('./storeData')


// create an express app
var app = express()

// view engine setup
app.use(express.static(__dirname + '/webApplication'))
app.use(bodyParser())

// create a server
var server = http.createServer(app)

app.use('/', function (request, response, next) {
  var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress
  console.log('\n\n\n**************************************************************')
  console.log('Receive a request from ' + ip)
  next()
})

app.get('/', function (request, response, next) {
  response.sendfile('/index.html')
  next()
})

// handle PUT request from each cup
app.put('/', function (request, response, next) {
  var cupData = request.body
  var distance
//  var cupID = request.params.id
  console.log(JSON.stringify(cupData))
  console.log('Request type : PUT')
  console.log('Service UUID = ' + cupData.serviceUUID)
  console.log('RSSI = ' + cupData.rssi)

  distance = calcDistance.countDistanceV1(cupData.rssi)
  console.log('Distance V1 = ' + distance + ' meter')

  distance = calcDistance.countDistanceV2(cupData.rssi)
  console.log('Distance V2 = ' + distance + ' meter')

//  var dataJSON = require('./data.json')

  // store data in
  //console.log('before update:\n' + JSON.stringify(dataJSON))
  store.storeData(cupData, distance)
  //console.log('update data:\n' + JSON.stringify(dataJSON))
  // clustering
  clustering.clustering()

//  dataAnalysis.dataAnalysis(cupData)

  console.log()
})

// listening to specific IP addr and port
server.listen(3000, '0.0.0.0', function () {
  console.log('Server Start!')
  console.log('Listening port 3000......')
})
