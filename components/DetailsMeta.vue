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
      unsuccessful () {
        return _.filter(this.matches, match => {
          return match.type.unsuccessful
        }).length
      },
      successful () {
        return _.filter(this.matches, match => {
          return match.type.successful
        }).length
      },
      ambiguous () {
        return _.filter(this.matches, match => {
          return match.type.ambiguous
        }).length
      }
    }
  }
</script>

<style lang="scss">

</style>
