<template>
  <div class="app">
    <a-base-styles />
    <a-header title="Signaling" />
    <main class="main">
      <a-section>
        <div class="welcome">
          <p>
            Welcome on the Aragon Signaling
            <abbr title="Decentralized Application">ĐApp</abbr>, which allows the
            community to bring new ideas and support them, following the
            principles of the
            <a href="https://blog.aragon.one/aragons-community-governance-model-2971df8f7817" target="_blank" rel="noopener">Aragon Governance Model</a>.
          </p>
        </div>
      </a-section>
      <a-section>
        <div class="app-proposal" v-for="(proposal, index) in proposals">
          <proposal
            :proposal="proposal"
            :opened="index === openedProposal"
            :key="proposal.url"
            @click.native="openProposal(index)"
          />
        </div>
      </a-section>
    </main>
    <loader :text="loading" />
    <a-pre-footer />
    <a-footer light />
  </div>
</template>

<script>
  import dataFetcher from 'src/data-fetcher'
  import { aBaseStyles, aHeader, aSection } from 'toolkit'
  import proposal from '../proposal/proposal.vue'
  import loader from '../loader/loader.vue'
  import aFooter from '../footer/footer.vue'
  import aPreFooter from '../pre-footer/pre-footer.vue'

  export default {
    components: {
      aBaseStyles,
      aHeader,
      aFooter,
      aPreFooter,
      aSection,
      loader,
      proposal
    },
    data() {
      return {
        fetcherStatus: '',
        proposals: [],
        openedProposal: -1
      }
    },
    computed: {
      loading() {
        const status = this.fetcherStatus
        if (status === 'fetching-from-github') {
          return 'Fetching the proposals from GitHub…'
        }
        if (status === 'fetching-from-web3') {
          return 'Fetching the votes from the Ethereum network…'
        }
        return ''
      }
    },
    methods: {
      openProposal(index) {
        if (this.openedProposal === index) {
          this.openedProposal = -1
          return
        }
        this.openedProposal = index
      },
      handleProposalUpdate(proposals) {
        this.proposals = proposals
      }
    },
    created() {
      dataFetcher((type, data) => {
        if (type === 'proposals') {
          this.handleProposalUpdate(data)
        }
        if (type === 'status') {
          this.fetcherStatus = data
        }
      })
    }
  }
</script>

<style scoped>
  @import '../../../toolkit/shared-styles.css';
  .welcome {
    font-size: 24px;
    font-weight: 200;
    line-height: 2;
    margin: 80px 10px;
  }
  .app .app-proposal {
    margin-bottom: 40px;
  }
  .app .main {
    margin: 140px 0;
  }
</style>
