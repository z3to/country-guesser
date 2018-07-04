<template>
  <tr :class="{ 'unsuccessful' : item['type']['unsuccessful'], 'ambiguous': item['type']['ambiguous'] }">
    <td>
      {{ id + 1 }} <span class="input">{{ item['input'] }}</span>
    </td>
    <td class="possibilities">
      <table class="matches">
        <tbody>
          <tr v-if="!item['matches'].length">
            <td>
              <span>{{ item['message'] }}</span>
            </td>
            <td class="rating">
              <i :class="{ ambiguous: item['type']['ambiguous'], successful: item['type']['successful'], unsuccessful: item['type']['unsuccessful'], }" />
            </td>
            <td />
            <td />
          </tr>
          <tr v-else-if="!isExpand">
            <td class="selected">
              {{ item['matches'][item['selectedMatchIndex']]['match'].label }}
            </td>
            <td class="rating">
              <i :class="{ ambiguous: item['type']['ambiguous'], successful: item['type']['successful'], unsuccessful: item['type']['unsuccessful'], }" />
            </td>
            <td>
              {{ item['matches'][item['selectedMatchIndex']].probability.toFixed(2) }}&#8239;%
            </td>
            <td>
              <span v-if="item['matches'].length > 1" @click="expand()" class="btn">
                Expand ({{ item['matches'].length - 1 }} more -
                {{ item['matches'][item['selectedMatchIndex'] === 0 ? 1 : 0].probability.toFixed(2) }}%)
              </span>
            </td>
          </tr>
          <tr v-else v-for="(match, n) in item['matches']">
            <td>
              <span :class="{ 'selected': n === item['selectedMatchIndex'], 'clickable': true }" @click="setSelectedMatch({ input: item.id, match: n })">{{ match.match.label }}</span>
            </td>
            <td class="rating">
              <i :class="{ ambiguous: item['type']['ambiguous'], successful: item['type']['successful'], unsuccessful: item['type']['unsuccessful'], }" v-if="n === 0" />
            </td>
            <td>
              {{ match.probability.toFixed(2) }}&#8239;%
            </td>
            <td>
              <span v-if="n === 0" @click="collapse()" class="btn">Collapse</span>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
    <td>
      <span v-if="item.matches[item.selectedMatchIndex]">{{ item.matches[item.selectedMatchIndex].match.codes[optionOutputCode] }}</span>
    </td>
  </tr>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    props: ['item', 'id', 'selected'],
    data: function () {
      return {
        isExpand: false,
        selectedMatch: 0
      }
    },
    computed: {
      ...mapState([
        'optionOutputCode'
      ])
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
  .matches {
    &, tr, td {
      border: 0;
    }

    td {
      width: 30%;
      padding: 0.3em 0;

      &.rating {
        text-align: center;
        width: 10%;
      }
    }
  }
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

  .unsuccessful {
    color: #EA5A47;
  }

  .ambiguous {
    color: #FFA224;
  }

  ol {
    list-style: none;
  }
</style>
