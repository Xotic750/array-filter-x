/**
 * @file Creates an array with all elements that pass the test by the provided function.
 * @version 1.0.1
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-filter-x
 */

'use strict';

var toObject = require('to-object-x');
var assertIsFunction = require('assert-is-function-x');
var some = require('array-some-x');

var $filter = function filter(array, callBack /* , thisArg */) {
  var object = toObject(array);
  // If no callback function or if callback is not a callable function
  assertIsFunction(callBack);
  var result = [];
  var wrapped = function _wrapped(item, idx, obj) {
    // eslint-disable-next-line no-invalid-this
    if (callBack.call(this, item, idx, obj)) {
      result[result.length] = item;
    }
  };

  var args = [object, wrapped];
  if (arguments.length > 2) {
    args[2] = arguments[2];
  }

  some.apply(void 0, args);
  return result;
};

/**
 * This method creates a new array with all elements that pass the test
 * implemented by the provided function.
 *
 * @param {array} array - The array to iterate over.
 * @param {Function} callBack - Function is a predicate, to test each element.
 * @param {*} [thisArg] - Value to use as this when executing callback.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @returns {array} A new array with the elements that pass the test.
 * @example
 * var filter = require('array-filter-x');
 *
 * function isBigEnough(value) {
 *   return value >= 10;
 * }
 *
 * var filtered = filter([12, 5, 8, 130, 44], isBigEnough);
 * // filtered is [12, 130, 44]
 */
module.exports = $filter;
