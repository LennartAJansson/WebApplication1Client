import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { forkJoin, from } from 'rxjs';
import { map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { Workload, WorkloadCustomer, WorkloadEmployee } from '../../core/models/api.models';
import { getApiErrorMessage } from '../shared/api-error';

interface WorkloadRow extends Workload {
  employeeName: string;
  customerName: string;
}

@Component({
  selector: 'app-workload-list',
  imports: [
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './workload-list.component.html',
  styleUrl: './workload-list.component.scss',
})
export class WorkloadListComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly employees = signal<WorkloadEmployee[]>([]);
  protected readonly customers = signal<WorkloadCustomer[]>([]);
  protected readonly workloads = signal<Workload[]>([]);
  protected readonly employeeFilter = signal('');
  protected readonly customerFilter = signal('');
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly stoppingId = signal<string | null>(null);
  protected readonly displayedColumns = ['start', 'stop', 'employee', 'customer', 'notes', 'actions'];

  protected readonly rows = computed<WorkloadRow[]>(() => {
    const employeeNames = new Map(
      this.employees().map((employee) => [
        employee.id,
        `${employee.givenName} ${employee.surname}`.trim(),
      ]),
    );
    const customerNames = new Map(
      this.customers().map((customer) => [customer.id, customer.companyName]),
    );

    return this.workloads()
      .filter(
        (workload) =>
          (!this.employeeFilter() || workload.employeeId === this.employeeFilter()) &&
          (!this.customerFilter() || workload.customerId === this.customerFilter()),
      )
      .map((workload) => ({
        ...workload,
        employeeName: employeeNames.get(workload.employeeId) ?? workload.employeeId,
        customerName: customerNames.get(workload.customerId) ?? workload.customerId,
      }));
  });

  ngOnInit(): void {
    this.loadWorkloads();
  }

  protected loadWorkloads(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      employees: this.api.getWorkloadEmployees(),
      customers: this.api.getWorkloadCustomers(),
    })
      .pipe(
        switchMap(({ employees, customers }) => {
          this.employees.set(employees.employees);
          this.customers.set(customers.customers);

          return from(employees.employees).pipe(
            mergeMap(({ id }) => this.api.getWorkloadsByEmployee(id), 5),
            toArray(),
            map((responses) => responses.flatMap((response) => response.workloads)),
          );
        }),
      )
      .subscribe({
        next: (workloads) => {
          this.workloads.set(workloads);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.error.set(getApiErrorMessage(error));
          this.loading.set(false);
        },
      });
  }

  protected stopWorkload(workload: WorkloadRow): void {
    this.stoppingId.set(workload.id);
    this.error.set('');

    this.api.stopWorkload(workload.id).subscribe({
      next: (stoppedWorkload) => {
        this.workloads.update((workloads) =>
          workloads.map((item) => (item.id === stoppedWorkload.id ? stoppedWorkload : item)),
        );
        this.stoppingId.set(null);
      },
      error: (error: unknown) => {
        this.error.set(getApiErrorMessage(error));
        this.stoppingId.set(null);
      },
    });
  }
}
