const SignalsRegistry = artifacts.require('SignalsRegistry')
const MiniMeToken = artifacts.require('MiniMeToken')

module.exports = function(deployer, network, accounts) {
    let token = null // MiniMeToken.at('0x960b236A07cf122663c4303350609A66A7B288C0')

    return deployer.then(() => {
        if (token) return
        return MiniMeToken.new('0x00', '0x00', 0, 'Test Token', 18, 'TT', true)
                .then(t => {
                    token = t
                    token.generateTokens(accounts[0], 1e19)

                    token.generateTokens(accounts[1], 1e19 * 1.2)
                    token.generateTokens(accounts[2], 1e19 * 2)
                    token.generateTokens(accounts[3], 1e19 * 5)
                    token.generateTokens(accounts[4], 1e20)
                    return true
                })
    }).then(() => {
        console.log('deploying signal registry with token', token.address)
        return deployer.deploy(SignalsRegistry, token.address)
    })
}
