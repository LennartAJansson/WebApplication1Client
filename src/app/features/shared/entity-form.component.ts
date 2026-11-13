import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../core/services/api.service';
import { getApiErrorMessage } from './api-error';

type EntityType = 'customer' | 'employee';

@Component({
  selector: 'app-entity-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.scss',
})
export class EntityFormComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly form = this.formBuilder.group({
    companyName: [''],
    organizationNumber: [''],
    contactName: [''],
    ssid: [''],
    title: [''],
    givenName: [''],
    surname: [''],
    street: [''],
    postalCode: [''],
    city: [''],
    phone: [''],
  });
  protected readonly entity = signal<EntityType>('customer');
  protected readonly id = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  ngOnInit(): void {
    const entity = this.route.snapshot.data['entity'];
    if (entity !== 'customer' && entity !== 'employee') {
      this.error.set('Ogiltig typ av post.');
      return;
    }

    this.entity.set(entity);
    this.id.set(this.route.snapshot.paramMap.get('id'));

    if (entity === 'customer') {
      for (const field of [
        'companyName',
        'organizationNumber',
        'contactName',
        'street',
        'postalCode',
        'city',
        'phone',
      ] as const) {
        this.form.controls[field].addValidators(Validators.required);
        this.form.controls[field].updateValueAndValidity();
      }
    }

    if (this.id()) {
      this.loadEntity();
    }
  }

  protected submit(): void {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    if (this.entity() === 'customer') {
      this.saveCustomer();
    } else {
      this.saveEmployee();
    }
  }

  private loadEntity(): void {
    const id = this.id();
    if (!id) {
      return;
    }

    this.loading.set(true);
    const onError = (error: unknown) => {
      this.error.set(getApiErrorMessage(error));
      this.loading.set(false);
    };

    if (this.entity() === 'customer') {
      this.api.getCustomer(id).subscribe({
        next: (customer) => {
          this.form.patchValue(customer);
          this.loading.set(false);
        },
        error: onError,
      });
    } else {
      this.api.getEmployee(id).subscribe({
        next: (employee) => {
          this.form.patchValue(employee);
          this.loading.set(false);
        },
        error: onError,
      });
    }
  }

  private saveCustomer(): void {
    const values = this.form.getRawValue();
    const request = {
      companyName: values.companyName,
      organizationNumber: values.organizationNumber,
      contactName: values.contactName,
      street: values.street,
      postalCode: values.postalCode,
      city: values.city,
      phone: values.phone,
    };
    const id = this.id();
    const operation = id
      ? this.api.updateCustomer({ ...request, id })
      : this.api.createCustomer(request);

    operation.subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/customers']);
      },
      error: (error: unknown) => {
        this.error.set(getApiErrorMessage(error));
        this.saving.set(false);
      },
    });
  }

  private saveEmployee(): void {
    const values = this.form.getRawValue();
    const request = {
      ssid: values.ssid,
      title: values.title,
      givenName: values.givenName,
      surname: values.surname,
      street: values.street,
      postalCode: values.postalCode,
      city: values.city,
      phone: values.phone,
    };
    const id = this.id();
    const operation = id
      ? this.api.updateEmployee({ ...request, id })
      : this.api.createEmployee(request);

    operation.subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/employees']);
      },
      error: (error: unknown) => {
        this.error.set(getApiErrorMessage(error));
        this.saving.set(false);
      },
    });
  }
}
