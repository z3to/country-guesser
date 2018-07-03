<template>
  <tr :class="{ 'warn' : !item['matches'].length }">
    <td>
      {{ id }} {{ item['input'] }}
    </td>
    <td>
      <ol v-if="item['matches'].length">
        <li v-for="match in item['matches']">
          {{ match.match.label }} ({{ match.probability.toFixed(2) }}%)
        </li>
      </ol>
      <span v-else>{{ item['message'] }}</span>
    </td>
  </tr>
</template>

<script>
  // import { mapState, mapActions } from 'vuex'

  export default {
    props: ['item', 'id']
  }
</script>

<style lang="scss">

</style>
