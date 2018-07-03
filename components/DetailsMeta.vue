<template>
  <section class="details">
    <h2>Details</h2>
    <ul>
      <li>all: {{ matches.length }}</li>
      <li>ambiguous: {{ ambiguous }}</li>
      <li>successful: {{ successful }}</li>
      <li>unsuccessful: {{ unsuccessful }} </li>
    </ul>
  </section>
</template>

<script>
  import _ from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'matches'
      ]),
      matchesCount () {
        return this.matches.map(match => {
          // console.log(match)
          return match.matches.length
        })
      },
      unsuccessful () {
        return _.filter(this.matchesCount, match => {
          return match === 0
        }).length
      },
      successful () {
        return _.filter(this.matches, match => {
          if (match.matches.length) {
            return match.matches[0].probability >= 10
          }
          return false
        }).length
      },
      ambiguous () {
        return _.filter(this.matches, match => {
          if (match.matches.length) {
            if (match.matches[0].probability < 10) {
              return true
            }
            if (match.matches.length > 1) {
              return match.matches[0].probability - match.matches[1].probability < 5
            }
            return false
          }
          return false
        }).length
      }
    }
  }
</script>

<style lang="scss">

</style>
