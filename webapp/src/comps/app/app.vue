<template>
  <div class="app">
    <a-base-styles />
    <a-header title="Signaling" />
    <main class="main">
      <a-section>
        <div class="welcome">
          <p class="text-content">
            Welcome on the Aragon Signaling
            <abbr title="Decentralized Application">ĐApp</abbr>, which allows
            the community to bring new ideas and support them, following the
            <a
              href="https://blog.aragon.one/aragons-community-governance-model-2971df8f7817"
              target="_blank"
              rel="noopener"
            >
              Aragon Governance Model
            </a>
            principles.
          </p>
        </div>
      </a-section>
      <a-section>
        <div class="app-proposal" v-for="proposal in proposals">
          <proposal
            :proposal="proposal"
            :opened="proposal.id === activeProposal"
            :key="proposal.id"
            @click.native="openProposal(proposal.id)"
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
  import createHistory from 'history/createBrowserHistory'
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
        activeProposal: -1
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
      openProposal(id) {
        if (this.activeProposal === id) {
          this.history.push('/')
        } else {
          this.history.push('/proposal/' + id, { id })
        }
      },
      handleProposalUpdate(proposals) {
        this.proposals = proposals
      },
      handleLocationUpdate(location, initial) {
        const proposal = location.pathname.match(/^\/proposal\/([1-9][0-9]*)$/)
        this.activeProposal = proposal? parseInt(proposal[1], 10) : -1
        if (initial) {
          this.animated = true
        }
      }
    },
    created() {
      this.history = createHistory()
      this.unlistenHistory = this.history.listen(this.handleLocationUpdate)
      dataFetcher((type, data) => {
        if (type === 'proposals') {
          this.handleProposalUpdate(data)
        }
        if (type === 'status') {
          this.fetcherStatus = data
        }
      })
      this.handleLocationUpdate(this.history.location, true)
    },
    destroyed() {
      this.unlistenHistory()
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
