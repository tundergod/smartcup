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

app.use('/', function(request, response, next) {
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress
    console.log('\n\n\n**************************************************************')
    console.log('Receive a request from ' + ip)
    next()
})

app.get('/', function(request, response, next) {
    response.sendfile('/index.html')
    next()
})

var prev1 = 0
var prev2 = 0
var first = 1
// handle PUT request from each cup
app.put('/', function(request, response, next) {
    var cupData = request.body
    var distanceV1 = 0
    var distanceV2 = 0

	// Data output
    /*
	console.log(JSON.stringify(cupData))
    console.log('Request type : PUT')
    console.log('Service UUID = ' + cupData.serviceUUID)
    console.log('RSSI = ' + cupData.rssi) 
	*/

    distanceV1 = calcDistance.countDistanceV1(cupData.rssi, prev1, first)
    console.log('Distance V1 = ' + distanceV1 + ' meter')
    prev1 = distanceV1

    console.log()

    distanceV2 = calcDistance.countDistanceV2(cupData.rssi, prev2, first)
    console.log('Distance V4 = ' + distanceV4 + ' meter')
    prev2 = distanceV2

    console.log()

	var distance = distanceV1*0.5 + distanceV2*0.5 
	console.log('Distance = ' + distance)

    first = 0

    // store data in
    store.storeData(cupData, distance)

    // clustering
    clustering.clustering()

    console.log()
})

// listening to specific IP addr and port
server.listen(3000, '0.0.0.0', function() {
    console.log('Server Start!')
    console.log('Listening port 3000......')
})
