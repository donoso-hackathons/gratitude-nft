import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GratitudeTokenCardComponent } from './gratitude-token-card/gratitude-token-card.component';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    GratitudeTokenCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    GratitudeTokenCardComponent
  ]
})
export class GratitudeTokenCardModule { }
