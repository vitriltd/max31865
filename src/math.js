const RTD_A = 3.9083e-3;
const RTD_B = -5.775e-7;

/**
 * Round a number to digits
 * @param {number} number
 * @param {number} digits
 * @returns {number}
 */
const round = (number, digits) => (Number(number.toPrecision(digits)));

/**
 * Converts the given resistance value to a temperature value
 * @param {number} resistance
 * @returns {number}
 */
const resistanceToTemperature = (resistance, nominalResistance = 100) => {
  // Calculate temperature using the quadratic formula method
  const z1 = -RTD_A;
  const z2 = RTD_A * RTD_A - (4 * RTD_B);
  const z3 = (4 * RTD_B) / nominalResistance;
  const z4 = 2 * RTD_B;
  let tempQuadratic = z2 + (z3 * resistance);
  tempQuadratic = (Math.sqrt(tempQuadratic) + z1) / z4;

  // Calculate temperature using the polynomial method
  let rpoly = resistance;
  rpoly /= nominalResistance;
  rpoly *= 100;

  let tempPoly = -242.02;
  tempPoly += 2.2228 * rpoly;
  rpoly *= resistance; // square
  tempPoly += 2.5859e-3 * rpoly;
  rpoly *= resistance; // ^3
  tempPoly -= 4.8260e-6 * rpoly;
  rpoly *= resistance; // ^4
  tempPoly -= 2.8183e-8 * rpoly;
  rpoly *= resistance; // ^5
  tempPoly += 1.5243e-10 * rpoly;

  // Choose the appropriate result based on the calculated temperature
  return round(tempQuadratic >= 0 ? tempQuadratic : tempPoly, 6);
};

/**
 *
 * @param {number} rawValue
 * @param {number} referenceResistor
 * @returns {number}
 */
const rawToResistance = (rawValue, referenceResistor = 430) => {
  let resistance = rawValue / 32768;
  resistance *= referenceResistor;
  return round(resistance, 6);
};

module.exports = {
  rawToResistance,
  resistanceToTemperature,
};
