<template>
  <section class="output">
    <h2>Output</h2>
    <ul>
      <li>Output code:
        <select v-model="modelOptionOutputcode">
          <option v-for="code in codes" v-bind:value="code.value">
            {{ code.text }}
          </option>
        </select>
      </li>
      <li><input v-model="modelOptionInputValue" id="optionInputValue" type="checkbox" /> <label for="optionInputValue">Include input value</label></li>
      <li><input v-model="modelOptionCommonName" id="optionCommonName" type="checkbox" /> <label for="optionCommonName">Include common name</label></li>
    </ul>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'codes',
        'optionOutputCode',
        'optionInputValue',
        'optionCommonName'
      ]),
      modelOptionOutputcode: {
        get () {
          return this.optionOutputCode
        },
        set (value) {
          this.setOptionOutputCode({ value })
        }
      },
      modelOptionInputValue: {
        get () {
          return this.optionInputValue
        },
        set (value) {
          this.setOptionInputValue({ value })
        }
      },
      modelOptionCommonName: {
        get () {
          return this.optionCommonName
        },
        set (value) {
          this.setOptionCommonName({ value })
        }
      }
    },
    methods: {
      ...mapActions([
        'setOptionOutputCode',
        'setOptionInputValue',
        'setOptionCommonName'
      ])
    }
  }
</script>

<style lang="scss">

</style>
