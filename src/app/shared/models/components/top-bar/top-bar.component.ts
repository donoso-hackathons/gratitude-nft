import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DappInjectorService, NETWORK_STATUS } from 'angular-web3';
import { connect } from 'http2';
import { Signer } from 'ethers';

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

  constructor(private dappInjectorService:DappInjectorService) {

   }
  ngOnChanges(changes: SimpleChanges): void {
  }

   @Input() public contractHeader!:any

   @Input() public blockchain_is_busy = false;
 
   @Input() public blockchain_status:NETWORK_STATUS = 'loading';
   
   @Input() public signer!:Signer;
   @Output() public doFaucetEvent = new EventEmitter();
   @Output() public openTransactionEvent = new EventEmitter();

  connect(){
      
  }

  ngOnInit(): void {
  }
  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
