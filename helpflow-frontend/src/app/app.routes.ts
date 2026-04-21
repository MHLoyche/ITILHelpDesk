import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Tickets } from './pages/tickets/tickets';
import { Articles } from './pages/articles/articles';
import { SlaManagement } from './pages/sla-management/sla-management';

export const routes: Routes = [
    {
    path: '',
    component: MainLayout,
    children: [
        { path: 'dashboard', component: Dashboard },
        { path: 'tickets', component: Tickets },
        { path: 'articles', component: Articles },
        { path: 'sla-management', component: SlaManagement }
    ]
    }
];
