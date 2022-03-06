import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NftContractComponent } from './nft-contract/nft-contract.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { IpfsModule } from '../pages/ipfs/ipfs.module';
import { CreateGratitudeModule } from '../pages/create-gratitude/create-gratitude.module';

import { NftContractRoutingModule } from './nft-contract-routing.module';
import { blockchain_imports, blockchain_providers } from '../blockchain_wiring';
import { DashboardModule } from '../pages/dashboard/dashboard.module';



@NgModule({
  declarations: [
    NftContractComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    IpfsModule,
    CreateGratitudeModule,
    NftContractRoutingModule,

    ...blockchain_imports
  ],
  providers:[...blockchain_providers] ,
  exports: [
    NftContractComponent
  ]
})
export class NftContractModule { }
