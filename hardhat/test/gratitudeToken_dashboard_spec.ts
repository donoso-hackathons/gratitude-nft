import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BaseProvider } from '@ethersproject/providers';

describe('Gratitude Contract DASHBOARD', function () {
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
 
  
  it('Should have two tokenIds after create two Gratitude Token ', async function () {
    await gratitudeContract.createGratitudeToken(
      1,
      '0x0000000000000000000000000000000000000000',
      { lat: 0, lng: 0 },
      timeStamp,
      'https://tokenuri1',
      '67hghkihy9'
    );

    await gratitudeContract.createGratitudeToken(
      1,
        addr1.address,
      { lat: 0, lng: 0 },
      timeStamp,
      'https://tokenuri2',
      '67hghkihXX'
    );
    

    const tokenId = await gratitudeContract._tokenIds();
    expect(tokenId).to.equal(2);
    const NFTS  = await gratitudeContract.getCreatorTokens()
    expect(NFTS.length).equal(2)


 

    await gratitudeContract.connect(addr1).acceptLinkHash('67hghkihXX',{lat:0, lng:0})

    const NFTS_after  = await gratitudeContract.getCreatorTokens()
    

    expect(await gratitudeContract.ownerOf(1)).equal(owner.address)
    expect(await gratitudeContract.ownerOf(2)).equal(addr1.address)

  });


});
