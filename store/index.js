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

        const result = _.find(state.countries, country => {
          return _.indexOf(country.variants, input) > -1
        })

        if (!_.isUndefined(result)) {
          output['matches'] = [result]
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
          const selectedMatchCode = selectedMatch[state.code]

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
