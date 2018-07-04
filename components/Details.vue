<template>
  <section class="details">
    <table>
      <thead >
        <tr v-if="!matches.length">
          <th>← Insert list of countries in the left panel</th>
        </tr>
        <tr v-else>
          <th>
            Input
          </th>
          <th>
            Possible matches
          </th>
          <th>
            Code
          </th>
        </tr>
      </thead>
      <tbody>
        <DetailsItem v-for="(match, id) in matches" :item="match" :selected="match.selectedMatchIndex" :key="id + match.input" :id="id" />
      </tbody>
    </table>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import DetailsItem from '~/components/DetailsItem.vue'

  export default {
    computed: {
      ...mapGetters([
        'matches'
      ])
    },
    components: {
      DetailsItem
    }
  }
</script>

<style lang="scss">

</style>
