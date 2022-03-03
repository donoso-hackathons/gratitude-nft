import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGratitudeComponent } from './create-gratitude/create-gratitude.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreateGratitudeComponent
  ],
  imports: [
    CommonModule,FormsModule
  ],
  exports:[CreateGratitudeComponent]
})
export class CreateGratitudeModule { }
