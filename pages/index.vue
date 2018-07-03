<template>
  <div class="page-body">
    <header class="page-header">
      <h1>Country Lookup</h1>
      <p>Put in a list of countries in the left panel, check the possible matchings and copy the output list.</p>
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

</style>
