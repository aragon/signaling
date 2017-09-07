pragma solidity 0.4.15;

import "./MiniMeToken.sol";

/*
contract MiniMeToken {
    uint8 public decimals;
    function balanceOfAt(address _owner, uint _blockNumber) constant
        returns (uint);
}
*/
contract Signal {
    MiniMeToken public token;
    string public title;
    uint8 public optionsCount;
    string public optionsDescription;
    uint64 public closes;
    uint256 public snapshotBlock;

    mapping (uint8 => uint256) public optionSupport;
    mapping (address => uint8) public signaledOption;

    function Signal(MiniMeToken _token, string _title, uint8 _optionsCount, string _optionsDescription, uint64 _closes) {
        token = _token;
        title = _title;
        optionsCount = _optionsCount;
        optionsDescription = _optionsDescription;
        closes = _closes;
        snapshotBlock = block.number - 1;
    }

    function () public {
        signal(uint8(msg.data[0]));
    }

    function signal(uint8 _option) {
        require(_option > 0 && _option <= optionsCount);

        address signaler = msg.sender;
        uint256 stake = token.balanceOfAt(signaler, snapshotBlock);

        if (signaledOption[signaler] > 0) optionSupport[signaledOption[signaler]] -= stake;
        optionSupport[_option] += stake;
        signaledOption[signaler] = _option;

        Signaled(signaler, _option, stake);
        Transfer(signaler, _option * 256**19, stake); // trick etherscan to show event
    }

    function name() returns (string) {
        return title;
    }

    function decimals() returns (uint256) {
        return token.decimals();
    }

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Signaled(address indexed signaler, uint8 option, uint256 stake);
}
