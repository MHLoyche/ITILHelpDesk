import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "dashboard" },
  {
    path: "",
    component: MainLayout,
    children: [
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
            path: "tickets/:id",
            loadComponent: () =>
            import("./pages/ticket-detail/ticket-detail").then((m) => m.TicketDetailComponent),
        },
        {
            path: "articles",
            loadComponent: () =>
            import("./pages/articles/articles").then((m) => m.Articles),
        },
        {
            path: "articles/:id",
            loadComponent: () =>
            import("./pages/article-detail/article-detail").then((m) => m.ArticleDetail),
        },
        {
            path: "sla-management",
            loadComponent: () =>
            import("./pages/sla-management/sla-management").then((m) => m.SlaManagement),
        },
        {
            path: "reports",
            loadComponent: () =>
            import("./pages/reports/reports").then((m) => m.Reports),
        },
        {
            path: "contact",
            loadComponent: () =>
            import("./pages/contact/contact").then((m) => m.Contact),
        },
        ],
    },
    {path: "**", redirectTo: "dashboard"},
];