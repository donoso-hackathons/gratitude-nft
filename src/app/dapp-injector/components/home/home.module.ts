import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';


import { DappLoadingModule } from '../loading/loading.module';




@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,

    DappLoadingModule
  ],
  exports: [
    HomeComponent,


  ]
})
export class HomeModule { }
