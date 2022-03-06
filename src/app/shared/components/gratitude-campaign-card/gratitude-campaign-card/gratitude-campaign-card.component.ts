
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DappInjectorService } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { IpfsService } from 'src/app/pages/ipfs/ipfs-service';
import { IGRATITUDE_CAMPAIGN, IGRATITUDE_NFT } from 'src/app/shared/models/general';

@Component({
  selector: 'campaign-card',
  templateUrl: './gratitude-campaign-card.component.html',
  styleUrls: ['./gratitude-campaign-card.component.scss'],
})
export class GratitudeCampaignCardComponent implements AfterViewInit {
  gratitudeContract: Contract;
  src:string;
  
  constructor(private dappInjectorService: DappInjectorService, private ipfs:IpfsService) {

  }

  async onChainStuff(){
    // if (this.gratitudeCampaign.type == 'image') {
    //   this.src = await this.ipfs.getblobFile(this.gratitudeCampaign.ipfsFileUrl) 
    // }
  }

  ngAfterViewInit(): void {
    this.gratitudeContract =
    this.dappInjectorService.config.contracts['myContract'].contract;
    console.log(this.gratitudeCampaign)
    this.onChainStuff()
  

  }
  @Input() gratitudeCampaign:IGRATITUDE_CAMPAIGN ;
  @Input() role = 'campaign'






}
