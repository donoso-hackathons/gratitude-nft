import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BaseProvider } from '@ethersproject/providers';

describe('Gratitude Campaign CREATOR', function () {
  let gratitudeContract: any;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2;
  let addrs;
  let provider: BaseProvider;
  let timeStamp: number;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    provider = ethers.getDefaultProvider();

    const GratitudeContract = await ethers.getContractFactory(
      'GratitudeContract'
    );
    gratitudeContract = await GratitudeContract.deploy();
    await gratitudeContract.deployed();

    timeStamp = Math.ceil(new Date().getTime() / 1000);
  });
  it('Should have initial 0 Campaigns', async function () {
    const campaignId = await gratitudeContract._campaignIds();
    expect(campaignId).to.equal(0);
  });


  
  it('Should have initial 1 tokenIds after create Campaign and status must set to ONBOARD = 2', async function () {
    await gratitudeContract.createCampaign('https://sdada','myname')

    const campaignId = await gratitudeContract._campaignIds();
    expect(campaignId).to.equal(1);

    const status = await gratitudeContract.getCampaignStatus(1);

    expect(status).to.equal(0)

  });


  it('Contract Creator should be able to approve and reject', async function () {
    await gratitudeContract.createCampaign('https://sdada','myname')


    await gratitudeContract.approveCampaign(1)
    const status = await gratitudeContract.getCampaignStatus(1);
    expect(status).to.equal(1)

    await gratitudeContract.rejectCampaign(1)
    const statusReject = await gratitudeContract.getCampaignStatus(1);
    expect(statusReject).to.equal(2)


  });


  it('Only Contract Owner Creator should be able to verify', async function () {
    await gratitudeContract.createCampaign('https://sdada','myname')

    const campaignId = await gratitudeContract._campaignIds();
    await expect(
      gratitudeContract.connect(addr1).approveCampaign(1)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Only Contract Owner Creator should be able to reject', async function () {
    await gratitudeContract.createCampaign('https://sdada','myname')

    const campaignId = await gratitudeContract._campaignIds();
    await expect(
      gratitudeContract.connect(addr1).rejectCampaign(1)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });



});
