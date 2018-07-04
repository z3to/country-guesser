<template>
  <section class="input">
    <h2><span>1.</span> Input</h2>
    <p>Put in a list of countries in the left panel, check the possible matches and copy the output list.</p>
    <h3>Options {{ optionLineBreak }} Test</h3>
    <ul>
      <li>Separation sign:
        <select v-model="modelOptionLineBreaks">
          <option v-for="lineBreak in lineBreaks" v-bind:value="lineBreak.value">
            {{ lineBreak.text }}
          </option>
        </select>
      </li>
    </ul>
    <span class="btn" @click="insertSampleData">Insert sample data</span>
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
        'setOptionLineBreak',
        'updateRawInput'
      ]),
      insertSampleData: function () {
        const sample = 'Deutschland\nDuetschland\nSão Tomé und Príncipe\nSao Tome und Principe\nVietnam\nViet nam\nCongo, Republic\nDR Congo\nDemocratic Republic of the Congo\nIran\nIraq\nIrak\nBarcelona'
        this.updateRawInput(sample)
        this.setOptionLineBreak({ value: '\n' })
      }
    }
  }
</script>

<style lang="scss">

</style>
