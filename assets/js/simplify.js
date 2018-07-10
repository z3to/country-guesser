'use strict'

const _ = require('lodash')
const cleanDiacritics = require('underscore.string/cleanDiacritics')

function commonAbbreviation (str) {
  return str
    .replace(/(St)(\.){0,1}\s/, 'Saint ') // St(.) -> Saint
}

function onlyCommonLetter (str) {
  // Replace special character, convert to lower case, remove all non-letters
  return cleanDiacritics(_.toLower(str)).replace(/[^a-z]/g, '')
}

function sortWords (str) {
  // Split on spaces, sort array, join and remove remaining spaces
  return str.split(' ').sort().join('').replace(/\s/g, '')
}

module.exports = {
  simplify: function (str) {
    const long = commonAbbreviation(str)
    const sort = sortWords(long)
    return onlyCommonLetter(sort)
  }
}
