import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGratitudeComponent } from './create-gratitude/create-gratitude.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateGratitudeWrappperComponent } from './create-gratitude-wrappper/create-gratitude-wrappper.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CreateRecordVideoComponent } from './create-record-video/create-record-video.component'
import {WebcamModule} from 'ngx-webcam';
import { CreateTakePhotoComponent } from './create-take-photo/create-take-photo.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ParticlesModule } from 'src/app/shared/components/particles/particles.module';
;
@NgModule({
  declarations: [
    CreateGratitudeComponent,
    CreateGratitudeWrappperComponent,
    CreateRecordVideoComponent,
    CreateTakePhotoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    WebcamModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ClipboardModule,
    ParticlesModule
  ],
  exports:[CreateGratitudeWrappperComponent]
})
export class CreateGratitudeModule { }
