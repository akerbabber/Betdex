const { ethers } = require("@nomiclabs/buidler");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const testcases = require("@ethersproject/testcases");

const toBN = ethers.BigNumber.from;
const randomHex = testcases.randomHexString;

use(solidity);

describe("My Dapp", function () {
  let ConditionalTokens;
  let accounts = [];
  const [
    minter,
    oracle,
    notOracle,
    eoaTrader,
    fwdExecutor,
    safeExecutor,
    counterparty
  ] = accounts;

  describe("accounts", "Prints the list of accounts", async () => {
    accounts = await ethers.getSigners();
  });

  describe("YourContract", function () {
    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory("ConditionalTokens");

      ConditionalTokens = await YourContract.deploy();
    });
  });

  describe("prepareCondition", function () {
    it("should not be able to prepare a condition with no outcome slots", async function () {
      const questionId = randomHex(32);
      const outcomeSlotCount = 0;
      await expect(
        this.ConditionalTokens.prepareCondition(
          oracle,
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
        this.ConditionalTokens.prepareCondition(
          oracle,
          questionId,
          outcomeSlotCount
        ).to.be.reverted,
        "there should be more than one outcome slot"
      );
    });

    context("with valid parameters", async function () {
      const questionId = randomHex(32);
      const outcomeSlotCount = toBN(256);

      const conditionId = await ConditionalTokens.getConditionId(
        oracle,
        questionId,
        outcomeSlotCount
      );

      beforeEach(async function () {
        ({ logs: this.logs } = await this.ConditionalTokens.prepareCondition(
          oracle,
          questionId,
          outcomeSlotCount
        ));
      });

      it("should emit an ConditionPreparation event", async function () {
        expect.inLogs(this.logs, "ConditionPreparation", {
          conditionId,
          oracle,
          questionId,
          outcomeSlotCount,
        });
      });

      it("should make outcome slot count available via getOutcomeSlotCount", async function () {
        (
          await this.ConditionalTokens.getOutcomeSlotCount(conditionId)
        ).should.be.bignumber.equal(outcomeSlotCount);
      });

      it("should leave payout denominator unset", async function () {
        (
          await this.ConditionalTokens.payoutDenominator(conditionId)
        ).should.be.bignumber.equal("0");
      });

      it("should not be able to prepare the same condition more than once", async function () {
        await expect(
          this.ConditionalTokens.prepareCondition(
            oracle,
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
