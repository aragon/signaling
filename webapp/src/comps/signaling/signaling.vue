<template>
  <div class="signaling">
    <a-base-styles />

    <a-section>
      <h1>Signaling</h1>
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
  import { aBaseStyles, aSection } from 'toolkit'

  export default {
    components: {
      aBaseStyles,
      aSection
    },
    data() {
      return {
        proposals: []
      }
    },
    async created() {
      this.proposals = await listProposals()
    }
  }
</script>

<style scoped>
  @import '../../../toolkit/shared-styles.css';
  .signaling {
  }
  .signaling h1 {
    margin: 100px 0;
  }
</style>
