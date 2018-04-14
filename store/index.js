import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import * as data from '../data/countries.json'
const cleanDiacritics = require('underscore.string/cleanDiacritics')
// const levenshtein = require('underscore.string/levenshtein')

Vue.use(Vuex)

function simplify (str) {
  return cleanDiacritics(_.toLower(str)).replace(/\s/g, '')
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

  return {
    'label': cnty['name']['common'],
    'cca2': cnty['cca2'],
    'ccn3': cnty['ccn3'],
    'cca3': cnty['cca3'],
    'cioc': cnty['cioc'],
    'variants': _.map(variantsList, variant => { return simplify(variant) })
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
    output (state) {
      console.log('output')
      return _.map(state.lines, line => {
        const input = simplify(line)
        console.log(input, line)
        if (input.length < 2) {
          return '—'
        }
        const result = _.find(state.countries, country => {
          return _.indexOf(country.variants, input) > -1
        })
        if (!_.isUndefined(result)) {
          result['input'] = line
        }
        console.log(input, line)
        return result
      })
    },
    outputPossibilities (state, getters) {
      console.log('outputPossibilities')
      return _.map(getters.output, line => {
        if (_.isUndefined(line)) {
          return 'No matching found'
        }
        if (_.isUndefined(line[state.code])) {
          return 'Code ' + state.code + ' not available for this country'
        }
        console.log(line['input'])
        // return line['input'] + ',' + line[state.code]
        return line[state.code]
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
      state.lines = value.split('\n')
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
