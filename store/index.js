import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import * as data from '../data/countries.json'
const cleanDiacritics = require('underscore.string/cleanDiacritics')
const levenshtein = require('underscore.string/levenshtein')

Vue.use(Vuex)

function simplify (str) {
  const long = str.replace(/(St)(\.){0,1}\s/, 'Saint').replace(/[^0-9a-z]/gi, '')
  const sorted = long.split(' ').sort().join('')
  return cleanDiacritics(_.toLower(sorted)).replace(/\s/g, '')
}

const countries = _.map(data, cnty => {
  const variantsList = []
  // console.log(cnty['name']['common'])

  variantsList.push(cnty['name']['common'])
  variantsList.push(cnty['name']['official'])
  _.each(cnty['name']['native'], name => {
    variantsList.push(name['official'])
    variantsList.push(name['common'])
  })
  variantsList.push(...cnty['altSpellings'])
  _.each(cnty['translations'], tranlation => {
    variantsList.push(tranlation['official'])
    variantsList.push(tranlation['common'])
  })

  const variantsListSimple = _.map(variantsList, variant => { return simplify(variant) })
  const variantsListUnique = _.uniq(variantsListSimple)

  return {
    'label': cnty['name']['common'],
    'cca2': cnty['cca2'],
    'ccn3': cnty['ccn3'],
    'cca3': cnty['cca3'],
    'cioc': cnty['cioc'],
    'variants': variantsListUnique
  }
})

const store = () => new Vuex.Store({
  state: {
    countries: countries,
    rawInput: '',
    lines: [],
    activeStatus: 'default',
    code: 'cca3'
  },
  getters: {
    matches (state) {
      return _.map(state.lines, line => {
        const input = simplify(line)
        let output = {
          'input': line,
          'matches': [],
          'selectedMatchIndex': 0,
          'message': ''
        }

        if (input.length < 2) {
          output['message'] = 'Input too short'
          return output
        }

        // Find matches
        // const results = []

        // const exactCountries = _.filter(state.countries, country => {
        //   return _.indexOf(country.variants, input) > -1
        // })

        // _.each(exactCountries, country => {
        //   const exact = {
        //     'probability': 100 / exactCountries.length,
        //     'match': country
        //   }
        //   results.push(exact)
        // })

        const rankedCountries = _.map(state.countries, country => {
          // const exactMatches = _.indexOf(country.variants, input) > -1

          let probability = 0

          // console.log('varianten', country.variants.length)
          const probabilities = _.map(country.variants, variant => {
            const distance = levenshtein(variant, input)
            if (distance < 4) {
              return distance
            }
          })

          const filteredProbabilities = _.filter(probabilities, probability => {
            return !_.isUndefined(probability)
          })

          if (filteredProbabilities.length) {
            const amountValues = probabilities.length - filteredProbabilities.length
            const values = _.countBy(filteredProbabilities)

            if (_.has(values, '0')) {
              probability += 90 * 1 / amountValues * values['0'] + 10
            }

            if (_.has(values, '1')) {
              probability += 9 * 1 / amountValues * values['1'] + 1
            }

            if (_.has(values, '2')) {
              probability += 0.9 * 1 / amountValues * values['2'] + 0.1
            }

            if (_.has(values, '3')) {
              probability += 0.09 * 1 / amountValues * values['3'] + 0.01
            }
          }

          const match = {
            'probability': probability,
            'match': country
          }

          return match
        })

        const matchedCountries = _.filter(rankedCountries, country => {
          return country['probability'] > 0
        })

        if (matchedCountries.length) {
          output['matches'] = _.reverse(_.sortBy(matchedCountries, 'probability')).slice(0, 4)
          output['message'] = 'Matches found'
        } else {
          output['message'] = 'No results found'
        }

        return output
      })
    },
    output (state, getters) {
      return _.map(getters.matches, line => {
        const matches = line['matches']
        if (!matches.length) {
          return 'No matches found'
        }
        const selectedMatch = line['matches'][line['selectedMatchIndex']]
        if (_.isUndefined(selectedMatch)) {
          return 'Selected match not available'
        } else {
          const selectedMatchCode = selectedMatch['match'][state.code]

          if (_.isUndefined(selectedMatchCode)) {
            return 'Code not available for match'
          } else {
            return selectedMatchCode
          }
        }
      })
    }
  },
  mutations: {
    UPDATE_RAW_INPUT (state, value) {
      // console.log('UPDATE_RAW_INPUT')
      state.rawInput = value
    },
    UPDATE_LINES (state, value) {
      // console.log('UPDATE_LINES')
      state.lines = value.replace(/\s*$/, '').split('\n')
    }
  },
  actions: {
    updateRawInput ({ commit }, key) {
      commit('UPDATE_RAW_INPUT', key)
    },
    updateLines: _.debounce(function ({ commit }, key) {
      commit('UPDATE_LINES', key)
    }, 500)
  }
})

export default store
