import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappInjectorService } from './dapp-injector/dapp-injector.service';
import { ICONTRACT } from './dapp-injector/models';
import { NETWORK_STATUS, web3Selectors } from './dapp-injector/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'gratitude-nft';
  blockchain_is_busy: boolean = true;
  public blockchain_status: NETWORK_STATUS = 'loading';
  signer: any;
  contractHeader!: ICONTRACT;
  constructor(
    private dappInjectorService:DappInjectorService,
    private store:Store,
    private router:Router){

  }
  ngAfterViewInit(): void {
    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
      this.blockchain_status = value;
      console.log(value)
      if (value == 'success'){
        this.signer = this.dappInjectorService.config.signer;
        this.contractHeader = this.dappInjectorService.contractHeader;
       // this.router.navigateByUrl('/master')
      }
    });

    this.store
      .select(web3Selectors.isNetworkBusy)
      .subscribe((isBusy: boolean) => {
        console.log(isBusy);
        this.blockchain_is_busy = isBusy;
      });
  }
}
