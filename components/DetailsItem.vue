<template>
  <tr :class="{ 'warn' : !item['matches'].length }">
    <td>
      {{ id + 1 }} <span class="input">{{ item['input'] }}</span>
    </td>
    <td class="possibilities">
      <ol v-if="item['matches'].length">
        <li v-if="!isExpand">
          <span class="selected">
            {{ item['matches'][item['selectedMatchIndex']]['match'].label }}
            ({{ item['matches'][item['selectedMatchIndex']].probability.toFixed(2) }}%)
          </span>
          <span v-if="item['matches'].length > 1" @click="expand()" class="clickable">
            Expand ({{ item['matches'].length - 1 }} more -
            {{ item['matches'][item['selectedMatchIndex'] === 0 ? 1 : 0].probability.toFixed(2) }}%)
          </span>
        </li>
        <li v-else v-for="(match, n) in item['matches']">
          <span :class="{ 'selected': n === item['selectedMatchIndex'], 'clickable': true }" @click="setSelectedMatch({ input: item.id, match: n })">{{ match.match.label }} ({{ match.probability.toFixed(2) }}%)</span>
          <span v-if="n === 0" @click="collapse()" class="clickable">Collapse</span>
        </li>
      </ol>
      <span v-else>{{ item['message'] }}</span>
    </td>
  </tr>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: ['item', 'id', 'selected'],
    data: function () {
      return {
        isExpand: false,
        selectedMatch: 0
      }
    },
    methods: {
      ...mapActions([
        'setSelectedMatch'
      ]),
      expand: function () {
        this.isExpand = true
      },
      collapse: function () {
        this.isExpand = false
      }
    },
    watch: {
    // whenever question changes, this function will run
      selected: {
        handler: function () {
          // console.log(this)
          this.selectedMatch = this.selected
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .clickable {
    cursor: pointer;
  }

  .input {
    font-weight: bold;
  }

  .selected {
    font-weight: bold;
  }

  .possibilities {
    width: 70%;
  }

  ol {
    list-style: none;
  }
</style>
