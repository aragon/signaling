<template>
  <div class="app">
    <a-base-styles />
    <a-header title="Signaling" />
    <a-section>
      <div class="welcome">
        <p>
          Welcome on the Aragon Signaling
          <abbr title="Decentralized Application">ĐApp</abbr>, which allows the
          community to bring new ideas and and support them, following the
          principles of the
          <a href="https://blog.aragon.one/aragons-community-governance-model-2971df8f7817">
            Aragon Governance Model
          </a>.
        </p>
      </div>
    </a-section>
    <a-section>
      <div>
        <proposal
          v-for="proposal in proposals"
          :proposal="proposal"
          :key="proposal.url"
        />
      </div>
    </a-section>
  </div>
</template>

<script>
  import { onProposalsUpdate } from 'src/data-fetcher'
  import { aBaseStyles, aHeader, aSection } from 'toolkit'
  import proposal from '../proposal/proposal.vue'

  export default {
    components: {
      aBaseStyles,
      aHeader,
      aSection,
      proposal
    },
    data() {
      return {
        proposals: []
      }
    },
    methods: {
      handleProposalUpdate(proposals) {
        this.proposals = proposals
      }
    },
    created() {
      onProposalsUpdate(this.handleProposalUpdate)
    }
  }
</script>

<style scoped>
  @import '../../../toolkit/shared-styles.css';
  .welcome {
    font-size: 24px;
    font-weight: 200;
    line-height: 2;
    margin: 60px 10px;
  }
  .app .proposal {
    margin-bottom: 40px;
  }
</style>
