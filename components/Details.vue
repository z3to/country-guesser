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
        <DetailsItem v-for="(match, id) in matches" :item="match" key="match.input" :id="id" />
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
