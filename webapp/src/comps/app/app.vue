<template>
  <div class="app">
    <UIBaseStyles />
    <UIHeader title="Signaling" />
    <main class="main">
      <UISection>
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
      </UISection>
      <UISection>
        <div class="app-proposal" v-for="proposal in proposals">
          <proposal
            :proposal="proposal"
            :content="proposal.id === activeProposal ? proposalContent : ''"
            :opened="proposal.id === activeProposal"
            :key="proposal.id"
            @requestOpen="openProposal(proposal.id)"
            @requestClose="closeProposal(proposal.id)"
          />
        </div>
      </UISection>
    </main>
    <UILoader :text="loading" />
    <UIPreFooter />
    <UIFooter light />
  </div>
</template>

<script>
  import {
    UIBaseStyles,
    UIFooter,
    UIHeader,
    UILoader,
    UIPreFooter,
    UISection,
  } from '@aragon/ui'

  import proposal from '../proposal/proposal.vue'
  import createHistory from 'history/createBrowserHistory'
  import { initProposalsFetcher, fetchProposalContent } from 'src/data-fetcher'

  export default {
    components: {
      UIBaseStyles,
      UIHeader,
      UISection,
      UIFooter,
      UIPreFooter,
      UILoader,
      proposal
    },
    data() {
      return {
        proposalsStatus: '',
        proposals: [],
        activeProposal: -1,
        proposalContent: '',
      }
    },
    computed: {
      loading() {
        if (this.proposalsStatus === 'fetching-from-github') {
          return 'Fetching the proposals from GitHub…'
        }
        if (this.proposalsStatus === 'fetching-from-web3') {
          return 'Fetching the votes from the Ethereum network…'
        }
        return ''
      }
    },
    watch: {
      activeProposal(activeProposal) {
        if (activeProposal > -1) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = 'visible'
        }
      }
    },
    methods: {
      async handleLocationUpdate(location, initial) {
        const proposal = location.pathname.match(/^\/proposal\/([1-9][0-9]*)$/)
        this.activeProposal = proposal? parseInt(proposal[1], 10) : -1
        this.proposalContent = ''

        if (initial) {
          this.animated = true
        }

        if (this.activeProposal > -1) {
          this.proposalContent = await fetchProposalContent(
            this.activeProposal
          )
        }
      },
      closeProposal(id) {
        this.history.push('/')
      },
      openProposal(id) {
        this.history.push('/proposal/' + id)
      },
      handleProposalsUpdate(proposals) {
        this.proposals = proposals
      },
    },
    created() {
      this.history = createHistory()
      this.unlistenHistory = this.history.listen(this.handleLocationUpdate)
      initProposalsFetcher((type, data) => {
        if (type === 'proposals') {
          this.handleProposalsUpdate(data)
        }
        if (type === 'status') {
          this.proposalsStatus = data
        }
      }, 30 * 1000)

      this.handleLocationUpdate(this.history.location, true)
    },
    destroyed() {
      this.unlistenHistory()
    }
  }
</script>

<style scoped>
  @import '../../shared-styles.css';
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
