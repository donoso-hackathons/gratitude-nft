import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
// {
//       path: '',
//       redirectTo: '/landing',
//       pathMatch: 'full'
//     },
//     {
//       path: 'landing',
//       loadChildren: () =>
//         import('./pages/landing/landing.module').then(
//           (m) => m.LandingModule)
//     },
//     {
//       path: 'landing',
//       loadChildren: () =>
//         import('./pages/landing/landing.module').then(
//           (m) => m.LandingModule)
//     },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
