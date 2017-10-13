import axios from 'axios'
import Web3SignalsWorker from './web3-signals.worker.js'
import MarkdownIt from 'markdown-it'

const GITHUB_API_ROOT = 'https://api.github.com'

const githubEndpoints = {
  issues: () => `${GITHUB_API_ROOT}/repos/aragon/governance/issues?state=all`,
  issue: id => `${GITHUB_API_ROOT}/repos/aragon/governance/issues/${id}`,
}

const md = new MarkdownIt()

const fromCache = key => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (e) {
    return null
  }
}

// Cache and return issues from GitHub
const getIssues = async () => {
  const res = await axios.get(githubEndpoints.issues())
  const issues = res.data
    .filter(issue => !issue.pull_request)
    .map(({ number, title, url }) => ({ number, title, url }))
  localStorage.setItem('issues', JSON.stringify(issues))
  return issues
}

const getIssueContent = async id => {
  const res = await axios.get(githubEndpoints.issue(id))
  return md.render(res.data.body)
}

// Cache and return signals from web3
const onSignalsUpdate = cb => {
  const fetchSignals = new Web3SignalsWorker()
  fetchSignals.addEventListener('message', ({ data: { signals } }) => {
    if (!signals) {
      return
    }
    localStorage.setItem('signals', JSON.stringify(signals))
    cb(signals)
  })
  fetchSignals.postMessage('start')
}

const issueToProposal = ({ number, title, url }) => ({
  id: number,
  title,
  url,
})

const signalToProposal = ({
  id,
  title,
  options,
  closes,
  symbol,
  token,
  totalSupport,
}) => ({ id, title, options, closes, symbol, token, totalSupport })

// Assemble the proposals: GitHub issues + web3 signals (optional)
const proposals = (issues, signals) => {
  const githubProposals = issues.map(issueToProposal)

  // Only github proposals are returned if signals are not passed
  if (!signals) {
    return githubProposals
  }

  // At this stage, proposals are included as long as they exist on the
  // contract
  return signals.map(signal => ({
    ...(githubProposals.find(pr => pr.id === signal.id) || {}),
    ...signalToProposal(signal),
  }))
}

const fetchProposals = async cb => {
  cb('status', 'fetching-from-github')

  const issues = await getIssues()
  cb('proposals', proposals(issues, cachedSignals))
  console.info('github issues from github: ok')

  cb('status', 'fetching-from-web3')

  onSignalsUpdate(signals => {
    cb('proposals', proposals(issues, signals))
    console.info('signals from web3 provider: ok')

    cb('status', 'done')
  })
}

// Fetch the proposals from GitHub and Web3.
//
// The `emit` callback receives two parameters:
//
//   - The type of the update, as a string
//   - The associated data
//
// The `every` parameter is the number of milliseconds
// before fetching the data again (default is disabled: -1).
//
export const initProposalsFetcher = async (emit, every = -1) => {
  const start = async () => {
    const cachedIssues = fromCache('issues')
    const cachedSignals = fromCache('signals')

    if (cachedIssues) {
      emit('proposals', proposals(cachedIssues, cachedSignals))
    }

    emit('status', 'fetching-from-github')
    const issues = await getIssues()
    emit('proposals', proposals(issues, cachedSignals))

    emit('status', 'fetching-from-web3')
    onSignalsUpdate(signals => {
      emit('proposals', proposals(issues, signals))
      emit('status', 'done')

      if (every > -1) {
        setTimeout(start, every)
      }
    })
  }
  start()
}

// Fetch a single proposal
export const fetchProposalContent = async id => {
  return await getIssueContent(id)
}
