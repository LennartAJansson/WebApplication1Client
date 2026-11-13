import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateCustomerRequest,
  CreateCustomerResponse,
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  CustomersResponse,
  DeleteCustomerResponse,
  DeleteEmployeeRequest,
  DeleteEmployeeResponse,
  EmployeesResponse,
  GetCustomerResponse,
  GetEmployeeResponse,
  StartWorkloadRequest,
  StopWorkloadRequest,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
  Workload,
  WorkloadCustomersResponse,
  WorkloadEmployeesResponse,
  WorkloadsResponse,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getEmployees(): Observable<EmployeesResponse> {
    return this.http.get<EmployeesResponse>(`${this.baseUrl}/employees`);
  }

  getEmployee(id: string): Observable<GetEmployeeResponse> {
    return this.http.get<GetEmployeeResponse>(`${this.baseUrl}/employee/${encodeURIComponent(id)}`);
  }

  createEmployee(request: CreateEmployeeRequest): Observable<CreateEmployeeResponse> {
    return this.http.post<CreateEmployeeResponse>(`${this.baseUrl}/employee`, request);
  }

  updateEmployee(request: UpdateEmployeeRequest): Observable<UpdateEmployeeResponse> {
    return this.http.put<UpdateEmployeeResponse>(`${this.baseUrl}/employee`, request);
  }

  deleteEmployee(id: string): Observable<DeleteEmployeeResponse> {
    const request: DeleteEmployeeRequest = { id };
    return this.http.request<DeleteEmployeeResponse>(
      'DELETE',
      `${this.baseUrl}/employee/${encodeURIComponent(id)}`,
      { body: request },
    );
  }

  getCustomers(): Observable<CustomersResponse> {
    return this.http.get<CustomersResponse>(`${this.baseUrl}/customers`);
  }

  getCustomer(id: string): Observable<GetCustomerResponse> {
    return this.http.get<GetCustomerResponse>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`);
  }

  createCustomer(request: CreateCustomerRequest): Observable<CreateCustomerResponse> {
    return this.http.post<CreateCustomerResponse>(`${this.baseUrl}/customers`, request);
  }

  updateCustomer(request: UpdateCustomerRequest): Observable<UpdateCustomerResponse> {
    return this.http.put<UpdateCustomerResponse>(`${this.baseUrl}/customers`, request);
  }

  deleteCustomer(id: string): Observable<DeleteCustomerResponse> {
    return this.http.delete<DeleteCustomerResponse>(
      `${this.baseUrl}/customers/${encodeURIComponent(id)}`,
    );
  }

  startWorkload(request: StartWorkloadRequest): Observable<Workload> {
    return this.http.post<Workload>(`${this.baseUrl}/workload`, request);
  }

  stopWorkload(id: string): Observable<Workload> {
    const request: StopWorkloadRequest = { id };
    return this.http.put<Workload>(
      `${this.baseUrl}/workload/${encodeURIComponent(id)}/stop`,
      request,
    );
  }

  getWorkloadsByEmployee(employeeId: string): Observable<WorkloadsResponse> {
    return this.http.get<WorkloadsResponse>(
      `${this.baseUrl}/workloads/employee/${encodeURIComponent(employeeId)}`,
    );
  }

  getWorkloadsByCustomer(customerId: string): Observable<WorkloadsResponse> {
    return this.http.get<WorkloadsResponse>(
      `${this.baseUrl}/workloads/customer/${encodeURIComponent(customerId)}`,
    );
  }

  getWorkloadEmployees(): Observable<WorkloadEmployeesResponse> {
    return this.http.get<WorkloadEmployeesResponse>(`${this.baseUrl}/workloademployees`);
  }

  getWorkloadCustomers(): Observable<WorkloadCustomersResponse> {
    return this.http.get<WorkloadCustomersResponse>(`${this.baseUrl}/workloadcustomers`);
  }
}
