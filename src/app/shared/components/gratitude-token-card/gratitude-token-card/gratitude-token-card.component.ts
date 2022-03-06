
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappInjectorService, NotifierService, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';
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
  show_mint_success 
  constructor(
    private router:Router,
    private store:Store,
    private notifierService: NotifierService,
    private dappInjectorService: DappInjectorService, private ipfs:IpfsService) {

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
    if (this.gratitudeToken.status !=1){
      this.router.navigateByUrl('/dashboard')
    }
    this.onChainStuff()
  

  }
  @Input() gratitudeToken: IGRATITUDE_NFT;
  @Input() linkCode: string;
  @Input() role: 'receiver' | 'creater';



  reject() {
    if (this.linkCode !== undefined) {
      try {
        const result = this.gratitudeContract.rejectGratitudeNFTbyLinkCode(this.linkCode,  { gasPrice: utils.parseUnits('100', 'gwei'), 
        gasLimit: 2000000 });
      } catch (error) {
        // TODO Handle error}
      }
    }
  }

  async accept() {
    if (this.linkCode !== undefined) {
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));
      try {
        const result = await this.gratitudeContract.acceptLinkHash(this.linkCode, {lat:500, lng:500},  { gasPrice: utils.parseUnits('100', 'gwei'), 
        gasLimit: 2000000 });
        const tx= await result.wait()
        this.router.navigateByUrl('/dashboard')
      }  catch (error) {
        const error_message = await this.dappInjectorService.handleContractError(error);
        this.notifierService.showNotificationTransaction({success:false, error_message: error_message});
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
        
      }
    }
  }
}
