
const chalk=require('chalk');
const SequelizeAuto = require('sequelize-auto');
let db=require('./databaseConn');//db is the sequelize instance with connection
const options={
directory: './models', // where to write files
//port: 'port',
//caseModel: 'c', // convert snake_case column names to camelCase field names: user_id -> userId
//caseFile: 'c', // file names created for each model use camelCase.js not snake_case.js
//singularize: true, // convert plural table names to singular model names
additional: {
    timestamps: true
    // ...options added to each model
},
//tables: ['table1', 'table2', 'myschema.table3'] // use all tables, if omitted
}

//might introduce cron task here
const auto = new SequelizeAuto(db, null, null, options);
/*auto.run();*/

// const initializeModels=require('./models/init-models');
// console.log(typeof initializeModels);
// initializeModels(db);
// console.log('db.models',db.models);
selectFrom=async()=>{
   let docs= await db.models.demosequelizer.findAll({
        attributes: ['version','founder','office_address']
    })
    console.log(chalk.yellow.inverse(JSON.stringify(docs)))
}
//selectFrom();

insertInto=async()=>{
const doc = await db.models.demosequelizer.create({ version: 5, founder:'Shinde',office_addres: 'Dallas,TX' });
//console.log("Jane's auto-generated ID:", jane.id);
console.log('Inserted doc--->',doc);
}
//insertInto();

module.exports={auto}
