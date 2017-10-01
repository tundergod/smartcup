/*
NOTE:	jsonDataExampleV1.json is easier and suitable for store, used in a simple prototype of clustering
		jsonDataExampleV2.json is suitable when having a bigger data of clustering(not just find the clostest)
*/

/*
TODO:
1. simplify and optimize the clustering function
2. test function's stability and realibility
*/

// var boundaryTable = 3 // set table boundary as 3 m from the center
//var data = require('./data.json')
var fs = require('fs')
//read file 


// using jsonDataExampleV1.json
function clustering() {
    var dataJSON = fs.readFileSync('data.json', 'utf-8')
    var data = JSON.parse(dataJSON)
	var maxDis = 666
	var temp

    for (var j in data.cup[0].beacon) {
        if (data.cup[0].beacon[j].distance < maxDis) {
            maxDis = data.cup[0].beacon[j].distance
            temp = j
        }
    }

    console.log('The cup(cupID):' + data.cup[0].cupID +
				' belongs to table(beaconUUID):' + data.cup[0].beacon[temp].beaconUUID +
				' distance:' + data.cup[0].beacon[temp].distance)
}

exports.clustering = clustering
