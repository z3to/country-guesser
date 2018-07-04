<template>
  <section class="details">
    <h2><span>2.</span> Possible matches</h2>
    <p>This view is currently a bit buggy. Sometimes the newly selected match is not highlighted.</p>
    <table class="results">
      <thead>
        <tr>
          <th />
          <th>Type</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><i /></td>
          <td>all</td>
          <td>{{ matches.length }}</td>
        </tr>
        <tr>
          <td><i class="successful" /></td>
          <td>successful</td>
          <td>{{ successful }}</td>
        </tr>
        <tr>
          <td><i class="ambiguous" /></td>
          <td>ambiguous</td>
          <td>{{ ambiguous }}</td>
        </tr>
        <tr>
          <td><i class="unsuccessful" /></td>
          <td>unsuccessful</td>
          <td>{{ unsuccessful }}</td>
        </tr>
      </tbody>
    </table>
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
  .results {
    width: auto;

    &, td, tr {
      border: 0;
    }

    td {
      padding: 0.2em 0.4em;
    }
  }
</style>
