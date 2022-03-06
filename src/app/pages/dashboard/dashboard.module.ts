import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GratitudeTokenCardModule } from 'src/app/shared/components/gratitude-token-card/gratitude-token-card.module';
import {MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    GratitudeTokenCardModule,
    DashboardRoutingModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule
  ],
  exports:[DashboardComponent]
})
export class DashboardModule { }
