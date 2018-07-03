<template>
  <div class="page-body">
    <header class="page-header">
      <h1>Country Lookup</h1>
      <p>Put in a list of countries in the left panel, check the possible matchings and copy the output list.</p>
    </header>
    <div class="page-options">
      <section class="input">
        <h2>Input</h2>
      </section>
      <section class="details">
        <h2>Details</h2>
        <ul>
          <li>all 5</li>
          <li>ambiguous 0</li>
          <li>successful 3</li>
          <li>unsuccessful 2</li>
        </ul>
      </section>
      <section class="output">
        <h2>Output</h2>
        <ul>
          <li>Output code: </li>
          <li>Include input value</li>
        </ul>
      </section>
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
  import Input from '~/components/Input.vue'
  import Output from '~/components/Output.vue'

  export default {
    components: {
      Details,
      Input,
      Output
    }
  }
</script>

<style lang="scss">

</style>
