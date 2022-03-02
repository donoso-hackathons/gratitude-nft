import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { ParticlesModule } from 'src/app/shared/models/components/particles/particles.module';

import { LandingRoutingModule } from './landing-routing.module';



@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    ParticlesModule,
    LandingRoutingModule 
  
  ],
  exports: [LandingComponent]
})
export class LandingModule { }
