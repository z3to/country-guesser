<template>
  <span v-on:mouseover="makeActiveCountry([path, value])" v-on:mouseleave="makeActiveCountry(false)" class="link-hover">{{ label }}</span>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: ['path', 'value', 'label'],
    methods: {
      ...mapActions([
        'makeActiveCountry'
      ])
    }
  }
</script>
