import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InboxGratitudeRoutingModule } from './inbox-gratitude-routing.module';
import { InboxGratitudeComponent } from './inbox-gratitude/inbox-gratitude.component';
import { ParticlesModule } from 'src/app/shared/components/particles/particles.module';
import { GratitudeTokenCardModule } from 'src/app/shared/components/gratitude-token-card/gratitude-token-card.module';
import { IpfsService } from '../ipfs/ipfs-service';


@NgModule({
  declarations: [
    InboxGratitudeComponent
  ],
  imports: [
    CommonModule,
    InboxGratitudeRoutingModule,
    ParticlesModule,
    GratitudeTokenCardModule
  ],
})
export class InboxGratitudeModule { }
