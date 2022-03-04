import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxGratitudeComponent } from './inbox-gratitude/inbox-gratitude.component';

const routes: Routes = [{
  path:'', component:InboxGratitudeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxGratitudeRoutingModule { }
