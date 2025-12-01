# OtshopFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.4. as part of a university course called "Advanced web programming" 
It communicates with the Spring Boot backend to handle authentication, product browsing, and user functionality.

## Features
- User authentication via JWT (login, signup)
- Admin panel access for admin users
- Product creation and managing for admin users
- Product browsing with filters and sorting for all users
- Viewing product details
- Managing favourites and purchases for customer users
- Responsive UI using Bootstrap 5
  * The logic of actual in-app purchase and messaging left unimplemented, as it was beyond course requirements

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
