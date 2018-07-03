<template>
  <section class="output">
    <textarea>{{ output.join('\n') }}</textarea>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'output'
      ])
    }
  }
</script>

<style lang="scss">

</style>
