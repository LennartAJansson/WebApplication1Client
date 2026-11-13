import { Routes } from '@angular/router';
import { CustomerListComponent } from './features/customers/customer-list.component';
import { EmployeeListComponent } from './features/employees/employee-list.component';
import { EntityDetailComponent } from './features/shared/entity-detail.component';
import { EntityFormComponent } from './features/shared/entity-form.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'customers' },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: EntityFormComponent, data: { entity: 'customer' } },
  { path: 'customers/:id/edit', component: EntityFormComponent, data: { entity: 'customer' } },
  { path: 'customers/:id', component: EntityDetailComponent, data: { entity: 'customer' } },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/new', component: EntityFormComponent, data: { entity: 'employee' } },
  { path: 'employees/:id/edit', component: EntityFormComponent, data: { entity: 'employee' } },
  { path: 'employees/:id', component: EntityDetailComponent, data: { entity: 'employee' } },
  {
    path: 'workloads/new',
    loadComponent: () =>
      import('./features/workloads/workload-form.component').then((m) => m.WorkloadFormComponent),
  },
  {
    path: 'workloads',
    loadComponent: () =>
      import('./features/workloads/workload-list.component').then((m) => m.WorkloadListComponent),
  },
  { path: '**', redirectTo: 'customers' },
];
