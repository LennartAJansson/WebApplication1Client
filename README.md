# WebApplication1Client

This project uses [Angular CLI](https://github.com/angular/angular-cli) version 22.2.6.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

### Recreate the folder structure

Run [scripts/New-ClientStructure.ps1](scripts/New-ClientStructure.ps1) from PowerShell
to create a separate Angular project using only CLI-generated boilerplate:

```powershell
.\scripts\New-ClientStructure.ps1 -ProjectName DemoClient -ParentDirectory D:\Projects
```

The parent directory must exist; the target project directory must not already
exist. Node.js compatible with Angular CLI 22.2.6, npm, and internet access are
required. The script runs `ng new`, installs Material/CDK and Prettier using
`npm install`, generates the components, API service, interfaces, guard,
interceptor, and environments, then builds the project. It skips Git initialization.
New files within a project are generated with `ng generate`, not `ng new`.

The generated files contain only the CLI's default boilerplate, not this app's
implementation. Routes remain empty and the guard/interceptor are not registered.
Material is installed but no theme or toolbar is configured. `api.models.ts` and
`api-error.ts` each contain an empty generated interface. The dialog placeholder
has separate HTML/SCSS files. Environment generation follows Angular's defaults:
`environment.ts` for production and `environment.development.ts` for development.
Component, guard, and interceptor tests are skipped; root and service tests remain.

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

## Lazy loading

The workload routes already use lazy loading. To convert an eagerly loaded
standalone page:

1. Replace `component: CustomerListComponent` with `loadComponent` and a dynamic
   import.
2. Remove the static `CustomerListComponent` import from `src/app/app.routes.ts`
   once no other route uses it.
3. Keep any existing `canActivate` and `data` properties on the route.

For example, the customer list route could be written like this:

```ts
{
  path: 'customers',
  loadComponent: () =>
    import('./features/customers/customer-list.component')
      .then((m) => m.CustomerListComponent),
}
```

Angular creates a separate lazy chunk for the dynamically imported page, which is
loaded when the route is visited. A remaining eager reference to the same component
can keep it in the initial bundle.

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

## Guard and interceptor placeholders

`placeholderGuard` in `src/app/core/guards/placeholder.guard.ts` is connected to the
customer detail route (`customers/:id`) via `canActivate` in `src/app/app.routes.ts`.
It currently always allows navigation. Replace its body with an access check and,
if needed, return a `UrlTree` to redirect. Apply it to other routes via their
`canActivate` arrays. Client-side guards do not replace authorization in the API.

`placeholderInterceptor` in `src/app/core/interceptors/placeholder.interceptor.ts`
is registered via `provideHttpClient(withInterceptors([placeholderInterceptor]))`
in `src/app/app.config.ts`. It currently forwards every request unchanged. This is
the extension point for shared request headers or response handling.

## End-to-end tests

No end-to-end testing framework is currently installed or configured. The project
currently has unit tests only; choose and configure an e2e runner before adding
end-to-end tests.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
