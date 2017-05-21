/*
NOTE: 	jsonDataExampleV1.json is easier and suitable for store, used in a simple prototype of clustering
	 	jsonDataExampleV2.json is suitable when having a bigger data of clustering(not just find the clostest)
*/

/*
TODO:
1. simplify and optimize the clustering function
2. test function's stability and realibility
*/

// var boundaryTable = 3 // set table boundary as 3 m from the center
var data = require('./jsonDataExampleV1.json')
var maxDis
var temp

// using jsonDataExampleV1.json
function clustering () {
  for (var i in data.cup) {
    maxDis = 666

    for (var j in data.cup[i].beacon) {
      if (data.cup[i].beacon[j].distance < maxDis) {
        maxDis = data.cup[i].beacon[j].distance
        temp = j
      }
    }

    console.log('The cup (cupID : ' + data.cup[i].cupID + ') belongs to table (beaconUUID :' + data.cup[i].beacon[temp].serviceUUID + '), distance : ' + data.cup[i].beacon[temp].distance)
  }
}

clustering()

exports.clustering = clustering
