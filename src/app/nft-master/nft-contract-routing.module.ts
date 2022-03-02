import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NftContractComponent } from './nft-contract/nft-contract.component';



const routes: Routes = [{ path: '', component: NftContractComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NftContractRoutingModule { }
