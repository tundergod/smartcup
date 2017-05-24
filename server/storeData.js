/*
handle, store, add and manage data.json when receiving a PUT request
1.check if cupID is new, add
2.check if beaconUUID is new, add
3.update distance between cup and beacon
*/

var fs = require('fs')
//read json file

var pushCup // a flag that 
var pushBeacon
var temp = 0

function storeData (dataIn, distance) {
  var dataJSON = fs.readFileSync('data.json', 'utf8')
  pushCup = 1
  pushBeacon = 1

    var dataJ = JSON.parse(dataJSON)

    for (var i in dataJ.cup) {
      if (dataJ.cup[i].cupID == dataIn.cupID) {
        pushCup = 0
        temp = i

        for (var j in dataJ.cup[i].beacon) {
          if (dataJ.cup[i].beacon[j].beaconUUID == dataIn.serviceUUID) {
            pushBeacon = 0
            console.log('update distance')
		    dataJ.cup[i].beacon[j].distance = distance
          }
        }
      }
    }

	// push cup and beacon
    if (pushCup === 1 && pushBeacon === 1) {
      console.log('push cup')
      dataJ.cup.push({cupID: dataIn.cupID, beacon: [{beaconUUID: dataIn.serviceUUID, distance: distance}]})
    }

	// push beacon
    if (pushCup === 0 && pushBeacon === 1) {
      console.log('push beacon')
      dataJ.cup[temp].beacon.push({beaconUUID: dataIn.serviceUUID, distance: distance})
    }

    fs.writeFileSync('data.json', JSON.stringify(dataJ))
}

exports.storeData = storeData
