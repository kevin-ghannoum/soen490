# SOEN 490 Front End

- [Soen 490 Backend](#soen-490-backend)
  - [Description](#description)
  - [Technology](#technology)
  - [Documentation](#documentation)
  - [Project setup](#project-setup)
  - [Code convention](#code-convention)
  - [Code formatting](#code-formatting)

## Description

This is the source code for the front end for SOEN 490 Capstone (Badob Tech). The Readme contains documentation on how to setup and run the application as well as information about the technology stack used.

## Technology

The main programming language for our web application is **HTML**, **CSS**, **Typescript**, with ReactJs as the framework. The following list is the technologies we will be using to develop and maintain the application.

- [Enzyme (UI Testing)](https://enzymejs.github.io/enzyme/)
- [Jest (unit testing)](https://jestjs.io/)

## Documentation

[Wiki]()

## Project Setup

Prerequisites:

- NodeJS (version 12 or above)

Initial Setup:
Run `npm install` in the root of the frontend folder to install all the required dependencies. You can find the list of dependencies in the [package.json](package.json).

Once the packages have been install, there are a couple of commands to get you started:

`npm start`

> Runs the app in the development mode.<br />
> Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
>
> >

`npm test`

> Launches the test runner in the interactive watch mode.<br />
> Configured to use the framework Enzyme for UI testing.
>
> >

`npm run build`

> Builds the app for production to the `build` folder.<br />
> It correctly bundles React in production mode and optimizes the build for the best performance.
>
> >

## Code convention

The source code is following the main convention define by [ESLint for Typescript](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin). There are a few exception we added to our project which can be found in [.eslintrc.json](.eslintrc.json)

## Code formatting

The soource code is using the default formatter setting from [prettier](https://prettier.io/) with a few exception which can be found in [.prettierrc.json](.prettierrc.json)
