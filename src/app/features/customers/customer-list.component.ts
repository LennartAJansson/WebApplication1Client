import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Customer } from '../../core/models/api.models';
import { getApiErrorMessage } from '../shared/api-error';
import { DeleteConfirmDialogComponent } from '../shared/delete-confirm-dialog.component';

@Component({
  selector: 'app-customer-list',
  imports: [MatButtonModule, MatProgressBarModule, MatTableModule, RouterLink],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly dialog = inject(MatDialog);

  protected readonly customers = signal<Customer[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly displayedColumns = ['companyName', 'contactName', 'city', 'phone', 'actions'];

  ngOnInit(): void {
    this.loadCustomers();
  }

  protected loadCustomers(): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getCustomers().subscribe({
      next: ({ customers }) => {
        this.customers.set(customers);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(getApiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected deleteCustomer(customer: Customer): void {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        role: 'alertdialog',
        data: {
          title: 'Radera kund?',
          message: `Vill du radera kunden ${customer.companyName}?`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.error.set('');
        this.api.deleteCustomer(customer.id).subscribe({
          next: () => this.loadCustomers(),
          error: (error: unknown) => this.error.set(getApiErrorMessage(error)),
        });
      });
  }
}
