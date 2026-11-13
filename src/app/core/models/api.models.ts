export interface ApiLink {
  href: string;
  rel: string;
  method: string;
}

export interface Customer {
  id: string;
  companyName: string;
  organizationNumber: string;
  contactName: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  links?: ApiLink[];
}

export interface CreateCustomerRequest {
  companyName: string;
  organizationNumber: string;
  contactName: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
  id: string;
}

export interface CustomersResponse {
  customers: Customer[];
  links?: ApiLink[];
}

export type CreateCustomerResponse = Customer;
export type GetCustomerResponse = Customer;
export type UpdateCustomerResponse = Customer;
export type DeleteCustomerResponse = Customer;

export interface Employee {
  id: string;
  ssid: string;
  title: string;
  givenName: string;
  surname: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  links?: ApiLink[];
}

export interface CreateEmployeeRequest {
  ssid?: string;
  title?: string;
  givenName?: string;
  surname?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
  id?: string;
}

export interface EmployeesResponse {
  employees: Employee[];
  links?: ApiLink[];
}

export type CreateEmployeeResponse = Employee;
export type GetEmployeeResponse = Employee;
export type UpdateEmployeeResponse = Employee;
export type DeleteEmployeeResponse = Employee;

export interface DeleteEmployeeRequest {
  id?: string;
}

export interface StartWorkloadRequest {
  customerId?: string;
  employeeId?: string;
  notes?: string;
}

export interface StopWorkloadRequest {
  id?: string;
}

export interface Workload {
  id: string;
  customerId: string;
  employeeId: string;
  start: string;
  stop: string | null;
  notes: string;
  links?: ApiLink[];
}

export interface WorkloadsResponse {
  workloads: Workload[];
  links?: ApiLink[];
}

export interface WorkloadCustomer {
  id: string;
  companyName: string;
  links?: ApiLink[];
}

export interface WorkloadEmployee {
  id: string;
  givenName: string;
  surname: string;
  links?: ApiLink[];
}

export interface WorkloadCustomersResponse {
  customers: WorkloadCustomer[];
  links?: ApiLink[];
}

export interface WorkloadEmployeesResponse {
  employees: WorkloadEmployee[];
  links?: ApiLink[];
}
