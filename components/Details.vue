<template>
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
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'matches'
      ])
    }
  }
</script>

<style lang="scss">

</style>
