<template>
  <section class="input">
    <textarea :value="rawInput" @input="triggerInput" spellcheck="false" placeholder="Country name"></textarea>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import _ from 'lodash'

  export default {
    computed: {
      ...mapState([
        'rawInput'
      ])
    },
    methods: {
      ...mapActions([
        'updateRawInput',
        'updateLines'
      ]),
      triggerInput: _.debounce(function (e) {
        const { value } = e.target

        this.updateRawInput(value)
        this.updateLines(value)
      }, 0)
    }
  }
</script>

<style lang="scss">

</style>
