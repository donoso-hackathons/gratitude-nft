
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DappInjectorService } from 'angular-web3';
import { Contract } from 'ethers';
import { IpfsService } from 'src/app/pages/ipfs/ipfs-service';
import { IGRATITUDE_NFT } from 'src/app/shared/models/general';

@Component({
  selector: 'token-card',
  templateUrl: './gratitude-token-card.component.html',
  styleUrls: ['./gratitude-token-card.component.scss'],
})
export class GratitudeTokenCardComponent implements AfterViewInit {
  gratitudeContract: Contract;
  src:string;
  
  constructor(private dappInjectorService: DappInjectorService, private ipfs:IpfsService) {

  }

  async onChainStuff(){
    if (this.gratitudeToken.type == 'image') {
      this.src = await this.ipfs.getblobFile(this.gratitudeToken.ipfsFileUrl) 
    }
  }

  ngAfterViewInit(): void {
    this.gratitudeContract =
    this.dappInjectorService.config.contracts['myContract'].contract;
    console.log(this.gratitudeToken)
    this.onChainStuff()
  

  }
  @Input() gratitudeToken: IGRATITUDE_NFT;
  @Input() linkCode: string;
  @Input() role: 'receiver' | 'creater';



  reject() {
    if (this.linkCode !== undefined) {
      try {
        const result = this.gratitudeContract.rejectGratitudeNFTbyLinkCode(this.linkCode);
      } catch (error) {
        // TODO Handle error}
      }
    }
  }

  async accept() {
    if (this.linkCode !== undefined) {
      try {
        const result = await this.gratitudeContract.acceptLinkHash(this.linkCode, {lat:500, lng:500});
        await result.wait()
      } catch (error) {
      const myerror =  this.dappInjectorService.handleContractError(error);
      console.log(error)
      }
    }
  }
}
