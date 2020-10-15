pragma solidity ^0.5.2;

import "@nomiclabs/buidler/console.sol";
import "@gnosis.pm/conditional-tokens-contracts/contracts/ConditionalTokens.sol";
contract YourContract {

  event SetPurpose(address sender, string purpose);

  string public purpose = "🛠 Programming Unstoppable Money";

  function setPurpose(string memory newPurpose) public {
    purpose = newPurpose;
    console.log(msg.sender,"set purpose to",purpose);
    emit SetPurpose(msg.sender, purpose);
  }

}
