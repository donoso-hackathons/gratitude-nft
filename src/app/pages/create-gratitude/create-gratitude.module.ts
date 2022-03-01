import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGratitudeComponent } from './create-gratitude/create-gratitude.component';



@NgModule({
  declarations: [
    CreateGratitudeComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[CreateGratitudeComponent]
})
export class CreateGratitudeModule { }
