import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GratitudeTokenCardModule } from 'src/app/shared/components/gratitude-token-card/gratitude-token-card.module';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    GratitudeTokenCardModule,
    DashboardRoutingModule,
    MatDividerModule
  ]
})
export class DashboardModule { }
