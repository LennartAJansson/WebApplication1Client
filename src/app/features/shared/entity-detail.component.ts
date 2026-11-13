import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { getApiErrorMessage } from './api-error';

type EntityType = 'customer' | 'employee';
interface DetailField {
  label: string;
  value: string;
}

@Component({
  selector: 'app-entity-detail',
  imports: [MatButtonModule, MatCardModule, MatProgressBarModule, RouterLink],
  templateUrl: './entity-detail.component.html',
  styleUrl: './entity-detail.component.scss',
})
export class EntityDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  protected readonly entity = signal<EntityType>('customer');
  protected readonly id = signal('');
  protected readonly title = signal('');
  protected readonly fields = signal<DetailField[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    const entity = this.route.snapshot.data['entity'];
    const id = this.route.snapshot.paramMap.get('id');
    if ((entity !== 'customer' && entity !== 'employee') || !id) {
      this.error.set('Posten kunde inte hittas.');
      this.loading.set(false);
      return;
    }

    this.entity.set(entity);
    this.id.set(id);

    if (entity === 'customer') {
      this.api.getCustomer(id).subscribe({
        next: (customer) => {
          this.title.set(customer.companyName);
          this.fields.set([
            { label: 'Organisationsnummer', value: customer.organizationNumber },
            { label: 'Kontaktperson', value: customer.contactName },
            { label: 'Gatuadress', value: customer.street },
            { label: 'Postnummer', value: customer.postalCode },
            { label: 'Ort', value: customer.city },
            { label: 'Telefon', value: customer.phone },
          ]);
          this.loading.set(false);
        },
        error: (error: unknown) => this.handleError(error),
      });
      return;
    }

    this.api.getEmployee(id).subscribe({
      next: (employee) => {
        this.title.set(`${employee.givenName} ${employee.surname}`.trim());
        this.fields.set([
          { label: 'Personnummer', value: employee.ssid },
          { label: 'Titel', value: employee.title },
          { label: 'Gatuadress', value: employee.street },
          { label: 'Postnummer', value: employee.postalCode },
          { label: 'Ort', value: employee.city },
          { label: 'Telefon', value: employee.phone },
        ]);
        this.loading.set(false);
      },
      error: (error: unknown) => this.handleError(error),
    });
  }

  private handleError(error: unknown): void {
    this.error.set(getApiErrorMessage(error));
    this.loading.set(false);
  }
}
