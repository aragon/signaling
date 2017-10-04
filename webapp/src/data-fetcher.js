import axios from 'axios'
import Web3 from 'web3'
import truffleContract from 'truffle-contract'
import registryContractData from '../../build/contracts/SignalsRegistry.json'

const GITHUB_API_ROOT = 'https://api.github.com'
const WEB3_PROVIDER_URL = 'http://localhost:8545'
const CONTRACT_ADDRESS = registryContractData.networks[15].address

const web3Provider = new Web3.providers.HttpProvider(WEB3_PROVIDER_URL)
const web3 = new Web3(web3Provider)

const RegistryContract = truffleContract(registryContractData)
RegistryContract.setProvider(web3Provider)

const githubEndpoints = {
  issues: () => `${GITHUB_API_ROOT}/repos/aragon/governance/issues?state=all`,
}

const getProposalsFromGitHub = async () => {
  const res = await axios.get(githubEndpoints.issues())
  return res.data.map(({ number, title, url }) => ({ number, title, url }))
}

// dev only
const createSignalsFromGitHub = async registry => {
  const proposals = await getProposalsFromGitHub()
  const owner = await registry.owner()
  return Promise.all(
    proposals.map(({ number, title }, i) =>
      registry.createSignal(
        number,
        title,
        2,
        'Yes\nNo',
        Date.now() + 60 * 60 * 24 * (i + 1),
        { from: owner, gas: 2000000 }
      )
    )
  )
}

export const onProposalsUpdate = async cb => {
  const registry = RegistryContract.at(CONTRACT_ADDRESS)

  // const done = await createSignalsFromGitHub(registry)
  // console.log('Done!', done)
  // return

  const [signalIds, githubProposals] = await Promise.all([
    registry.getAllSignalsIds().then(ids => ids.map(id => id.toNumber())),
    getProposalsFromGitHub(),
  ])

  const proposals = githubProposals.filter(({ number }) =>
    signalIds.includes(number)
  )

  cb(proposals)
}
