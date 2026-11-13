import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { WorkloadCustomer, WorkloadEmployee } from '../../core/models/api.models';
import { getApiErrorMessage } from '../shared/api-error';

@Component({
  selector: 'app-workload-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './workload-form.component.html',
  styleUrl: './workload-form.component.scss',
})
export class WorkloadFormComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);

  protected readonly form = this.formBuilder.group({
    employeeId: ['', Validators.required],
    customerId: ['', Validators.required],
    notes: [''],
  });
  protected readonly employees = signal<WorkloadEmployee[]>([]);
  protected readonly customers = signal<WorkloadCustomer[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  ngOnInit(): void {
    forkJoin({
      employees: this.api.getWorkloadEmployees(),
      customers: this.api.getWorkloadCustomers(),
    }).subscribe({
      next: ({ employees, customers }) => {
        this.employees.set(employees.employees);
        this.customers.set(customers.customers);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(getApiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected submit(): void {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.api.startWorkload(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/workloads']);
      },
      error: (error: unknown) => {
        this.error.set(getApiErrorMessage(error));
        this.saving.set(false);
      },
    });
  }
}
