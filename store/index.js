import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import * as data from '../data/countries.json'
import { simplify } from '~/assets/js/simplify.js'
const levenshtein = require('underscore.string/levenshtein')

Vue.use(Vuex)

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
    'variants': variantsListUnique,
    'codes': {
      'cca2': cnty['cca2'],
      'ccn3': cnty['ccn3'],
      'cca3': cnty['cca3'],
      'cioc': cnty['cioc']
    }
  }
})

const store = () => new Vuex.Store({
  state: {
    countries: countries,
    rawInput: '',
    lines: [],
    activeStatus: 'default',
    optionOutputCode: 'cca2',
    optionInputValue: false,
    optionCommonName: false,
    codes: [
      { text: 'ISO 3166-1 alpha-2 (CCA2)', value: 'cca2' },
      { text: 'ISO 3166-1 alpha-3 (CCA3)', value: 'cca3' },
      { text: 'ISO 3166-1 numeric (CCN3)', value: 'ccn3' },
      { text: 'International Olympic Committee (CIOC)', value: 'cioc' }
    ],
    optionLineBreak: '\n',
    lineBreaks: [
      { text: 'Newline', value: '\n' },
      { text: 'Tab', value: '\t' },
      { text: 'Space', value: ' ' },
      { text: 'Semicolon', value: ';' },
      { text: 'Comma', value: ',' }
    ],
    cache: {}
  },
  getters: {
    matches (state) {
      console.log('new matches')
      const matches = _.map(state.lines, line => {
        const input = simplify(line)

        if (!_.isUndefined(state.cache[input])) {
          console.log('found', input, 'in cache', state.cache[input]['selectedMatchIndex'])
          return state.cache[input]
        }
        console.log('not found')

        let output = {
          'id': input,
          'input': line,
          'matches': [],
          'selectedMatchIndex': 0,
          'message': '',
          'type': 'unsuccessful'
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
            'input': line,
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

        output['type'] = {
          'unsuccessful': output.matches.length === 0,
          'successful': output.matches.length > 0 && output.matches[0].probability >= 10,
          'ambiguous': (output.matches.length > 0 && output.matches[0].probability < 10) || (output.matches.length > 1 && output.matches[0].probability - output.matches[1].probability < 10)
        }

        state.cache[input] = output

        return output
      })
      return Object.freeze(matches)
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
          const output = []

          if (state.optionInputValue) {
            output.push(selectedMatch['input'])
          }

          output.push(selectedMatch['match']['codes'][state.optionOutputCode])

          if (state.optionCommonName) {
            output.push(selectedMatch['match']['label'])
          }

          return output.join(',')

          // if (_.isUndefined(selectedMatchCode)) {
          //   return 'Code not available for match'
          // } else {
          //   return selectedMatchCode
          // }
        }
      })
    }
  },
  mutations: {
    UPDATE_RAW_INPUT (state, value) {
      // console.log('UPDATE_RAW_INPUT')
      state.rawInput = value
    },
    UPDATE_LINES (state) {
      // console.log('UPDATE_LINES')
      state.lines = state.rawInput.replace(/\s*$/, '').split(state.optionLineBreak)
    },
    SET_OPTION_OUTPUT_CODE (state, value) {
      // console.log('UPDATE_RAW_INPUT')
      state.optionOutputCode = value
    },
    SET_OPTION_INPUT_VALUE (state, value) {
      // console.log('UPDATE_RAW_INPUT')
      state.optionInputValue = value
    },
    SET_OPTION_COMMON_NAME (state, value) {
      // console.log('UPDATE_RAW_INPUT')
      state.optionCommonName = value
    },
    SET_OPTION_LINE_BREAK (state, value) {
      console.log('UPDATE_RAW_INPUT', value)
      state.optionLineBreak = value
    },
    SET_SELECTED_MATCH (state, { input, match }) {
      // console.log('UPDATE_RAW_INPUT')
      // Vue.set(state, 'input.selectedMatchIndex', match)
      const obj = state.cache[input]
      obj['selectedMatchIndex'] = match
      state.cache = { ...state.cache, input: obj }
      // state.cache[input]['selectedMatchIndex'] = match
    }
  },
  actions: {
    updateRawInput ({ commit }, key) {
      commit('UPDATE_RAW_INPUT', key)
    },
    updateLines: _.debounce(function ({ commit }, value) {
      commit('UPDATE_LINES')
    }, 500),
    setOptionOutputCode ({ commit }, { value }) {
      commit('SET_OPTION_OUTPUT_CODE', value)
    },
    setOptionInputValue ({ commit }, { value }) {
      commit('SET_OPTION_INPUT_VALUE', value)
    },
    setOptionCommonName ({ commit }, { value }) {
      commit('SET_OPTION_COMMON_NAME', value)
    },
    setOptionLineBreak ({ commit }, { value }) {
      commit('SET_OPTION_LINE_BREAK', value)
      commit('UPDATE_LINES')
    },
    setSelectedMatch ({ commit }, options) {
      commit('SET_SELECTED_MATCH', options)
      commit('UPDATE_LINES')
    }
  }
})

export default store
