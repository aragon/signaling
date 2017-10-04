pragma solidity 0.4.15;

import "./Owned.sol";
import "./Signal.sol";

contract SignalsRegistry is Owned {
    MiniMeToken token;

    uint256[] public allSignalIds;
    mapping (uint256 => Signal) public signals;

    event SignalSet(uint256 signalId, address signal);

    function SignalsRegistry(MiniMeToken _token) {
        token = _token;
    }

    function createSignal(uint256 _signalId, string _title, uint8 _optionsCount, string _optionsDescription, uint64 _closes) onlyOwner {
        Signal signal = new Signal(token, _title, _optionsCount, _optionsDescription, _closes);
        setSignal(_signalId, signal);
    }

    function setSignal(uint256 _signalId, Signal _signal) onlyOwner {
        if (address(signals[_signalId]) == 0)
            allSignalIds.push(_signalId);

        signals[_signalId] = _signal;

        SignalSet(_signalId, _signal);
    }
}
