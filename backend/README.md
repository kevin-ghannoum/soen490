# Soen 490 Backend

- [Soen 490 Backend](#soen-490-backend)
  - [Description](#description)
  - [Technology](#technology)
  - [Database](#database)
  - [Documentation](#documentation)
  - [Project setup](#project-setup)
  - [Testing](#testing)
  - [Code convention](#code-convention)
  - [Code formatting](#code-formatting)

### Description

This is the backend source code for Soen 490 Capstone (badob tech). The following readme contains information about our technology stack. As well as basic documentation on how to setup and run the backend application.

### Technology

The main programming language for the backend is **Typescript** in a **Node** runtime environment. The following is a list of technologies we are using with Typescript/Node to develop the application.

- [Express (web framework)](https://expressjs.com/)
- [Tsyringe (dependency injection)](https://github.com/microsoft/tsyringe)
- [Jest (unit testing)](https://jestjs.io/)

### Database

The main database is implemented with [MySQL](https://www.mysql.com/). The application uses an ORM to facilate manipulating from the database using an object-oriented paradigm. The ORM used is [Sequalize](https://sequelize.org/).

### Documentation

[Wiki]()

### Project setup

Prerequisites:

- Node JS (12 or above)
- Typescript
- MySQL

Initial setup:
When you first cloned the project, you need to install all the required packages. To install you can simply run the following command in the root of backend project (where the package.json is located): `npm install`. You can find the list of dependencies in the [package.json](package.json).

Once the packages have been install, there's a couple of way of running the application.

_Development mode_: `npm run dev`

> Development mode is used when developing the app. It allow for fast recompilation in order to test features.
>
> > _Debug mode_: `npm run debug`
> > Debug mode is similar to development mode but all the logs will be printed to the console to facilate debugging
>
> _Distribution build_: `npm run start`
> Distribution build compiles the Typescript code into Javascript in order to be use in production

### Testing

The unit testing framework use is Jest. In order to run the test, run the following command: `npm test`.

### Code convention

The source code is following the main convention define by [ESLint for Typescript](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin). There are a few exception we added to our project which can be found in [.eslintrc.json](.eslintrc.json)

### Code formatting

The soource code is using the default formatter setting from [prettier](https://prettier.io/) with a few exception which can be found in [.prettierrc.json](.prettierrc.json)
