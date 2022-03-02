import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DappInjectorService } from './dapp-injector.service';
import { ISTARTUP_CONFIG } from './models';
import { Web3ModalModule } from './components';

export const startUpConfig:ISTARTUP_CONFIG = {
  defaultNetwork: 'localhost',
  defaultProvider:'noop',
  connectedNetwork:'',
  wallet: 'burner',
  blockSubscription: false,
  providers:{},
  contracts:{},

}


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Web3ModalModule
  ]
})

export class DappInjectorModule { 
  static forRoot(): ModuleWithProviders<DappInjectorModule> {
    return {
      ngModule: DappInjectorModule,
      providers: [
        {provide: DappInjectorService}
      ]
    };
  }
 }
