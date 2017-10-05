import 'babel-polyfill'
import Web3 from 'web3'
import truffleContract from 'truffle-contract'
import registryContractData from '../../build/contracts/SignalsRegistry.json'
import signalContractData from '../../build/contracts/Signal.json'
import miniMeContractData from '../../build/contracts/MiniMeToken.json'

const WEB3_PROVIDER_URL = 'http://localhost:8545'
// const WEB3_PROVIDER_URL = 'https://kovan.aragon.one'

const web3Provider = new Web3.providers.HttpProvider(WEB3_PROVIDER_URL)
const web3 = new Web3(web3Provider)

const contractify = contractData => {
  const c = truffleContract(contractData)
  c.setProvider(web3Provider)
  return c
}

const num = obj => obj.toNumber()
const createToDecimals = decimals => amount => amount / Math.pow(10, decimals)

const RegistryContract = contractify(registryContractData)
const SignalContract = contractify(signalContractData)
const MiniMeToken = contractify(miniMeContractData)

const fetchSignals = async ids =>
  Promise.all(
    ids.map(async id => {
      const registry = await RegistryContract.deployed()
      const signalAddress = await registry.signals(id)
      const signal = SignalContract.at(signalAddress)

      const [
        token,
        title,
        optionsCount,
        optionsDescription,
        closes,
        snapshotBlock,
      ] = await signal.get()

      const minime = MiniMeToken.at(token)

      const [
        symbol,
        decimals,
        totalSupplyInt,
        optionsSupportInt,
      ] = await Promise.all([
        minime.symbol(),
        minime.decimals().then(num),
        minime.totalSupplyAt(snapshotBlock).then(num),
        Promise.all(
          [...Array(optionsCount.toNumber())].map((x, i) =>
            signal.optionSupport(i + 1).then(num)
          )
        ),
      ])

      const toDecimals = createToDecimals(decimals)
      const optionsSupport = optionsSupportInt.map(toDecimals)
      const totalSupply = toDecimals(totalSupplyInt)
      const totalVoters = optionsSupport.reduce((ac, x) => ac + x)

      // Total signal support, relative to the token total supply
      const signalSupport = totalVoters / totalSupply

      return {
        id,
        token,
        symbol,
        title,
        decimals,
        signalSupport,
        options: optionsDescription.split('\n').map((label, i) => ({
          label: label.trim(),
          total: optionsSupport[i],
          support: totalVoters ? optionsSupport[i] / totalVoters : 0,
        })),
        closes: new Date(num(closes) * 1000),
        snapshotBlock: num(snapshotBlock),
      }
    })
  )

const fetchSignalIds = async () => {
  const registry = await RegistryContract.deployed()
  return registry.getAllSignalsIds()
}

self.addEventListener('message', async ({ data }) => {
  if (data !== 'start') {
    return
  }
  const signalIds = await fetchSignalIds()
  const signals = await fetchSignals(signalIds.map(num))
  self.postMessage({ signals })
})
