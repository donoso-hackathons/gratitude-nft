import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BaseProvider } from '@ethersproject/providers';

describe('Gratitude Contract RECEIVER', function () {
  let gratitudeContract: any;
  let owner:SignerWithAddress;
  let addr1:SignerWithAddress;
  let addr2;
  let addrs;
  let provider:BaseProvider;
  let timeStamp:number;

  beforeEach(async () => {
    [owner,addr1,addr2] = await ethers.getSigners();

    provider = ethers.getDefaultProvider();


    const GratitudeContract = await ethers.getContractFactory(
      'GratitudeContract'
    );
    gratitudeContract = await GratitudeContract.deploy();
    await gratitudeContract.deployed();

    timeStamp = Math.ceil(new Date().getTime() / 1000);
  });




  it('If Not receiver known Should be able to approve when in timeframe 10 min ', async function () {
    const localTimestamp = Math.ceil(new Date().getTime() / 1000);
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      localTimestamp,
      'https://tokenuri',
      '67hghkihy9'
    );


    const nftOwner = await gratitudeContract.ownerOf(1)
    const status = await gratitudeContract.getStatus(1)
    await gratitudeContract.connect(addr1).acceptLinkHash('67hghkihy9')
    const afterNftOwner = await gratitudeContract.ownerOf(1)
    expect(nftOwner).to.equal(owner.address);
    expect(afterNftOwner).to.equal(addr1.address);



  });

  it('Receiver should not be able to reject NFT when not pending status', async function () {
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      timeStamp,
      'https://tokenuri',
      '67hghkihy9'
    );

    await gratitudeContract.connect(addr1).acceptLinkHash('67hghkihy9')
   
    await expect(
      gratitudeContract.connect(addr1).rejectGratitudeNFTbyLinkCode('67hghkihy9')
    ).to.be.revertedWith("NFT NOT IN PENDING STATUS");

  });



  it('If not receiver known Should  throw TIMEOUT when not in timeframe 10 min (50 min) ', async function () {
    
   let new_timeStamp = timeStamp - 50 * 60;
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      new_timeStamp,
      'https://tokenuri',
      '67hghkihy9'
    );
   
    await expect(
      gratitudeContract.connect(addr1).acceptLinkHash('67hghkihy9')
    ).to.be.revertedWith("TIMEOUT");

  });

  it('If receiver known Should be able to approve even when in timeframe 50 min ', async function () {
    
    let new_timeStamp = timeStamp - 50 * 60;
    await gratitudeContract.createGratitudeToken(
      1,
      addr1.address,
      { lat: 0, lng: 0 },
      new_timeStamp,
      'https://tokenuri',
      '67hghkihy9'
    );
   
    const nftOwner = await gratitudeContract.ownerOf(1)
    await gratitudeContract.connect(addr1).acceptLinkHash('67hghkihy9')
    const afterNftOwner = await gratitudeContract.ownerOf(1)
    expect(nftOwner).to.equal(owner.address);
    expect(afterNftOwner).to.equal(addr1.address);

  });


  it('Receiver should be able to reject NFT when in pending status', async function () {
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      timeStamp,
      'https://tokenuri',
      '67hghkihy9'
    );
   
    await gratitudeContract.connect(addr1).rejectGratitudeNFTbyLinkCode('67hghkihy9')
    expect(await gratitudeContract.getStatus(1)).to.equal(5)
  });




});
