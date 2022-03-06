import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selectedIndex = 0;
  gratitudeContract: Contract;
  constructor(
    private dappInjectorService:DappInjectorService,
    public ipfsService: IpfsService,
    public router:Router
    ) { }

  async getTokens() {
    const gratitude_tokens = await this.gratitudeContract.getCreatorTokens()
    console.log(gratitude_tokens)

    for (const token of gratitude_tokens) {
          const tokenId = token.tokenId;
          const status = token.status;
          console.log(token.tokenUri)
          const tokenUri = token.tokenUri.toString().replace('https://ipfs.io/ipfs/','');;
      
          await this.ipfsService.init()
          const ipfs_json = await this.ipfsService.getFileJSON(tokenUri)
          console.log(ipfs_json)
    
         this.tokens.push({...ipfs_json,...{ status,tokenId}});
    
    }

  }
  createtoken(){
    this.router.navigateByUrl('/master')
  }

  ngAfterViewInit(): void {
    this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract;
    this.getTokens()

    // gratitudeTokens(first: 5, where: {
    //   sender: "0x464b916c32e9ab72cfa5e94a4ab768797b46a1dd",
    // } ) {
    //   id
    //   status
    //   sender
    //   receiver
    // }

  }
}
