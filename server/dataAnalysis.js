/*
Data buffer -> data.serviceData[0].data.data[0]->[19]
*/

function dataAnalysis (data) {
  var advData = data.serviceData[0].data.data
  // console.log('function data analysis:\n' + JSON.stringify(data))

  // byte 0, upper 4 bits => Telemetry protocol version ("0", "1", "2", etc.)
  var protocolVersion = (advData[0] & 0b11110000) >> 4
  // this parser only understands version up to 2
  // (but at the time of this commit, there's no 3 or higher anyway :wink:)
  if (protocolVersion > 2) { return }

	// ***** MAGNETIC FIELD
    // byte 10 => normalized magnetic field RAW_VALUE on the X axis
    // byte 11 => normalized magnetic field RAW_VALUE on the Y axis
    // byte 12 => normalized magnetic field RAW_VALUE on the Z axis
    // RAW_VALUE is a signed (two's complement) 8-bit integer
    // RAW_VALUE * 2 / 128.0 = normalized value, between -1 and 1
    // the value will be 0 if the sensor hasn't been calibrated yet

  var magneticField = {
    x: advData[10] * 2 / 128.0,
    y: advData[11] * 2 / 128.0,
    z: advData[12] * 2 / 128.0
  }
  console.log('MagneticField of X = ' + magneticField.x)
  console.log('MagneticField of Y = ' + magneticField.y)
  console.log('MagneticField of Z = ' + magneticField.z)

	// ***** AMBIENT LIGHT
    // byte 13 => ambient light level RAW_VALUE
    // the RAW_VALUE byte is split into two halves
    // pow(2, RAW_VALUE_UPPER_HALF) * RAW_VALUE_LOWER_HALF * 0.72 = light level in lux (lx)
  var ambientLightUpper = (advData[13] & 0b11110000) >> 4
  var ambientLightLower = advData[13] & 0b00001111
  var ambientLightLevel = Math.pow(2, ambientLightUpper) * ambientLightLower * 0.72
  console.log('Ambient light = ' + ambientLightLevel)

	// ***** BEACON UPTIME
    // byte 14 + 6 lower bits of byte 15 (i.e., 14 bits total)
    // - the lower 12 bits (i.e., byte 14 + lower 4 bits of byte 15) are
    //   a 12-bit unsigned integer
    // - the upper 2 bits (i.e., bits 4 and 5 of byte 15) denote the unit:
    //   0b00 = seconds, 0b01 = minutes, 0b10 = hours, 0b11 = days
  var uptimeUnitCode = (advData[15] & 0b00110000) >> 4
  var uptimeUnit
  switch (uptimeUnitCode) {
    case 0: uptimeUnit = 'seconds'; break
    case 1: uptimeUnit = 'minutes'; break
    case 2: uptimeUnit = 'hours'; break
    case 3: uptimeUnit = 'days'; break
  }
  var uptime = {
    number: ((advData[15] & 0b00001111) << 8) | advData[14],
    unit: uptimeUnit
  }

  console.log('Uptime = ' + uptime.number + ' ' + uptime.unit)

	// ***** AMBIENT TEMPERATURE
    // upper 2 bits of byte 15 + byte 16 + lower 2 bits of byte 17
    // => ambient temperature RAW_VALUE, signed (two's complement) 12-bit integer
    // RAW_VALUE / 16.0 = ambient temperature in degrees Celsius
  var temperatureRawValue =
      ((advData[17] & 0b00000011) << 10) |
       (advData[16] << 2) |
      ((advData[15] & 0b11000000) >> 6)
  if (temperatureRawValue > 2047) {
      // JavaScript way to convert an unsigned integer to a signed one (:
    temperatureRawValue = temperatureRawValue - 4096
  }
  var temperature = temperatureRawValue / 16.0
  console.log('Ambient temperature = ' + temperature)

	// ***** BATTERY VOLTAGE
    // upper 6 bits of byte 17 + byte 18 => battery voltage in mini-volts (mV)
    //                                      (unsigned 14-bit integer)
    // if all bits are set to 1, it means it hasn't been measured yet
  var batteryVoltage =
       (advData[18] << 6) |
      ((advData[17] & 0b11111100) >> 2)
  if (batteryVoltage == 0b11111111111111) { batteryVoltage = undefined }

  console.log('Battery Voltage = ' + batteryVoltage)

    // ***** ERROR CODES
    // byte 19, lower 2 bits
    // see subframe A documentation of the error codes
    // starting in protocol version 1, error codes were moved to subframe A,
    // thus, you will only find them in subframe B in Telemetry protocol ver 0
  var errors
  if (protocolVersion == 0) {
    errors = {
      hasFirmwareError: (advData[19] & 0b00000001) == 1,
      hasClockError: ((advData[19] & 0b00000010) >> 1) == 1
    }
  }

  if (errors.hasFirmwareError == 1) { console.log('Has Firmware Error!') }

  if (errors.hasClockError == 1) { console.log('Has Clock Error!') }

	// ***** BATTERY LEVEL
    // byte 19 => battery level, between 0% and 100%
    // if all bits are set to 1, it means it hasn't been measured yet
    // added in protocol version 1
  var batteryLevel
  if (protocolVersion >= 1) {
    batteryLevel = advData[19]
    if (batteryLevel == 0b11111111) { batteryLevel = undefined }
  }

  console.log('Battery level = ' + batteryLevel)
}

exports.dataAnalysis = dataAnalysis
