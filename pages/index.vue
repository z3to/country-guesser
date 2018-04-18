<template>
  <div class="page-body">
    <header>
      <h1>Country Lookup</h1>
      <p>Put in a list of countries in the left panel, check the possible matchings and copy the output list.</p>
      <h2>Options</h2>
      <ul>
        <li>Output code: </li>
        <li>Include input value</li>
      </ul>
    </header>
    <div class="page-tool">
      <section>
        <textarea :value="rawInput" @input="triggerInput" spellcheck="false"></textarea>
      </section>
      <section class="possibilites">
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
            <tr v-for="line in matches">
              <td>
                {{ line['input'] }}
              </td>
              <td>
                {{ line['message'] }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
<!--       <section>
        <table>
          <thead>
            <tr>
              <td>
                Country
              </td>
              <td>
                cca3
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="country in countries">
              <td>
                {{ country.label }}
              </td>
              <td>
                {{ country.cca3 }}
              </td>
            </tr>
          </tbody>
        </table>
      </section> -->
      <section>
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
