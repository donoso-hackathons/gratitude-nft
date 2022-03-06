import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DappInjectorService, ICONTRACT, netWorkByName, NETWORK_STATUS, NETWORK_TYPE, NotifierService, Web3Actions, Web3State } from 'angular-web3';
import { connect } from 'http2';
import { ethers, providers, Signer } from 'ethers';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnChanges, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject();
  uiState ={
    open: false,
    }
    title = 'barrio';
    show_login_verlay = false;
  contractHeader: ICONTRACT;
  signer: Signer;
  isOpen = false;
  constructor(
    private router:Router,
    private notifierService: NotifierService,
    private store: Store<Web3State>,
    private dappInjectorService:DappInjectorService) {
      
   }
  ngOnChanges(changes: SimpleChanges): void {
    
    this.contractHeader = this.dappInjectorService.contractHeader;
    this.signer = this.dappInjectorService.config.signer
  }



   @Input() public blockchain_is_busy = false;
 
   @Input() public blockchain_status:NETWORK_STATUS = 'loading';
   
 
   @Output() public doFaucetEvent = new EventEmitter();
   @Output() public openTransactionEvent = new EventEmitter();

  connect(){
    this.dappInjectorService.launchWenmodal();
    
  }

  async doFaucet(status?) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    if (this.dappInjectorService.config.connectedNetwork == 'localhost') {
      let amountInEther = '0.1';
      // Create a transaction object

      let tx = {
        to: await this.dappInjectorService.config.signer?.getAddress(),
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amountInEther),
      };

      const localSigner = (
        (await this.dappInjectorService.config
          .defaultProvider) as providers.JsonRpcProvider
      ).getSigner();

      const transaction_result = await this.dappInjectorService.doTransaction(
        tx,
        localSigner
      );

      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      if (!status){
      await this.notifierService.showNotificationTransaction(
        transaction_result
      );
      }
    } else {
      const href = netWorkByName(
        this.dappInjectorService.config.connectedNetwork as NETWORK_TYPE
      );
      if (href.faucet) {
        window.open(
          href.faucet,
          '_blank' // <- This is what makes it open in a new window.
        );
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      } else {
        alert(
          `Sorry no faucet found for network ${this.dappInjectorService.config.connectedNetwork} `
        );
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      }
    }
  }

  disconnect(){
    this.isOpen = false;
    this.router.navigateByUrl('/landing')
  }

 togglemenu() {
   this.isOpen = !this.isOpen;
 }

  ngOnInit(): void {
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
