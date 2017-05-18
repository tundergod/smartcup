/*
1. Open a web server to show location of each cup
2. GET data and calculate the location from each cup
*/

var http = require('http')
var express = require('express')

// create an express app
var app = express()

// create a server
var server = http.createServer(app)

app.use('/', function (request, response, next) {
  var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress
  console.log('Receive a request from ' + ip)
  next()
})

app.put('/', function (request, response, next) {
  var cupData = request.body
  var cupID = request.params.id
  console.log('Request type : PUT')
  console.log(cupData)
  console.log(cupID)
})

server.listen(3000, '127.0.0.1', function () {
  console.log('Server Start!')
  console.log('Listening port 3000......')
})
