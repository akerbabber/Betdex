const { ethers } = require("@nomiclabs/buidler");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
// const testcases = require("@ethersproject/testcases");
const web3 = require("web3");

// const toBN = ethers.BigNumber.from;
const { randomHex, toBN } = web3.utils;

use(solidity);

describe("My Dapp", function () {
  let CTartifacts;
  let ConditionalTokens;
  const accounts = [];
  let conditionId;
  let [
    minter,
    oracle,
    notOracle,
    eoaTrader,
    fwdExecutor,
    safeExecutor,
    counterparty,
  ] = [];
  // let oracle;
  let oracleAddr;

  describe("prepareCondition", function () {
    /* beforeEach("YourContract", async function () {
      const YourContract = await ethers.getContractFactory("ConditionalTokens");

      ConditionalTokens = await YourContract.deploy();
      await ConditionalTokens.deployed();
      ConditionalTokens.deployTransaction.wait();
    }); */
    before("Should generate random addresses", async function () {
      [
        minter,
        oracle,
        notOracle,
        eoaTrader,
        fwdExecutor,
        safeExecutor,
        counterparty,
      ] = await ethers.getSigners();
      oracleAddr = await oracle.getAddress();
    });
    before("Should deploy ConditionalTOkens", async function () {
      CTartifacts = await ethers.getContractFactory("ConditionalTokens");
    });
    before("Should deploy my SmartContractWallet", async function () {
      // CTartifacts = await ethers.getContractFactory("ConditionalTokens");
      ConditionalTokens = await CTartifacts.deploy();
      await ConditionalTokens.deployed();
    });
    it("should not be able to prepare a condition with no outcome slots", async function () {
      const questionId = randomHex(32);
      const outcomeSlotCount = 0;
      await expect(
        ConditionalTokens.prepareCondition(
          oracleAddr,
          questionId,
          outcomeSlotCount
        ),
        "there should be more than one outcome slot"
      ).to.be.reverted;
    });
    it("should not be able to prepare a condition with just one outcome slots", async function () {
      const questionId = randomHex(32);
      const outcomeSlotCount = 1;
      await expect(
        ConditionalTokens.prepareCondition(
          oracleAddr,
          questionId,
          outcomeSlotCount
        ),
        "there should be more than one outcome slot"
      ).to.be.reverted;
    });

    context("with valid parameters", async function () {
      const questionId = randomHex(32);
      const outcomeSlotCount = ethers.BigNumber.from(256);
      let eventProvider;
      let receipt;
      before(async function () {
        await ConditionalTokens.deployed();
      });
      before("should get ConditionId", async function () {
        conditionId = await ConditionalTokens.getConditionId(
          oracleAddr,
          questionId,
          outcomeSlotCount
        );
      });

      before("should emit event", async function () {
        await expect(
          ConditionalTokens.prepareCondition(
            oracleAddr,
            questionId,
            outcomeSlotCount
          )
        )
          .to.emit(ConditionalTokens, "ConditionPreparation")
          .withArgs(conditionId, oracleAddr, questionId, outcomeSlotCount);
      });

      /*  it("should emit an ConditionPreparation event", async function () {
        const oracleAddr = oracle.getAddress();
        console.log(receipt);
        expect(
          ConditionalTokens.prepareCondition(
            oracle.getAddress(),
            questionId,
            outcomeSlotCount
          )
        )
          .to.emit(ConditionalTokens, "ConditionPreparation")
          .withArgs(conditionId, oracleAddr, questionId, outcomeSlotCount);
      }); */

      it("should make outcome slot count available via getOutcomeSlotCount", async function () {
        expect(
          await ConditionalTokens.getOutcomeSlotCount(conditionId)
        ).to.equal(outcomeSlotCount);
      });

      it("should leave payout denominator unset", async function () {
        expect(
          await ConditionalTokens.payoutDenominator(conditionId)
        ).to.be.equal("0");
      });

      it("should not be able to prepare the same condition more than once", async function () {
        await expect(
          ConditionalTokens.prepareCondition(
            oracleAddr,
            questionId,
            outcomeSlotCount
          ),
          "condition already prepared"
        ).to.be.reverted;
      });
    });
  });
  /* describe("setPurpose()", function () {
    it("Should be able to set a new purpose", async function () {
      const newPurpose = "Test Purpose";

      await ConditionalTokens.setPurpose(newPurpose);
      expect(await ConditionalTokens.purpose()).to.equal(newPurpose);
    }); 
  }); */
});
