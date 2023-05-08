# Model Generator
[![Generic badge](https://img.shields.io/badge/Generator%20for-%20Typescript-9F7AEA.svg)](https://docs.nestjs.com/recipes/sql-sequelize)

This is a Node application is designed to quickly set up basic database models for a program built on [sequelize-typescript](https://github.com/sequelize/sequelize-typescript).

## Authors

- [@ToastBubbles](https://www.github.com/ToastBubbles)

## Run Locally

Clone the project

```bash
  git clone https://github.com/ToastBubbles/nestjs-sequelize-model-generator
```

Go to the project directory

```bash
  cd nestjs-sequelize-model-generator
```

Install dependencies

```bash
  npm install
```

Build the project

```bash
  node index
```

Once prompted, type in the name of your model in camelCase, then when prompted again, enter the model name in plural camelCase.

Once the program is complete, your files will be waiting in the `output` folder.

Make sure to read the notes in the terminal, you may also have to manually change the import statements depending on your project structure.
