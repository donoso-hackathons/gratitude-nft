import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{
      path: '', 
      redirectTo: '/landing',
      pathMatch: 'full'
    },
    {
      path: 'landing',
      loadChildren: () =>
        import('./pages/landing/landing.module').then(
          (m) => m.LandingModule)
    },
    {
      path: 'dashboard',
      loadChildren: () =>
        import('./pages/dashboard/dashboard.module').then(
          (m) => m.DashboardModule)
    },
    {
      path: 'inbox-gratitude',
      loadChildren: () =>
        import('./pages/inbox-gratitude/inbox-gratitude.module').then(
          (m) => m.InboxGratitudeModule)
    },
    {
      path: 'master',
      loadChildren: () =>
        import('./nft-master/nft-contract.module').then(
          (m) => m.NftContractModule)
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
