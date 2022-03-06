import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ICONTRACT } from './dapp-injector/models';
import { NETWORK_STATUS, web3Selectors } from './dapp-injector/store';
import { Location } from '@angular/common';
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
    private location: Location,
    private store:Store,
    private router:Router){

  }
  ngAfterViewInit(): void {
    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
      this.blockchain_status = value;
      console.log(this.location.path())
      console.log(this.location.path().indexOf('/inbox-gratitude'))
      if (this.location.path().indexOf('/inbox-gratitude') !==  -1){

      } else if (value == 'success'){
        console.log(this.router.url)
         this.router.navigateByUrl('/dashboard')
       } else {
         this.router.navigateByUrl('/landing')
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
