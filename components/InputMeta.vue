<template>
  <section class="input">
    <h2>Input</h2>
    <ul>
      <li>Separation sign:
        <select v-model="modelOptionLineBreaks">
          <option v-for="lineBreak in lineBreaks" v-bind:value="lineBreak.value">
            {{ lineBreak.text }}
          </option>
        </select>
      </li>
    </ul>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'lineBreaks',
        'optionLineBreak'
      ]),
      modelOptionLineBreaks: {
        get () {
          return this.optionLineBreak
        },
        set (value) {
          this.setOptionLineBreak({ value })
        }
      }
    },
    methods: {
      ...mapActions([
        'setOptionLineBreak'
      ])
    }
  }
</script>

<style lang="scss">

</style>
