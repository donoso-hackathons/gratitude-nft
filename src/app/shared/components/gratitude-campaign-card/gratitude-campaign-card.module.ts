import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { GratitudeCampaignCardComponent } from './gratitude-campaign-card/gratitude-campaign-card.component';
import { ClipboardModule } from '@angular/cdk/clipboard';


@NgModule({
  declarations: [
    GratitudeCampaignCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ClipboardModule,
  ],
  exports: [
    GratitudeCampaignCardComponent
  ]
})
export class GratitudeCampaignCardModule { }
