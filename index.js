const fs = require("fs");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Please enter the name of your model in camelCase...', name => {

    readline.question('Please enter the plural name of your model in camelCase...', plural => {

        console.log(`Generating files for ${name}...`);
        readline.close();
        genEntity(name, plural)
    })

});

async function save(content, fileName) {
    try {
        await fs.writeFileSync(`output/${fileName}`, content);
    } catch (e) {
        console.log(e);
    }
}

async function genEntity(name, plural) {
    console.log("Generating Entity...");
    let content = `
    import { Table, Column, Model } from 'sequelize-typescript';

    @Table
    export class ${capitolizeFirst(name)} extends Model {
    @Column
    name: string;

    }
    `
    await save(content, `${name}.entity.ts`).then(() => {
        genController(name, plural)
    })
}
async function genController(name, plural) {
    console.log("Generating Controller...");
    let content = `
    import { Controller, Get } from '@nestjs/common';
    import { ${capitolizeFirst(name)} } from 'src/models/${name}.entity';
    import { ${capitolizeFirst(plural)}Service } from '../services/${name}.service';
    
    @Controller('${name}')
    export class ${capitolizeFirst(plural)}Controller {
      constructor(private readonly ${plural}Service: ${capitolizeFirst(plural)}Service) {}
    
      @Get()
      async getAll${capitolizeFirst(plural)}(): Promise<${capitolizeFirst(name)}[]> {
        return this.${plural}Service.findAll();
      }
    }
    `
    await save(content, `${name}.controller.ts`).then(() => {
        genProviders(name, plural)
    })
}
async function genProviders(name, plural) {
    console.log("Generating Provider...");
    let content = `
    import { ${capitolizeFirst(name)} } from '../models/${name}.entity';

    export const ${plural}Providers = [
    {
        provide: '${name.toUpperCase()}_REPOSITORY',
        useValue: ${capitolizeFirst(name)},
    },
    ];
    `
    await save(content, `${name}.providers.ts`).then(() => {
        genService(name, plural)
    })
}
async function genService(name, plural) {
    console.log("Generating Service...");
    let content = `
    import { Injectable, Inject } from '@nestjs/common';
    import { ${capitolizeFirst(name)} } from '../models/${name}.entity';

    @Injectable()
    export class ${capitolizeFirst(plural)}Service {
    constructor(
        @Inject('${name.toUpperCase()}_REPOSITORY')
        private ${plural}Repository: typeof ${capitolizeFirst(name)},
    ) {}
    
    async findAll(): Promise<${capitolizeFirst(name)}[]> {
        return this.${plural}Repository.findAll<${capitolizeFirst(name)}>();
    }
    }
    `
    await save(content, `${name}.service.ts`).then(() => {
        genModule(name, plural)
    })
}
async function genModule(name, plural) {
    console.log("Generating Module...");
    let content = `
    import { Module } from '@nestjs/common';
    import { ${capitolizeFirst(plural)}Controller } from '../controllers/${name}.controller';
    import { ${capitolizeFirst(plural)}Service } from '../services/${name}.service';
    import { ${plural}Providers } from '../providers/${name}.providers';
    import { DatabaseModule } from './database.module';

    @Module({
    imports: [DatabaseModule],
    controllers: [${capitolizeFirst(plural)}Controller],
    providers: [${capitolizeFirst(plural)}Service, ...${plural}Providers],
    })
    export class ${capitolizeFirst(name)}Module {}
    `
    await save(content, `${name}.module.ts`).then(() => {
        finalThoughts(name, plural)
    })
}

function finalThoughts(name) {
    console.log("Done!");
    console.log(`Don't forget to add ${name} to app.module and database.providers! Also to customize your columns!`);
}

function capitolizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}