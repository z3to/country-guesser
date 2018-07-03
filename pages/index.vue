<template>
  <div class="page-body">
    <header class="page-header">
      <h1>Country Lookup</h1>
      <p>Put in a list of countries in the left panel, check the possible matchings and copy the output list.</p>
    </header>
    <div class="page-options">
      <section class="input">
        <h2>Input</h2>
      </section>
      <section class="details">
        <h2>Details</h2>
        <ul>
          <li>all 5</li>
          <li>ambiguous 0</li>
          <li>successful 3</li>
          <li>unsuccessful 2</li>
        </ul>
      </section>
      <section class="output">
        <h2>Output</h2>
        <ul>
          <li>Output code: </li>
          <li>Include input value</li>
        </ul>
      </section>
    </div>
    <div class="page-tool">
      <section class="input">
        <textarea :value="rawInput" @input="triggerInput" spellcheck="false" placeholder="Country name"></textarea>
      </section>
      <section class="details">
        <table>
          <thead>
            <tr>
              <td>
                Input
              </td>
              <td>
                Possibilities
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in matches" :class="{ 'warn' : !line['matches'].length }">
              <td>
                {{ line['input'] }}
              </td>
              <td>
                <ol v-if="line['matches'].length">
                  <li v-for="match in line['matches']">
                    {{ match.match.label }} ({{ match.probability.toFixed(2) }}%)
                  </li>
                </ol>
                <span v-else>{{ line['message'] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="output">
        <textarea>{{ output.join('\n') }}</textarea>
      </section>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  import { mapState, mapActions, mapGetters } from 'vuex'
  // import Vis from '~/components/Vis.vue'
  // import LinkHover from '~/components/LinkHover.vue'

  export default {
    data: function () {
      return {
      }
    },
    computed: {
      ...mapState([
        'lines',
        'rawInput',
        'countries'
      ]),
      ...mapGetters([
        'matches',
        'output'
      ])
    },
    watch: {
    },
    methods: {
      ...mapActions([
        'updateRawInput',
        'updateLines'
      ]),
      triggerInput: _.debounce(function (e) {
        const { value } = e.target

        this.updateRawInput(value)
        this.updateLines(value)
      }, 0)
    },
    components: {
    },
    mounted () {
    }
  }
</script>

<style lang="scss">

</style>
