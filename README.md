# FastestimatorWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.1.

## prerequisite

1. Install [node.js](https://nodejs.org/en/)
2. Run `npm install -g @angular/cli` to install [Angular CLI]

## Setup

Run `npm install` in the repo folder to install all angular dependency.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

### normal (SPA)
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### server-side rendering (SSR)
Run `npm run build:ssr` to build the project. To serve the build dist, run `npm run serve:ssr`

## Deploy

### github page

Build the website with prod settings using the following command: `ng build --prod --base-href "https://fastestimator.org/"`.
Once build is done, use `ngh` to automatically push to gh-pages branch. Then create a pull request to deploy to prod.

### google app engine

1. install google cloud cli
2. run `gcloud init` to initialize gcloud project and login
3. gcloud app deploy

* to logout `gcloud auth revoke`
* to login `gcloud auth login`
* to unset project `gcloud config unset project`
* to set project `gcloud config set project <project ID>`

### Elastic Beanstalk
1. compress `dist` folder and `package.json` into a zip file
2. upload the zip file to EBS.


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
