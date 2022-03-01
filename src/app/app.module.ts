import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NFTContractModule } from './dapp-demos/3-nft-contract/nft-contract.module';
import { DappInjectorModule } from './dapp-injector/dapp-injector.module';
import { StoreModule } from '@ngrx/store';
import { we3ReducerFunction } from 'angular-web3';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NFTContractModule,
    DappInjectorModule,
    StoreModule.forRoot({web3: we3ReducerFunction}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
