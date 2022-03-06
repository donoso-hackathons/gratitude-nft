import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DappInjectorService, ICONTRACT, NETWORK_STATUS } from 'angular-web3';
import { connect } from 'http2';
import { Signer } from 'ethers';
import { Router } from '@angular/router';

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
