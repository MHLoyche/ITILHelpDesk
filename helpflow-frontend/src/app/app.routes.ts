import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Tickets } from './pages/tickets/tickets';
import { Articles } from './pages/articles/articles';
import { SlaManagement } from './pages/sla-management/sla-management';

export const routes: Routes = [
  {
    path: "",
    component: MainLayout,
    children: [
        {
            path: "",
            pathMatch: "full",
            redirectTo: "dashboard",
        },
        {
            path: "dashboard",
            loadComponent: () =>
            import("./pages/dashboard/dashboard").then((m) => m.Dashboard),
        },
        {
            path: "tickets",
            loadComponent: () =>
            import("./pages/tickets/tickets").then((m) => m.Tickets),
        },
        {
            path: "articles",
            loadComponent: () =>
            import("./pages/articles/articles").then((m) => m.Articles),
        },
        {
            path: "sla-management",
            loadComponent: () =>
            import("./pages/sla-management/sla-management").then((m) => m.SlaManagement),
        },
        ],
    },
    {path: "**", redirectTo: ""},
];