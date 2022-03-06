import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignComponent } from './campaign/campaign.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { GratitudeCampaignCardModule } from 'src/app/shared/components/gratitude-campaign-card/gratitude-campaign-card.module';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    CampaignComponent,
    CreateCampaignComponent
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    GratitudeCampaignCardModule
  ]
})
export class CampaignModule { }
