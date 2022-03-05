import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DappInjectorService } from 'angular-web3';
import { Contract } from 'ethers';
import { IpfsService } from '../../ipfs/ipfs-service';

@Component({
  selector: 'nft-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  tokens= []
  gratitudeContract: Contract;
  constructor(private dappInjectorService:DappInjectorService,public ipfsService: IpfsService,) { }

  async getTokens() {
    const gratitude_tokens = await this.gratitudeContract.getCreatorTokens()
    console.log(gratitude_tokens)

    for (const token of gratitude_tokens) {
          const tokenId = token.tokenId;
          const status = token.status;
          console.log(token.tokenUri)
          const tokenUri = token.tokenUri.toString()
          console.log(tokenUri)
          const ipfs_json = await this.ipfsService.getFileJSON(tokenUri)
          console.log(ipfs_json)

    
    }

  }


  ngAfterViewInit(): void {
    this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract;
    this.getTokens()

  }
}
