import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";


describe("NFT Contract", function () {
  it("Should return the new greeting once it's changed", async function () {
    const NftContract = await ethers.getContractFactory("NftContract");
    const nftContract = await NftContract.deploy();
    await nftContract.deployed();

    const setGreetingTx = await nftContract.setGreeting("Hola, mundo!");
    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await nftContract.greet()).to.equal("Hola, mundo!");
  });

});
