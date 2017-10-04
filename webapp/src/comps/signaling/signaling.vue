<template>
  <div class="signaling">
    <a-base-styles />

    <a-header />
    <a-section>
      <div>
        <proposal v-for="proposal in proposals" :proposal="proposal" :key="proposal.url" :title="proposal.title"></proposal>
      </div>
    </a-section>
  </div>
</template>

<script>
  import { listProposals } from 'src/data-fetcher'
  import { aBaseStyles, aHeader, aSection } from 'toolkit'
  import proposal from '../proposal/proposal.vue'

  export default {
    components: {
      aBaseStyles,
      aHeader,
      aSection,

      proposal,
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
