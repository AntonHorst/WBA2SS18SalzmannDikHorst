'use strict'

/*!
 * imports.
 */

var curry2 = require('curry2')

/*!
 * exports.
 */

module.exports = curry2(last)

/**
 * Returns a new array comprised of the given array's contents with the given value appended.
 * Pass an array as the second argument to append multiple values.
 *
 * @param {Array} list
 * Array which will be copied and appended to.
 *
 * @param {*} value
 * Array or value to append.
 *
 * @return {Array}
 * Array comprised of the given array's contents with the given value(s) appended.
 */

function last (list, value) {
  return list.concat(value)
}
