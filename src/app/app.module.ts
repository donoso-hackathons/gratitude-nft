import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DappInjectorModule } from './dapp-injector/dapp-injector.module';
import { StoreModule } from '@ngrx/store';
import { we3ReducerFunction} from 'angular-web3';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { MatIconModule } from '@angular/material/icon';
import { blockchain_imports, blockchain_providers } from './blockchain_wiring';



@NgModule({
  declarations: [
    AppComponent,
    // TopBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,  
    DappInjectorModule,
    
    StoreModule.forRoot({web3: we3ReducerFunction}),
    NgbModule,
    MatIconModule,
    ...blockchain_imports
  ],
  providers: [...blockchain_providers],
  bootstrap: [AppComponent]
})
export class AppModule { }
