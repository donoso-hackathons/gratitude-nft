import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DappInjectorModule } from './dapp-injector/dapp-injector.module';
import { StoreModule } from '@ngrx/store';
import { we3ReducerFunction } from 'angular-web3';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NftContractModule } from './nft-master/nft-contract.module';
import { IpfsService } from './pages/ipfs/ipfs-service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NftContractModule,
    DappInjectorModule,
    StoreModule.forRoot({web3: we3ReducerFunction}),
    NgbModule,
  ],
  providers: [IpfsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
