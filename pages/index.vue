<template>
  <div class="page-body">
    <header class="page-header">
      <h1>Country guesser</h1><a href="https://github.com/z3to/country-guesser">Source on Github</a>
    </header>
    <div class="page-options">
      <InputMeta />
      <DetailsMeta />
      <OutputMeta />
    </div>
    <div class="page-tool">
      <Input />
      <Details />
      <Output />
    </div>
  </div>
</template>

<script>
  import Details from '~/components/Details.vue'
  import DetailsMeta from '~/components/DetailsMeta.vue'
  import Input from '~/components/Input.vue'
  import InputMeta from '~/components/InputMeta.vue'
  import Output from '~/components/Output.vue'
  import OutputMeta from '~/components/OutputMeta.vue'

  export default {
    components: {
      Details,
      DetailsMeta,
      Input,
      InputMeta,
      Output,
      OutputMeta
    }
  }
</script>

<style lang="scss">
  .page-header {
    display: flex;
    justify-content: space-between;

    * {
      display: inline-block;
      line-height: 1rem;
    }

    a {
      color: #fff;
      font-size: 0.8rem;

      &:hover, &:focus {
        border: 0;
        color: #000;
      }
    }
  }

</style>
