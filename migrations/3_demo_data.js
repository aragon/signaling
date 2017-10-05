const SignalsRegistry = artifacts.require('SignalsRegistry')
const Signal = artifacts.require('Signal')

const signalsData = [
  {
    id: 7,
    title: 'AGP 5: Migration to Open Source Messaging Platform',
    options: [
      [[3], 'Rocket Chat'],
      [[0], 'Riot'],
      [[2], 'Other'],
      [[1], 'Reject'],
    ],
  },
  {
    id: 5,
    title: 'AGP4: System for resolving subjective and value based disputes',
    options: [[[3], 'Support'], [[2], 'Reject']],
  },
  {
    id: 4,
    title: 'AGP 3: AN Ranking/rating system',
    options: [[[0, 1, 2, 4], 'Support'], [[3], 'Reject']],
  },
  {
    id: 3,
    title: 'AGP 2: Aragon Community Governance Model',
    options: [[[4], 'Support'], [[1, 3], 'Reject']],
  },
  {
    id: 1,
    title: 'AGP 1: Aragon Voting Token (AVT)',
    options: [[[0], 'Support'], [[1], 'Reject']],
  },
]

module.exports = function(deployer, network, accounts) {
  if (process.env.LIVE_NETWORKS) return

  return deployer.then(() => {
    SignalsRegistry.deployed().then(registry => {
      signalsData.forEach((data, i) => {
        registry.createSignal(
          data.id,
          data.title,
          data.options.length,
          data.options.map(o => o[1]).join('\n'),
          Date.now() + 60 * 60 * 24 * (i + 1)
        )

        data.options.map(opt => opt[0]).map((voters, option) => {
          registry
            .signals(data.id)
            .then(address => Signal.at(address))
            .then(signal => {
              voters.forEach(voter => {
                signal.signal(option + 1, {from: accounts[voter]})
              })
            })
        })
      })
    })
  })
}
