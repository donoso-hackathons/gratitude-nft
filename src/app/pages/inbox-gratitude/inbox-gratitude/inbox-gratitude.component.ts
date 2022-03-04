import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappInjectorService, Web3Actions } from 'angular-web3';
import { Contract } from 'ethers';
import { IGRATITUDE_NFT } from 'src/app/shared/models/general';

@Component({
  selector: 'inbox-gratitude',
  templateUrl: './inbox-gratitude.component.html',
  styleUrls: ['./inbox-gratitude.component.scss']
})
export class InboxGratitudeComponent implements AfterViewInit {
  gratitudeContract: Contract;
  gratitudeToken:IGRATITUDE_NFT;
  linkCode: string;
  constructor(private dappInjectorService:DappInjectorService,
    private router: Router,
    private store:Store,
    private route: ActivatedRoute) {
     
     }
 


    async getToken() {
      const nft = await this.gratitudeContract.getGratitudeNFtByLinkCode(this.linkCode)
      console.log(nft)
      const status = nft.status;
      const tokenUri = nft.tokenUri;
      const tokenId = nft.tokenId;
      const ipfsJson = {} /// TODO  DOENLOAD IPFSJSON knwoing the tokenuri

      this.gratitudeToken =  {...ipfsJson,...{ status,tokenId}} as IGRATITUDE_NFT;


    }
 
 
    ngAfterViewInit(): void {
    this.store.dispatch(Web3Actions.chainBusy({ status: true}));
    this.linkCode = this.route.snapshot.params['linkCode'];
    console.log(this.route.params)
    this.gratitudeContract =  this.dappInjectorService.config.contracts['myContract'].contract
    if (this.linkCode) {
        console.log('linkcode')
        this.getToken()
    } else {
     // this.router.navigateByUrl('/master')
    }

  }


}
