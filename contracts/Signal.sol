pragma solidity 0.4.15;

import "./MiniMeToken.sol";

contract Signal {
    MiniMeToken token;
    string title;
    uint8 optionsCount;
    string optionsDescription;
    uint64 closes;
    uint256 snapshotBlock;

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
    }

    function get() constant returns (address, string, uint8, string, uint64, uint256) {
        return (token, title, optionsCount, optionsDescription, closes, snapshotBlock);
    }

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Signaled(address indexed signaler, uint8 option, uint256 stake);
}
