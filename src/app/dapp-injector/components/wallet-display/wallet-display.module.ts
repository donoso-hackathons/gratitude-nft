import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ClipboardModule } from '@angular/cdk/clipboard';
import { WalletDisplayComponent } from './wallet-display.component';



@NgModule({
  declarations: [
    WalletDisplayComponent
  ],
  imports: [
    CommonModule,
    ClipboardModule,


  ],
  providers:[],
  exports: [WalletDisplayComponent
  ]
})
export class WalletDisplayModule { }
