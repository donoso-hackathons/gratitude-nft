import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DappInjectorModule } from './dapp-injector/dapp-injector.module';
import { StoreModule } from '@ngrx/store';
import { DappInjectorService, DappLoadingModule, WalletDisplayModule, we3ReducerFunction} from 'angular-web3';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { MatIconModule } from '@angular/material/icon';
import { blockchain_imports, blockchain_providers } from './blockchain_wiring';
import { TopBarComponent } from './shared/components/top-bar/top-bar.component';
import {WebcamModule} from 'ngx-webcam';
import { IpfsService } from './pages/ipfs/ipfs-service';
import { ThegraphService } from './shared/services/thegraph.service';


@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,  
    DappInjectorModule,
    WalletDisplayModule,
    StoreModule.forRoot({web3: we3ReducerFunction}),
    NgbModule,
    MatIconModule,
    WebcamModule,
    DappLoadingModule,
    ...blockchain_imports
  ],
  providers: [...blockchain_providers,IpfsService,ThegraphService],
  bootstrap: [AppComponent]
})
export class AppModule { }
