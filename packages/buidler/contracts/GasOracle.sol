pragma solidity ^0.5.0;

import "@chainlink/contracts/src/v0.5/ChainlinkClient.sol";

contract GasOracle is ChainlinkClient {
  
  uint256 oraclePayment;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  
}