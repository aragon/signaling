const http = require('http')
const webshot = require('webshot')
const fs = require('fs')
const path = require('path')
const Web3 = require('web3')
const truffleContract = require('truffle-contract')
const Handlebars = require('handlebars')

const provider = new Web3.providers.HttpProvider('https://kovan.infura.io')
const web3 = new Web3(provider)

const contractify = name => {
    const c = truffleContract(require(`../build/contracts/${name}`))
    c.setProvider(provider)
    return c
}

let template = {}
fs.readFile(path.join(process.cwd(), 'server/tmpl.html'), { encoding: 'utf-8'}, (err, file) => {
    if (err) throw err
    template = Handlebars.compile(file)
})

const Signal = contractify('Signal')
const MiniMeToken = contractify('MiniMeToken')

let signalsCache = {}

const getInfo = async (addr) => {
    const signal = Signal.at(addr)

    const [token, title, optionsCount, optionsDescription, closes, snapshotBlock] = await signal.get()

    const minime = MiniMeToken.at(token)

    const [symbol, decimals, totalSupply] = await Promise.all([minime.symbol(), minime.decimals(), minime.totalSupplyAt(snapshotBlock)])

    return {
        token,
        symbol,
        title,
        decimals: decimals.toNumber(),
        totalSupply: totalSupply.toNumber() / Math.pow(10, decimals.toNumber()),
        options: optionsDescription.split('\n'),
        closes: new Date(closes.toNumber() * 1000),
        snapshotBlock: snapshotBlock.toNumber(),
    }
}

const getOptionSupport = (addr, info) => {
    const signal = Signal.at(addr)

    return Promise.all(info.options.map((x, i) => signal.optionSupport(i).then(x => x.toNumber() / Math.pow(10, info.decimals) )))
}

http.createServer(async (req, res) => {
    const addr = req.url.split('.')[0].replace('/', '')

    let info = signalsCache[addr]
    if (!info) {
        info = await getInfo(addr)
        signalsCache[addr] = info
    }

    const optionsSupport = await getOptionSupport(addr, info)

    info.totalVoters = optionsSupport.reduce((ac, x) => ac + x).toFixed(2)
    info.quorumPct = (100 * info.totalVoters / info.totalSupply).toFixed(2)
    info.optionSupport = info.options.map((name, i) => ({ name, support: optionsSupport[i].toFixed(2), pct: (100 * optionsSupport[i] / info.totalSupply).toFixed(2) }))

    const renderStream = webshot(template(info), {siteType:'html', windowSize: { width: 600, height: 400 }})

    res.writeHead(200, {'Content-Type': 'image/png'})
    renderStream.on('data', function(data) {
      res.write(data.toString('binary'), 'binary')
      setTimeout(() => res.end(), 10)
    })
}).listen(process.env.PORT || 3000)
