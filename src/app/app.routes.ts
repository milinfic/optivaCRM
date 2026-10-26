import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';
import { Login } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { MainLayout } from './layouts/main-layout/main-layout';
import { ClientsList } from './components/clients-list/clients-list';
import { ClientForm } from './components/client-form/client-form';
import { ClientDetail } from './components/client-detail/client-detail';
import { OpportunitiesList } from './components/opportunities-list/opportunities-list';
import { OpportunityForm } from './components/opportunity-form/opportunity-form';
import { OpportunityDetail } from './components/opportunity-detail/opportunity-detail';
import { InteractionsList } from './components/interactions-list/interactions-list';
import { Reports } from './components/reports/reports';
import { Settings } from './components/settings/settings';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: Dashboard },

      { path: 'clients/list', component: ClientsList },
      { path: 'clients/new', component: ClientForm },
      { path: 'clients/:id/edit', component: ClientForm },
      { path: 'clients/:id', component: ClientDetail },

      { path: 'opportunities/list', component: OpportunitiesList },
      { path: 'opportunities/new', component: OpportunityForm },
      { path: 'opportunities/:id/edit', component: OpportunityForm },
      { path: 'opportunities/:id', component: OpportunityDetail },

      { path: 'interactions', component: InteractionsList },
      { path: 'reports', component: Reports },

      { path: 'settings', component: Settings }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
