<template>
  <tr :class="{ 'warn' : !item['matches'].length }">
    <td>
      {{ id + 1 }} {{ item['input'] }}
    </td>
    <td>
      <ol v-if="item['matches'].length">
        <li v-if="!isExpand">
          {{ item['matches'][0]['match'].label }} ({{ item['matches'][0].probability.toFixed(2) }}%) <span v-if="item['matches'].length > 1" @click="expand()">Expand ({{ item['matches'].length - 1 }} more - {{ item['matches'][1].probability.toFixed(2) }}%)</span>
        </li>
        <li v-else v-for="match in item['matches']">
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
    props: ['item', 'id'],
    data: function () {
      return {
        isExpand: false
      }
    },
    methods: {
      expand: function () {
        this.isExpand = true
      }
    }
  }
</script>

<style lang="scss">

</style>
