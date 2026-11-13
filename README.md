# WebApplication1Client

This project uses [Angular CLI](https://github.com/angular/angular-cli) version 22.2.6.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
npx ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
npx ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, run:

```bash
npm test
```

## Angular Material

Angular Material and the CDK are installed. The global Material 3 theme and base
styles are configured in `src/styles.scss`; the root component imports the
standalone Material modules it uses. Import additional Material modules in a
component's `imports` array when adding Material components.

## Customers and employees

The app's CRUD routes are declared in `src/app/app.routes.ts`. Customer and employee
routes are eagerly loaded; workload views use `loadComponent` and are lazy-loaded:

- `/customers` lists customers. Use `/customers/new` to add one,
  `/customers/:id` to see its details, and `/customers/:id/edit` to update it.
- `/employees` lists employees. Use `/employees/new` to add one,
  `/employees/:id` to see its details, and `/employees/:id/edit` to update it.
- `/workloads` lists and filters work periods by employee and/or customer.
  Use `/workloads/new` to start a period; active periods can be stopped from the list.

To lazy-load a standalone page, remove its static component import and use
`loadComponent` with a dynamic import instead. For example, the customer list route
could be written like this:

```ts
{
  path: 'customers',
  loadComponent: () =>
    import('./features/customers/customer-list.component')
      .then((m) => m.CustomerListComponent),
}
```

## API integration

The root-provided `ApiService` wraps the customer, employee, and workload endpoints.
Its typed methods and request/response models are in
`src/app/core/services/api.service.ts` and `src/app/core/models/api.models.ts`.
The running API publishes its OpenAPI document at
[`https://localhost:7086/openapi/v1.json`](https://localhost:7086/openapi/v1.json).

The API base URL is configured in `src/environments/environment.ts` for development
and `src/environments/environment.production.ts` for production. Both currently use
`https://localhost:7086`; update the production value before deploying. Angular's
production build replaces the development environment file automatically. Start the
local API with a trusted HTTPS development certificate and allow the Angular
development origin (typically `http://localhost:4200`) in the API's CORS configuration.
The API currently has no endpoint for listing all workloads at once, so the workloads
view gathers them from the per-employee endpoints.

Inject the service into a component or another service and subscribe to its
`Observable` to make a request:

```ts
private readonly api = inject(ApiService);

loadCustomers(): void {
  this.api.getCustomers().subscribe(({ customers }) => {
    console.log(customers);
  });
}
```

## End-to-end tests

No end-to-end testing framework is currently installed or configured. The project
currently has unit tests only; choose and configure an e2e runner before adding
end-to-end tests.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
