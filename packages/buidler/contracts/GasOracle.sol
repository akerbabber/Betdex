pragma solidity ^0.5.0;

import "@chainlink/contracts/src/v0.5/ChainlinkClient.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract GasOracle is ChainlinkClient, Ownable {
  
  uint256 oraclePayment;
  int256 public gasPrice;
  
  constructor(uint256 _oraclePayment) public {
    setPublicChainlinkToken();
    oraclePayment = _oraclePayment;
  }
  // Additional functions here:
  function requestGasPriceByDate(address _oracle, bytes32 _jobId, string memory _date)
  public
  onlyOwner
{
  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillGasPrice.selector);
  req.add("action", "date");
  req.add("date", _date);
  req.add("copyPath", "gasPrice");
  req.addInt("times", 1000);
  sendChainlinkRequestTo(_oracle, req, oraclePayment);
}



function fulfillGasPrice(bytes32 _requestId, int256 _gasPrice)
  public
  recordChainlinkFulfillment(_requestId)
{
  gasPrice = _gasPrice;
}

}