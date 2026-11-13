import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Employee } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { getApiErrorMessage } from '../shared/api-error';
import { DeleteConfirmDialogComponent } from '../shared/delete-confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  imports: [MatButtonModule, MatProgressBarModule, MatTableModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly dialog = inject(MatDialog);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly displayedColumns = ['name', 'title', 'city', 'phone', 'actions'];

  ngOnInit(): void {
    this.loadEmployees();
  }

  protected loadEmployees(): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getEmployees().subscribe({
      next: ({ employees }) => {
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(getApiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected deleteEmployee(employee: Employee): void {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        role: 'alertdialog',
        data: {
          title: 'Radera anställd?',
          message: `Vill du radera ${employee.givenName} ${employee.surname}?`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.error.set('');
        this.api.deleteEmployee(employee.id).subscribe({
          next: () => this.loadEmployees(),
          error: (error: unknown) => this.error.set(getApiErrorMessage(error)),
        });
      });
  }
}
