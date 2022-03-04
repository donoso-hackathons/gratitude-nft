import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGratitudeComponent } from './create-gratitude/create-gratitude.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateGratitudeWrappperComponent } from './create-gratitude-wrappper/create-gratitude-wrappper.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CreateRecordVideoComponent } from './create-record-video/create-record-video.component';
@NgModule({
  declarations: [
    CreateGratitudeComponent,
    CreateGratitudeWrappperComponent,
    CreateRecordVideoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  exports:[CreateGratitudeWrappperComponent]
})
export class CreateGratitudeModule { }
