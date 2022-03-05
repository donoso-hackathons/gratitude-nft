import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BaseProvider } from '@ethersproject/providers';

describe('Gratitude Contract CREATOR', function () {
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
  it('Should have initial 0 tokenIds', async function () {
    const tokenId = await gratitudeContract._tokenIds();
    expect(tokenId).to.equal(0);
  });


  
  it('Should have initial 1 tokenIds after create Gratitude Token', async function () {
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      timeStamp,
      'https://tokenuri',
      '67hghkihy9'
    );

    const tokenId = await gratitudeContract._tokenIds();
    expect(tokenId).to.equal(1);
  });

  it('Creator Should change the status to TIMEOUT while chcing and not in 10 m in timeframe (50 min) ', async function () {
    let new_timeStamp = timeStamp - 50 * 60;
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      new_timeStamp,
      'https://tokenuri',
      '67hghkihy9'
    );

    await gratitudeContract.checkPendingStatusPriorToGet(1);

    const status = await gratitudeContract.getStatus(1);
    expect(status).to.equal(3);
  });

  it('Creator should be able to cancel whole pending and set status to standby', async function () {
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      timeStamp,
      'https://tokenuri',
      '67hghkihy9'
    );

    await gratitudeContract.cancelWhenStillPending(1);
    const status = await gratitudeContract.getStatus(1);
    expect(status).to.equal(2);
  });

  it('Only Creator should be able to cancel', async function () {
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      timeStamp,
      'https://tokenuri',
      '67hghkihy9'
    );
    await expect(
      gratitudeContract.connect(addr1).cancelWhenStillPending(1)
    ).to.be.revertedWith("NOT CREATOR");

  });

  it('Creator should be able to resend when rejected, timeout or standby', async function () {
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      timeStamp,
      'https://tokenuri',
      '67hghkihy9'
    );

    await expect(
      gratitudeContract.resendWhenTimeOutOrRejectedOrStandby(1,addr1.address,'67hghkinew')
    ).to.be.revertedWith("NFT IS NOT REJECTED NOR TIMEOUT NOR STANDBY");
    await gratitudeContract.cancelWhenStillPending(1);
    const status = await gratitudeContract.getStatus(1);
    expect(status).to.equal(2);
    await gratitudeContract.resendWhenTimeOutOrRejectedOrStandby(1,addr1.address,'67hghkinew');
    const statusafter = await gratitudeContract.getStatus(1);
    expect(statusafter).to.equal(1);

  });

});
