// method 1
function countDistanceV1 (rs, prev, first) {
  var txpower = -72.0

  if (rs === 0) {
    return -1.0
  }

  var ratio = rs * 1.0 / txpower
  if (ratio < 1.0) {
	if (!first) 
		return Math.pow(ratio, 10) * 0.8 + prev * 0.2
	else
		return Math.pow(ratio, 10)
  } else {
    var d = (0.89976) * Math.pow(ratio, 7.7095) + 0.111
	if (!first)
		return d*0.8 + prev*0.2
	else
		return d
  }
}

// method 2
function countDistanceV2 (rs, prev, first) {
  var txpower = -72.0
  var n = 2 // Environmental attenuation factor(2 -> in free space)
  if (rs === 0) {
    return -1.0
  }

  if (!first)
    return Math.pow(10, (txpower - rs) / (10 * n)) * 0.8 + prev * 0.2
  else
    return Math.pow(10, (txpower - rs) / (10 * n))
}

exports.countDistanceV1 = countDistanceV1
exports.countDistanceV2 = countDistanceV2
