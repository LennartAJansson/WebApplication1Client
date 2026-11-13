import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('gets employees from the configured API', () => {
    service.getEmployees().subscribe((response) => {
      expect(response.employees).toEqual([]);
    });

    const request = httpTestingController.expectOne(`${environment.apiBaseUrl}/employees`);
    expect(request.request.method).toBe('GET');
    request.flush({ employees: [] });
  });

  it('sends the employee ID in the DELETE request body', () => {
    service.deleteEmployee('employee-id').subscribe();

    const request = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/employee/employee-id`,
    );
    expect(request.request.method).toBe('DELETE');
    expect(request.request.body).toEqual({ id: 'employee-id' });
    request.flush({});
  });
});
