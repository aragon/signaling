<template>
  <div class="signaling">
    <a-base-styles />

    <a-header />
    <a-section>
      <div>
        <div v-for="proposal in proposals">
          {{ proposal.title }}
        </div>
      </div>
    </a-section>
  </div>
</template>

<script>
  import { listProposals } from 'src/data-fetcher'
  import { aBaseStyles, aHeader, aSection } from 'toolkit'

  export default {
    components: {
      aBaseStyles,
      aHeader,
      aSection,
    },
    data() {
      return {
        proposals: [],
      }
    },
    async created() {
      this.proposals = await listProposals()
    }
  }
</script>

<style scoped>
  @import '../../../toolkit/shared-styles.css';
  .signaling .logo {
    width: 256px;
    display: inline-block;
    vertical-align: middle;
  }
  .signaling h1 {
    margin: 100px 0;
    text-align: right;
    display: inline-block;
  }
</style>
